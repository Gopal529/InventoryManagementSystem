(function () {
	var LoginController = function ($scope, $location, DataFactory, EditItemFactory) {
		$scope.Navigate = function (Destination) {
			$location.path(Destination)
		}

		$scope.login = function () {
			
			if (typeof($scope.Password)!= 'undefined') {
				DataFactory.Login($scope.Email).success(function (data) {
					var password = data[0].PASSWORD;
					var Email = data[0].ID;
					if (password === $scope.Password) {
						//EditItemFactory.setLoggedinUser(Email)
						localStorage.setItem("USER",Email)
						toastr["success"]("Login Successfull")
						$location.path("/Home");
					} else {

						toastr["error"]("Invalid Password")
					}
				}).error(function (err) {
					console.log(err)
				})
			} else {
				toastr["error"]("Please Enter the Password")
			}


		}
	}
	LoginController.$inject = ['$scope', '$location', 'DataFactory', 'EditItemFactory']
	angular.module("SplitWise").controller("LoginController", LoginController)
}())