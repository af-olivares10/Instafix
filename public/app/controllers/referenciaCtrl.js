angular.module('referenciaCtrl', ['servicioService'])

.controller('referenciaController', ['Servicio','$scope','$window','$rootScope','Auth','$route','$http','$location',function(Servicio, $scope,$window,$rootScope,Auth,$route,$http,$location) {

  vm = this;


  function chunk(arr, size) {
    var newArr = [];
    if(arr){
      for (var i=0; i<arr.length; i+=size) {
        newArr.push(arr.slice(i, i+size));
      }
    }
    return newArr;
  }
  vm.enviar = function()
  {
    Auth.getUser()
    .then(function(data) {
      var ref = {
        estrellas: vm.referencia.estrellas,
        fixerUsername: $route.current.locals.currentFixer.data.username,
        texto:vm.referencia.texto,
        cliente: {username:data.data.username,perfil:data.data.perfil}
      }
      var obj = {ref:ref,fixerId: $route.current.params.fixer_id}
      $http.post('/api/referencias/',obj).then(function(data){
        $location.path('/inicio');
      }
    );
      });

  }
  //fixer single
    $scope.getEstrellas = function(num) {
      if(num===0)
      return new Array(3);
      return new Array(num);
    }
    $scope.getNoEstrellas = function(num) {
      if(num===0)
      return new Array(2)
      return new Array(5-num);

    }
  $scope.rows = chunk(JSON.parse($window.localStorage.getItem('fixers')),2);



  Servicio.solicitarServicio({})
    .then(function(data) {
      var vac = [];
      if($window.localStorage.getItem('fixers'))
      $window.localStorage.removeItem('fixers') //borrar fixers
      if(data.success){
        $window.localStorage.setItem('fixers', JSON.stringify(data.fixers));
      }
      vm.servicioData = {};

    });


}]);
