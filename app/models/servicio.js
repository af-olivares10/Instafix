var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose'); // for working w/ our database
var Schema = mongoose.Schema;
var UserSchema    = require('./user');

// schema
var ServicioSchema = new Schema({
tipo: { type: String, required: true, select: true },  //Limpieza, mantenimiento...
estado: { type: String, required: true, select: true }, //Activo, terminado, en espera de confirmacion
lugar: { type: String, required: true, select: true },   // Dirección
cliente: UserSchema,
ofertante: UserSchema
});


 // return the model
module.exports =  ServicioSchema;
