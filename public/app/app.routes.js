angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

	// home page route
	.when('/', {
		templateUrl : 'app/views/pages/home.html',
		controller : 'mainController',
		controllerAs: 'main'
	})
	// login page
	.when('/login', {
		templateUrl : 'app/views/pages/login.html',
		controller : 'mainController',
		controllerAs: 'login'
	})// show all users
	.when('/signUp', {
		templateUrl : 'app/views/pages/signUp.html',
		controller : 'mainController',
		controllerAs: 'main'
	})// show all users
	.when('/inicio', {
		templateUrl: 'app/views/pages/inicio.html',
		controller: 'mainController',
		controllerAs: 'main'
	})
	.when('/nuevo-servicio', {
		templateUrl: 'app/views/pages/nuevoServicio.html',
		controller: 'servicioController',
		controllerAs: 'main'
	})
	.when('/nuevo-servicio/detalle', {
		templateUrl: 'app/views/pages/nuevoServicioDetalle.html',
		controller: 'servicioController',
		controllerAs: 'up'
	})
	.when('/nuevo-servicio/fixers', {
		templateUrl: 'app/views/pages/fixers.html',
		controller: 'servicioController',
		controllerAs: 'main'
	})
	.when('/serviciosDemandante', {
		templateUrl: 'app/views/pages/servicios/serviciosDemandante.html',
		controller: 'mainController',
		controllerAs: 'main'
	})
	.when('/serviciosOfertante', {
		templateUrl: 'app/views/pages/servicios/serviciosOfertante.html',
		controller: 'mainController',
		controllerAs: 'main'
	})
	.when('/nuevo-fixer', {
		templateUrl: 'app/views/pages/nuevoFixer.html',
		controller: 'fixerController',
		controllerAs: 'main'
	})
	.when('/nuevo-fixer/detalle', {
		templateUrl: 'app/views/pages/nuevoFixerDetalle.html',
		controller: 'fixerController',
		controllerAs: 'up'
	})
	.when('/fixers/:fixer_id', {
		templateUrl: 'app/views/pages/fixerSingle.html',
		controller: 'servicioController',
		controllerAs: 'main',
		resolve: {
			 currentFixer: ['$route','$http', function($route,$http) {
					 return $http.get('/api/users/' + $route.current.params.fixer_id);
			 }]
		 }
	})
	.when('/referenciarFixer', {
		templateUrl: 'app/views/pages/fixersR.html',
		controller: 'referenciaController',
		controllerAs: 'main'
	})
	.when('/escribir-referencia/:fixer_id', {
		templateUrl: 'app/views/pages/referencia.html',
		controller: 'referenciaController',
		controllerAs: 'main',
		resolve: {
			 currentFixer: ['$route','$http', function($route,$http) {
					 return $http.get('/api/users/' + $route.current.params.fixer_id);
			 }]
		 }
	})




	;
	// get rid of the hash in the URL
	$locationProvider.html5Mode(true);

});
