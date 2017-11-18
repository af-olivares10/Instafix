angular.module('servicioService', [])

.factory('Servicio', function($http) {

// create a new object
var servicioFactory = {};


servicioFactory.solicitarServicio = function(servicioData) {
 return $http.post('/api/solicitarServicio/', servicioData);
};

servicioFactory.subirFoto = function(foto) {
 return $http.post('/api/solicitarServicio/subirFoto/', foto);
};
// get a single servicio

// return our entire servicioFactory object
return servicioFactory;

});
