var express = require('express')
var app = express();
var dataO = {};

var mongoose = require('mongoose')
var mongoDB = 'mongodb://127.0.0.1/beealpha';
mongoose.connect(mongoDB, {
  useMongoClient: true
});

var async = require('async')
var exphbs  = require('express-handlebars')
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies	
app.use(express.static('public'))
//var models = require('./models.js')




var Item = require('./models/Item');
var forms = require('./forms.js');

var searchobject = {};
var keyword;
 
//app.get('/', function (req, res) {
//  res.send('Hello World');
//})

//app.use(express.static(__dirname+'/client'))

app.get('/', function(req, res){
	res.redirect('/new');
});


app.get('/new/:title/:type/', function(req, res){
	
	var title_string;

	if(req.params.title == "none"){
		title_string = Date.now();
	}else{
		title_string = req.params.title;
	}
	
	var newItem = Item({
	  title: title_string,
	  type: req.params.type
	});
	
	var r = req.params;
	
	newItem.save(function(err) {
		
	if (err){
		r = err.toString();
	}
	
	res.send(r);	  
		
	});
	
});

app.get('/new', function(req, res){
	var form = forms["new"];
	res.render('new',{form:form});
});




app.post('/new', function(req, res, next){
	if(req.body.title || req.body.belongsTo){
		dataO.title = req.body.title;
		dataO.belongsTo = req.body.belongsTo;
		
		Item.find({}, function(err, items){
			var form = forms["selectType"];
			var options = "<option value=''>Select...</option>";
			
			for(var key in items){
				var title = items[key].title;
				options += "<option value='" + title + "'>" + title + "</option>";
			}
			
			
			var html = form.html;
			html = html.replace("[[options]]",options);
			form.html = html;


			res.render('new',{form:form, options: options});	
		})
		
	}else if(req.body.noTitle){
		Item.find({}, function(err, items){
			var form = forms["belongsTo"];
			var options = "<option value=''>Select...</option>";
			
			for(var key in items){
				var id = items[key].id;
				var title = items[key].title;
				options += "<option value='" + id + "'>" + title + "</option>";
			}
			
			
			var html = form.html;
			html = html.replace("[[options]]",options);
			form.html = html;


			res.render('new',{form:form, options: options});	
		})
		
	}else{
		
		dataO.itemType = req.body.itemType;
		
		var newItem = Item({
	  		title: dataO.title,
	  		type: dataO.itemType,
			belongsTo: dataO.belongsTo
		});
	
	
		newItem.save(function(err, inserted) {
		
			if (err){
				res.send(err);
			}else{
				console.log(inserted._id);
				dataO.inserted_id = inserted._id;
				var form = forms["addProperty"];
				var options = "<option value=''>Select...</option>";
				Item.find({}, function(err, items){
					
					for(var key in items){
						var id = items[key].id;
						var title = items[key].title;
						options += "<option value='" + id + "'>" + title + "</option>";
					}
					
					var html = form.html;
					html = html.replace("[[options]]",options);
					form.html = html;

				})
			}
				
			

			res.render('new',{form:form, options: options});	
			
		//	console.log(JSON.stringify(dataO));
			//res.render('succes',{data:JSON.stringify(dataO)});
			
		});
		
	}
});


app.get('/q/:title/:q', function(req, res){
	Item.findOneAndUpdate({title: req.params.title}, { $set: {q: req.params.q}}, { runValidators: true, context: 'query' }, function(err,result){
			if(err){
				res.send("Failed: alias " + req.params.q + " already exists for another item");
			}else{
				res.send(result);
			}
		});
})

app.get('/qbyid/:id/:q', function(req, res){
	Item.findOneAndUpdate({_id: req.params.id}, { $set: {q: req.params.q}}, { runValidators: true, context: 'query' }, function(err,result){
			if(err){
				res.send("Failed: alias " + req.params.q + " already exists for another item");
			}else{
				res.send(result);
			}
		});
})

