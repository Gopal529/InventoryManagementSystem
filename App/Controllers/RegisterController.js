(function () {

	var RegisterController = function ($scope, DataFactory,$location) {

		$scope.RegisterUser = function () {

			 DataFactory.RegisterUser($scope.User).success(function(data){
				 toastr["success"]("Registered Successfull")
				 $location.path('/')
			 }).error(function(err){
				 toastr["error"]("Error in Registering the User")
			 })
			

		}

	}
	RegisterController.$inject = ['$scope', 'DataFactory','$location']
	angular.module("SplitWise").controller("RegisterController", RegisterController)
}())