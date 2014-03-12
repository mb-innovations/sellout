var selloutApp = angular.module('selloutApp', ['ui.bootstrap']).config(['$httpProvider', function ($httpProvider) {
   delete $httpProvider.defaults.headers.common['X-Requested-With']; //Fixes cross domain requests
}]);

selloutApp.controller('HomeController', function($scope, $http) {
	$scope.location = '';
	$scope.startDate = '';
	$scope.endDate = '';
	$scope.events = [];
	$scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

	$scope.getLocation = function(val) {
		if (val) {
	    return $http.get('https://maps.googleapis.com/maps/api/geocode/json', {
	      params: {
	      	// key: "AIzaSyAHWvq6qmw1cgJXhD2dlTQ7vGrBX6hbAAI",
	        address: val,
	        sensor: false
	      }
	    }).then(function(res){
	      var addresses = [];
	      angular.forEach(res.data.results, function(item){
	        addresses.push(item.formatted_address);
	      });
	      return addresses;
	    });
	  }
  };

  $scope.getEvents = function() {
  	$scope.loading = true;
  	$.getJSON("http://api.bandsintown.com/events/search.json?callback=?&", {
			location: $scope.location,
			app_id: "sellout_platform298982873",	
  	}).done(function(result) {
		  $scope.loading = false;
  		if (result.errors){
  			$scope.errorMsg = result.errors;
  			$scope.$apply();
		  } else {
		  	$scope.events = result;
		  	$scope.$apply();
		  	init_grid();
		  }
		  
		}).fail(function(result) {
			$scope.loading = false;
		  $scope.$apply();
		});
  };

  $scope.artistImageUrl = function(event) {
  	return event.artists[0].url + "/photo/medium.jpg";
  }
})