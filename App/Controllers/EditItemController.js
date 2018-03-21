/**
 * Created by daras on 27-Mar-17.
 */
(function () {

	var EditItemController = function ($scope, $http, $modalInstance, EditItemFactory) {

		var init = function () {

			var SelectedItem = EditItemFactory.getSelectedItem();
			$scope.Item = {};
			$scope.Item.Name = SelectedItem.name.replace(/[^a-zA-Z ]/g, "");
			$scope.Item.Image = SelectedItem.largeImage;
			$scope.Item.MSRP = SelectedItem.msrp;
			$scope.Item.SalePrice = SelectedItem.salePrice;
			$scope.Item.UPC = SelectedItem.upc;
			$scope.Item.ModelNumber = SelectedItem.modelNumber;
			$scope.Item.Quantity = 1;
		}

		$scope.RegisterItem = function () {
			console.log($scope.Item)
			$http.post("http://localhost:8080/EditItem", $scope.Item).success(function(data) {
				$scope.cancel();
			}).error(function (err) {
				toastr["error"]("Error Adding Item")
			});
		}
		$scope.cancel = function () {
			$modalInstance.dismiss('Close');
		};

		init();


	}
	EditItemController.$inject = ['$scope', '$http', '$modalInstance', 'EditItemFactory']
	angular.module("SplitWise").controller('EditItemController', EditItemController)

}())