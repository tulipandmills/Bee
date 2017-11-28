var myItems = angular.module('myItems');

myItems.controller('ItemsController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
	
	
	$scope.findItem = function(){
		$http.get('/find/' + $scope).success(function(response){
						$scope.data = response;
					});
			
	};
//				if($scope.searchTerm.length != 0){
//					var r = $http.get('/find/' + $scope.searchTerm).then(function(response){
//						$scope.data = response;
//						return response;
//					});
//					
//					r.then(function(data){
//						$scope.findItem = function(){
//							r.then(function(data){
//								   $scope.items = data;
//								   })
//						}
//					})
//					
//				}else{
//					$scope.items = "Please enter a keyword";
//				}
	
	
	
	
	console.log("Items controller loaded");
	//console.log($location);
	$scope.getItems = function(){
		$http.get('/list').then(function(response){
			$scope.items = response.data;
			//console.log(response)
		});
	}
	
	

				
//		console.log($scope.searchTerm.length);
				

	
	
}]);