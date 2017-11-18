angular.module('mainCtrl', ['ngFileUpload'])

.controller('mainController', function(Upload,$rootScope, $location, Auth, User, CLURL, CLPRE,$window, Img) {

  var vm = this;
  // get info if a person is logged in
  vm.loggedIn = Auth.isLoggedIn();
  vm.ofertante = Auth.esOfertante();
  // check to see if a user is logged in on every request
  $rootScope.$on('$routeChangeStart', function() {
    vm.loggedIn = Auth.isLoggedIn();
    vm.ofertante = Auth.esOfertante();


    // get user information on route change
    Auth.getUser()
    .then(function(data) {
      vm.user = data.data;
    });
  });

  // function to handle login form
  vm.doLogin = function() {
    vm.processing = true;
    // call the Auth.login() function


    Auth.login(vm.loginData.username, vm.loginData.password)

    .then(function(data) {
      vm.processing = false;

      // if a user successfully logs in, redirect to users page
      if (data.data.success){
        $location.path('/inicio');
      }
      else
      {
        vm.error = data.data.message;
      }
    });
  };
  // doSignUp to handle signUp form
  vm.doSignUp= function() {
    // call the Auth.login() function
    if(!vm.processing){
      vm.processing = true;

    if(vm.signUpData){

      if(vm.signUpData.perfil){
        Img.subirFoto(vm.signUpData.perfil).then(function (resp) { //upload function returns a promise
          if(resp.statusText === "OK"){ //validate success
            vm.signUpData.perfil = resp.data.url;
            Auth.signUp(vm.signUpData)
            .then(function(data) {

              vm.processing = false;              // if a user successfully logs in, redirect to users page
              if (data.data.success){
                $location.path('/inicio');
              }
              else
              {
                vm.processing = false;
                vm.error = data.data.message;
              }
            });
          } else {
            vm.processing = false;
            $window.alert('Imagen inválida' );
          }

        })
      }
      else{
      $window.alert('Ingrese una imagen' );
      vm.processing = false;
}
    }
    else
    {
      vm.processing = false;
      vm.error = "Llene los campos";
    }
}
  };
  // function to handle logging out
  vm.doLogout = function() {
    Auth.logout();
    // reset all user info
    vm.user = {};
    $location.path('/login');
  };

});
