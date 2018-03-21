(function () {

	var DBSearchController = function ($scope, $http) {
		var SearchItem = $scope.SearchText;

		$scope.SearchItemDB = function () {
			console.log("Entered")
			var config = {
				params: {
					ProductName: $scope.SearchText

				}
			}
			$http.get("/GetItem").success(function (data) {
				console.log(data)
				console.log("Succesfully Executed Get");
			}).error(function (err) {
				console.log(err);
			});
		}
	}
	DBSearchController.$inject = ["$scope", "$http"]
	angular.module("SplitWise").controller("DBSearchController", DBSearchController)
}())