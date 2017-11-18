angular.module('imgService', ['ngFileUpload'])

.factory('Img', function($http, Upload, CLURL, CLPRE,AuthToken,$window) {

	// create a new object
	var imgFactory = {};


	imgFactory.subirFoto = function(img) {

		return Upload.upload({
			url:CLURL,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: {
				file: img,
				upload_preset: CLPRE
			}
			//pass file as data, should be user ng-model
		});
	};

	imgFactory.subirFotos = function(objectKeys) {
		$window.token= AuthToken.getToken();
		$window.ofertante = AuthToken.getOfertante();
		var routes = [];
		var ID = 0;
		if (ID < objectKeys.length)
		doCall(objectKeys[ID]);

		function doCall(key) {
			AuthToken.setToken( );

			Upload.upload({
				url:CLURL,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: {
					file: key,
					upload_preset: CLPRE
				}
				//pass file as data, should be user ng-model
			}).then(function(resp){
				routes.push(resp.data.url);
				console.log(resp.data.url);
				ID++;
				if ( ID < objectKeys.length-1)
				doCall(objectKeys[ID]);
				else{
					AuthToken.setToken(  $window.token,$window.ofertante );
					return
					Upload.upload({
						url:CLURL,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							file: objectKeys[objectKeys.length-1],
							upload_preset: CLPRE
						}
						//pass file as data, should be user ng-model
					})
				 }


			});


		}
	}

	// get a single servicio

	// return our entire servicioFactory object
	return imgFactory;

});
