var myItems = angular.module('myItems',['ngRoute']);
myItems.config(function($routeProvider){
	$routeProvider.when('/', {
		controller:'ItemsController',
		templateUrl: 'views/items.html'
	})
	.when('/items', {
		controller:'ItemsController',
		templateUrl: 'views/items.html'
	})
	.when('/item/show/:id',{
		controller:'ItemsController',
		templateUrl: 'views/item_details.html'
	})
	.when('/item/add',{
		controller:'ItemsController',
		templateUrl: 'views/add_item.html'
	})
	.when('/item/edit/:id',{
		controller:'ItemsController',
		templateUrl: 'views/edit_item.html'
	})
	.otherwise({
		redirectTo: '/'
	})
	
	
	
});