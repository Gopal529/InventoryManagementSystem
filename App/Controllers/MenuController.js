(function(){
	MenuController = function($scope,$location)
	{
		$scope.Naviagte = function(Destination)
		{
			$location.path(Destination);
		}
	}
	
	MenuController.$inject = ['$scope','$location'];
	angular.module("SplitWise").controller("MenuController",MenuController)
}())