(function () {

	var productsController = function ($scope, $modal, $location, $filter, DataFactory,EditItemFactory) {
		$scope.product = {};
		
		$scope.deleteProduct = function(product){
		    if(confirm("Are you sure to remove the product")){
				DataFactory.DeleteItem(product).success(function(data){
					$scope.products = _.without($scope.products, _.findWhere($scope.products, {MODEL_NUMBER:product.MODEL_NUMBER}));
				}).error(function(err){
					toastr["error"]("Error Deleting Item" + err)
				})
				
		    }
		}
		
		var init = function () {

			DataFactory.getAllItems().success(function (Data) {
				$scope.products = Data;


			}).error(function (reason) {
				console.log(reason);
			})
		}
		
		$scope.open = function (SelectedObj) {
			EditItemFactory.setSelectedItem(SelectedObj);
			var modalInstance = $modal.open({
				templateUrl: 'App/Views/productEdit.html',
				controller: 'productEditCtrl',
				size: "md",
			});
		};

		$scope.columns = [
			{
				text: "ID",
				predicate: "id",
				sortable: true,
				dataType: "number"
			},
			{
				text: "Name",
				predicate: "name",
				sortable: true
			},
			{
				text: "Price",
				predicate: "price",
				sortable: true
			},
			{
				text: "Stock",
				predicate: "stock",
				sortable: true
			},

			{
				text: "Status",
				predicate: "status",
				sortable: true
			},
			{
				text: "Action",
				predicate: "",
				sortable: false
			}
                ];

		$scope.Naviagte = function (Destination) {
			
			$location.path(Destination)
		}
		
		$scope.AddtoCart = function(Product)
		{
			EditItemFactory.AddItems(Product);
			toastr["info"](Product.NAME + "Added to Cart")
		}

		init();
	}
	productsController.$inject = ['$scope', '$modal', '$location', '$filter', 'DataFactory','EditItemFactory']
	angular.module("SplitWise").controller('productsController', productsController)

}())