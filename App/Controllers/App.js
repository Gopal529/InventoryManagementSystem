(function () {
	var app = angular.module('SplitWise', ['ngRoute', 'ngResource', 'ui.bootstrap']);
	app.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				controller: 'LoginController',
				templateUrl: 'App/Views/Login.html'
			})
			.when('/Register', {
				controller: 'RegisterController',
				templateUrl: 'App/Views/Register.html'
			}).when('/Home', {
				controller: 'productsController',
				templateUrl: 'App/Views/products.html'
			}).when('/SearchWalmart', {
				controller: 'SearchProductsControllers',
				templateUrl: 'App/Views/SearchProducts.html'
			}).when('/Register', {
				controller: 'RegisterController',
				templateUrl: 'App/Views/Register.html'
			}).when('/EditItem', {
				controller: 'EditItemController',
				templateUrl: 'App/Views/EditItem.html'
			}).when('/Orders', {
				controller: 'OrdersController',
				templateUrl: 'App/Views/Orders.html'
			}).when('/Payments', {
				controller: 'PaymentsController',
				templateUrl: 'App/Views/Payments.html'
			}).when('/Charts', {
				controller: 'DataController',
				templateUrl: 'App/Views/data.html'
			})
			.otherwise({
				redirectTo: '/'
			});

	});

}());