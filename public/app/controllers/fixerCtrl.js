angular.module('fixerCtrl', ['ngFileUpload'])

.controller('fixerController',['Auth','Img','AuthToken', 'User','Upload','$location', '$window',function(Auth,Img, AuthToken, User,Upload, $location , $window) {

  var vm = this;
  // set a processing variable to show loading things
  vm.seleccionarServiciosFixer = function() {
    vm.processing = true;

    if(vm.fixerData){
      if(vm.fixerData.alba||vm.fixerData.elec||vm.fixerData.carp||vm.fixerData.jard||vm.fixerData.pint||vm.fixerData.plom){

        vm.processing = false;
        $location.path('nuevo-fixer/detalle');
        $window.localStorage.setItem('fixerData', JSON.stringify(vm.fixerData));
      }
      else  {
        vm.error = 'Seleccione al menos un servicio';
      }
    }
    else{
      vm.error = 'Seleccione al menos un servicio';
    }
  };
  vm.nuevoFixer= function() {
    if (vm.upload_form.fotos.$valid && vm.fotos && vm.upload_form.perfil.$valid && vm.perfil) {
      vm.upload(vm.perfil, vm.fotos);
    }
    else{
      vm.error = 'Seleccione imágenes válidas.'
    }
  }

  vm.upload = function (perfil, fotos) {
    if(vm.fixerData){
      if(Object.keys(vm.fixerData).length === 7){
        if(!vm.processing){
          vm.processing = true

          Img.subirFoto(perfil)
          .then(function (resp) { //upload function returns a promise
            var result = {};
            var fixerData = JSON.parse($window.localStorage.getItem('fixerData'));
            for(var key in fixerData) result[key] = fixerData[key];
            for(var key in  vm.fixerData) result[key] =  vm.fixerData[key];
            result.perfil = resp.data.url;
            //result.trabajos = Img.subirFotos(fotos);

            $window.token= AuthToken.getToken();
            $window.ofertante = AuthToken.getOfertante();
            var routes = [];
            var ID = 0;
            if (ID < fotos.length)
            doCall(fotos[ID]);

            function doCall(key) {
              AuthToken.setToken( );
              Img.subirFoto(key).then(function(resp){
                routes.push(resp.data.url);
                ID++;
                if ( ID < fotos .length)
                doCall(fotos[ID]);
                else{
                  result.trabajos = routes;
                  result.ofertante = true;
                  result.votos = 0;
                  result.estrellas = 0;
                  Auth.signUp(result)
                  .then(function(data) {
                    $window.localStorage.removeItem('fixerData')
                    vm.processing = false
                    if (data.data.success){
                      $location.path('/inicio');
                    }
                    else {
                      vm.processing = false
                      vm.error = data.data.message;
                    }
                  });
                }
              });
            }
          });
        }
      } else{
        vm.processing = false
        vm.error = 'Ingrese todos los datos.';
      }
    }else{
      vm.processing = false
      vm.error = 'Ingrese los datos.';
    }

  }

}]);
