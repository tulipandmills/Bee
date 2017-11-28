var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var personSchema = new Schema({
	firstName: String,
	lastName: String,
	age: Number
});



personSchema.methods.fullName = function() {
  return this.first + " " + this.last;
};


var Person = mongoose.model('Person', personSchema);

// make this available to our users in our Node applications
module.exports = Person;