app.get('/add/:q1/:q2', function(req, res){
	var q1 = req.params.q1;
	var q2 = req.params.q2;
	Item.findOne({q: q1}, function(err, o){
		Item.findOne({q:q2}, function(err, o2){
			var props = o.properties;
			var prop = {title: o2.type, value: o2._id};
			console.log(props.length);
			props[props.length] = prop;
			console.log(props);
			Item.findOneAndUpdate({q: q1}, { $set: {properties: props}}, function(err, result){
				res.send(result);	
			});
			
		});

	});
})

function findNextChild(id,c){
	
	
}

function getIdByTitle(title){
	return Item.findOne({title: title});
}


app.get('/find/:string', function(req, res){
	console.log("find @ " + Date.now())
		async.series([
			function(callback){

				searchobject = {}
				var key = req.params.string;
				searchobject[key] = [];
				keyword = key;

				var id = getIdByTitle(req.params.string);
				id.exec(function(e, r){
					console.log(req.params.string)
					
					if(r === null){
						children = false;
					}else{
						console.log("ID found");
						var id = r._id;	
						var description = "MAIN";
						var children = true;
						async.whilst(function(){
							return children;
						},
							function(callback){
							
								console.log("start with main")	
								Item.find({_id: id},function(err, result){
									console.log("finding")
									var h;
									var r = result;
									console.log("--------------------------ITEM (" + description +  ")-------------------------")
									for(var key in r){
										///console.log(result[key]);
										var foo = result[key].type;
										var o = {
											[foo]: result[key].title 
										}

										searchobject[keyword][searchobject[keyword].length] = o;

										var propstring = o;




										console.log(searchobject);
										var c = result[key];
										if(c.properties.length>0){
											for(i=0;i<c.properties.length;i++){
												description = "property";
												//findNextChild(c.properties[0].value, "property");		
												id = c.properties[0].value;
												callback(null, true);
											}
										}else{
											children = false;
											callback(null, false);
										}

									}
								})
							
							}, 
							function(err, results){
								console.log("Done");
								res.json(searchobject);
							});
						
						
								
						
						
						
						
						//callback(null, findNextChild(id, "MAIN ITEM"));		
					}
					
				});
				
			},
		], function(err, results){
				console.log("SO");
				console.log(searchobject);	
				
			
		});
		
			
		
		
		
			
		
	});



app.get('/list', function(req, res){
	Item.find({}, function(err, items){
		res.send(items);
})
	
app.get('/deletebytitle/:title', function(req, res){
	Item.findOneAndRemove({title: req.params.title},function(err){
		if (err) throw err;
		res.send(req.params.title + " removed")
	})
})

app.get('/deletebytype/:type', function(req, res){
	Item.findOneAndRemove({type: req.params.type},function(err){
		if (err) throw err;
		res.send(req.params.type + " removed")
	})
})

app.get('/deletebyid/:id', function(req, res){
	Item.findOneAndRemove({_id: req.params.id},function(err){
		if (err) throw err;
		res.send(req.params.id + " removed")
	})
})


//app.get('/newperson/:first/:last/', function(req, res){
//	
//	var newUser = Person({
//	  firstName: req.params.first,
//	  lastName: req.params.last
//	});
//	
//	newUser.save(function(err) {
//	  if (err) throw err;
//
//	  console.log('User created!');
//	});
//	
//	
//	res.send(req.params)
//})
//
//app.get('/listpeople/', function(req, res){
//	Person.find({}, function(err, people){
//		res.send(people);
//	})
//})
//

//
//app.get('/updateagebyfirstname/:first/:age', function(req, res){
//	Person.findOneAndUpdate({firstName: req.params.first},{"age": req.params.age},function(err){
//		if (err) throw err;
//		res.send(req.params.first + " age updated")
//	})
});
 
app.listen(80)