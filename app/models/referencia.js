var mongoose = require('mongoose'); // for working w/ our database
var Schema = mongoose.Schema;
var UserSchema = require('./user');

var ReferenciaSchema = new Schema({
estrellas: Number,
fixerUsername: String,
texto:  String,
cliente: UserSchema
 });



 // return the model
module.exports = ReferenciaSchema;//mongoose.model('User', UserSchema);
