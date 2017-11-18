var mongoose = require('mongoose'); // for working w/ our database
var UserSchema       = require('../models/user');
var User = mongoose.model('User', UserSchema);
var ReferenciaSchema       = require('../models/referencia');
var Referencia       = mongoose.model('Referencia', ReferenciaSchema);

var jwt        = require('jsonwebtoken');
var config     = require('../../config');
var cloudinary = require('cloudinary');
var fs = require('fs');
cloudinary.config({
	cloud_name: 'af-olivares10',
	api_key: '191429111538125',
	api_secret: 'UrRDUkMQyif7p6u7EY2wQqg17bo'
});
// super secret for creating tokens
var superSecret = config.secret;
var multer = require('multer');
module.exports = function(app, express) {

	var apiRouter = express.Router();

	apiRouter.route('/users')

	// create a user (accessed at POST http://localhost:8080/api/users)
	.post(function(req, res) {

		if((req.body.name&&req.body.username&&req.body.password)){
			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)
			user.ofertante = req.body.ofertante;
			user.alba = req.body.alba;
			user.carp = req.body.carp;
			user.elec = req.body.elec;
			user.jard = req.body.jard;
			user.pint = req.body.pint;
			user.plom = req.body.plom;
			user.ciudad = req.body.ciudad;
			user.descripcion = req.body.descripcion;
			user.direccion = req.body.direccion;
			user.perfil = req.body.perfil;
			user.telefono = req.body.telefono;
			user.estrellas = req.body.estrellas;
			user.votos = req.body.votos;
			user.trabajos = [];
			var i = 0;
			for(var key in  req.body.trabajos){ user.trabajos[i] =  req.body.trabajos[i]; i++; }
			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000)
					return res.json({ success: false, message: 'Ya existe un usuario con ese login. '});
					else
					return res.send(err);
				}

				// return a message
				res.json({ success: true, message: 'User created!' });
			});
		}
		else
		return res.json({ success: false, message: 'Ingrese todos los campos.'});

	});
	//mover para que requiera token!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	apiRouter.post('/solicitarServicio',function(req, res) {
		var servicio = req.body;
		User.find(function(err, result) {
			if (err) throw err;
			var  i = 0;
			var users = result.slice(0,result.length); //[];
			//for(var key in result){ users[i] = result[i]; i++; }
			//i = 0;
			for(; i < result.length;i++)
			{
				if( !result[i].ofertante){
					console.log('1');
					users.splice(users.indexOf(result[i]),1);

					continue;
				}
				if(servicio.ciudad ){
					if(servicio.ciudad != result[i].ciudad){
						users.splice(users.indexOf(result[i]),1);
						console.log('2');
						continue;
					}
				}
				if(servicio.alba && !result[i].alba)	{
					users.splice(users.indexOf(result[i]),1)
					console.log('3');
					continue;
				}
				if(servicio.carp && !result[i].carp){
					users.splice(users.indexOf(result[i]),1)
					console.log('4');
					continue;
				}
				if(servicio.elec && !result[i].elec){
					users.splice(users.indexOf(result[i]),1)
					console.log('5');

					continue;
				}
				if(servicio.jard && !result[i].jard){
					users.splice(users.indexOf(result[i]),1)
					console.log('6');
					continue;
				}
				if(servicio.pint && !result[i].pint){
					users.splice(users.indexOf(result[i]),1)
					console.log('7');
					continue;
				}
				if(servicio.plom && !result[i].plom){
					users.splice(users.indexOf(result[i]),1)
					console.log('8');
					continue;
				}

			}

			if (users.length == 0) {
				res.json({
					success: false,
					message: 'Lo sentimos, actualmente no tenemos un fixer que puedan hacer esos trabajos.'
				});
			}
			else if (users){
				res.json({
					success: true,
					message: 'Fixers encontrados',
					fixers: users
				});
			}
		});
	});
	var storage = multer.diskStorage({ //multers disk storage settings
		destination: function (req, file, cb) {
			cb(null, __dirname+'/../../public/uploads' )
		},
		filename: function (req, file, cb) {
			var datetimestamp = Date.now();
			cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
		}
	});

	var upload = multer({ //multer settings
		storage: storage
	}).any();
	var uploadSingle = multer({ //multer settings
		storage: storage
	}).single('foto');
	/** API path that will upload the files */

	apiRouter.post('/subirFotos', function(req, res) {
		upload(req,res,function(err){
			if(err){
				console.log(err);
				res.json({error_code:1,err_desc:err});
				return;
			}
			var routes = [];
			var objectKeys = Object.keys(req.files);
			var ID = 0;
			if (ID < objectKeys.length)
			doCall(objectKeys[ID]);

			function doCall(key) {
				cloudinary.uploader.upload(__dirname+'/../../public/uploads/'+req.files[ID].filename, function(result) {
					routes.push(result.url);
					ID++;
					if ( ID < objectKeys.length)
					doCall(objectKeys[ID]);
					else {
						req.files.forEach(function(item, index, array) {
							fs.unlink(__dirname+'/../../public/uploads/'+item.filename, function(err) {
								console.log(err);
							});
						});
						res.json({error_code:0,err_desc:null, routes:routes});
					}
				});
			}
		});
	});

	apiRouter.post('/fixer/subirFotoPerfil', function(req, res) {
		uploadSingle(req,res,function(err){
			if(err){
				console.log(err);
				res.json({error_code:1,err_desc:err});
				return;
			}
			cloudinary.uploader.upload(__dirname+'/../../public/uploads/'+req.file.filename, function(result) {
				fs.unlink(__dirname+'/../../public/uploads/'+req.file.filename, function(err) {
					console.log(err);
				});
				res.json({error_code:0,err_desc:null, route:result.url});
			});
		})
	});
	apiRouter.post('/fixer/FotosTrabajo', function(req, res) {
		upload(req,res,function(err){
			if(err){
				console.log(err);
				res.json({error_code:1,err_desc:err});
				return;
			}
			var routes = [];
			req.files.forEach(function(item, index, array) {
				cloudinary.uploader.upload(__dirname+'/../../public/uploads/'+item.filename, function(result) {
					routes.push(result.url);
				});
			});
			res.json({error_code:0,err_desc:null, routes:routes});
		})
	});


	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {

		// find the user
		User.findOne({
			username: req.body.username
		}).select('name username password ofertante perfil').exec(function(err, user) {
			if (err) throw err;

			// no user with that username was found
			if (!user) {
				res.json({
					success: false,
					message: 'El nombre de usuario no existe.'
				});
			} else if (user) {

				// check if password matches
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json({
						success: false,
						message: 'Contraseña incorrecta'
					});
				} else {

					// if user is found and password is right
					// create a token
					var token = jwt.sign({
						name: user.name,
						username: user.username,
						perfil: user.perfil
					}, superSecret, {
						expiresIn: '24h' // expires in 24 hours
					});
					// return the information including token as JSON
					res.json({
						success: true,
						message: 'Enjoy dyour token!',
						token: token,
						ofertante: user.ofertante
					});
				}

			}

		});
	});

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Somebody just came to our app!');

		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		// decode token
		if (token) {

			// verifies secret and checks exp
			jwt.verify(token, superSecret, function(err, decoded) {
				if (err)
				return res.json({ success: false, message: 'Failed to authenticate token.' });
				else
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
			});

		} else {

			// if there is no token
			// return an HTTP response of 403 (access forbidden) and an failed message
			return res.status(403).send({
				success: false,
				message: 'No token provided.'
			});

		}

		next(); // make sure we go to the next routes and don't stop here
	});

	// test route to make sure everything is working
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });
	});
	apiRouter.get('/me', function(req, res) {
		return res.send(req.decoded);
	});

	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')



	// get all the users (accessed at GET http://localhost:8080/api/users)
	.get(function(req, res) {
		User.find(function(err, users) {
			if (err) return res.send(err);

			// return the users
			res.json(users);
		});
	});

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')
	// get the user with that id
	.get(function(req, res) {

		User.findById(req.params.user_id, function(err, user) {
			if (err) return res.send(err);
			// return that user
			res.json(user);
		});
	})

	// update the user with this id
	.put(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {

			if (err) return res.send(err);

			// set the new user information if it exists in the request
			if (req.body.name) user.name = req.body.name;
			if (req.body.username) user.username = req.body.username;
			if (req.body.password) user.password = req.body.password;

			// save the user
			user.save(function(err) {
				if (err)return res.send(err);

				// return a message
				res.json({ message: 'User updated!' });
			});

		});
	})

	// delete the user with this id
	.delete(function(req, res) {
		User.remove({
			_id: req.params.user_id
		}, function(err, user) {
			if (err)return  res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});



	apiRouter.get('/referencias/:user_username', function(req, res) {
		Referencia.find(function(err, result) {
			if (err) throw err;
			var  i = 0;
			var referencias = [];
			for(; i < result.length;i++)
			{
				if(result[i].fixerUsername ===	req.params.user_username)
				referencias.push(result[i]);
			}

			if (referencias.length == 0) {
				res.json({
					success: false,
					message: 'Lo sentimos, no hay referencias para ese Fixer.'
				});
			}
			else if (referencias){
				res.json({
					success: true,
					message: 'referencias encontrados',
					referencias: referencias
				});
			}
		});
	});



		apiRouter.post('/referencias/', function(req, res) {
			console.log(req.body);
				var referencia = new Referencia();		// create a new instance of the User model
				referencia.estrellas = req.body.ref.estrellas;  // set the users name (comes from the request)
				referencia.fixerUsername = req.body.ref.fixerUsername;  // set the users username (comes from the request)
				referencia.texto = req.body.ref.texto;  // set the users password (comes from the request)
				referencia.cliente = req.body.ref.cliente;
				referencia.save(function(err) {
					if (err) {
						console.log('fallo');
						console.log(err);
						return res.send(err);
					}
					User.findById(req.body.fixerId, function (err, user) {
					  if (err) return handleError(err);
						user.estrellas = 	parseInt( ( ( parseInt(req.body.ref.estrellas,10)+(user.estrellas*user.votos ) )/(user.votos+1)), 10)
					  user.votos = user.votos +1;
					  user.save(function (err, updatedUser) {
					    if (err) return handleError(err);
							res.json({ success: true, message: 'Referencia creada!' });
					  });
					});
				});
		});


	return apiRouter;
};
