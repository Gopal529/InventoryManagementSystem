(function () {

	var productEditCtrl = function ($scope, $modalInstance, EditItemFactory, DataFactory) {




		$scope.cancel = function () {
			$modalInstance.dismiss('Close');
		};

		$scope.UpdateItem = function (data) {
			console.log(data);
			var Data = DataFactory.UpdateItem(data);

			if (parseInt(Data) != 0) {
				$scope.product = Data;
			$modalInstance.dismiss('Close');
			} else {
				console.log(Data);
			}
		}

		var init = function () {
			$scope.product = EditItemFactory.getSelectedItem();
			//$scope.product = angular.copy(EditItemFactory.getSelectedItem());
		}

		init();
	}
	productEditCtrl.$inject = ['$scope', '$modalInstance', 'EditItemFactory', 'DataFactory']
	angular.module("SplitWise").controller("productEditCtrl", productEditCtrl)
}())