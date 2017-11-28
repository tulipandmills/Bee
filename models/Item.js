var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uniqueValidator = require('mongoose-unique-validator');

// create a schema
var item = new Schema({
	creationDate: { type: Date, default: Date.now },
	title: String,
	belongsTo: String,
	type: String,
	properties: {type: Schema.Types.Mixed, default: Array()},
	value: Schema.Types.Mixed,
	q: {type: String, unique: true}
});

item.plugin(uniqueValidator);



//item.methods.fullName = function() {
//  return this.first + " " + this.last;
//};

item.pre('save', function(next){
	var self = this;
	
	var type = self.type;
	switch(type){
		case "string":
		case "boolean":
		case "set":
		case "integer":
		    next();
			break;
		default:
			var c = 0
			console.log(type);
			Item.count({ title: type}, function(err, count){				
				if(count>0){
					next("Succes");
				}else{
					var err = new Error('The type of (a) <b>' + self.type + '</b> does not exist. Please create one by creating an item with ' + self.type + ' as title');
					next(err);
				}
			});
	}
});


var Item = mongoose.model('Item', item);

// make this available to our users in our Node applications
module.exports = Item;// JavaScript Document