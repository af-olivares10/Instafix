 angular.module('userApp', [
 	'ngAnimate',
 	'app.routes',
 	'authService',
 	'mainCtrl',
 	'userCtrl',
 	'userService',
  'servicioCtrl',
  'servicioService',
  'fixerCtrl',
  'referenciaCtrl',
  'imgService'
 	])
 // application configuration to integrate token into requests
 .config(function($httpProvider) {

 // attach our auth interceptor to the http requests
 $httpProvider.interceptors.push('AuthInterceptor');

}).constant('CLURL','https://api.cloudinary.com/v1_1/af-olivares10/image/upload')
.constant('CLPRE','klr3nh0t')
;
