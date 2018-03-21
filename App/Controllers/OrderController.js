(function () {

	var OrdersController = function ($scope, $location, EditItemFactory,DataFactory) {

		$scope.Products = [];
		$scope.Quantity = 1;
		$scope.Total = 0;
		var Data=[];
			
		
		var init = function () {
			$scope.Products = EditItemFactory.GetItems();
			angular.forEach($scope.Products,function(obj){
				var Item={};
				var ModelNumber = obj.MODEL_NUMBER;
				var cost = obj.MSRP;
				var Quantity = 1;
				Item['ModelNumber'] = ModelNumber;
				Item['Cost'] = cost;
				Item['Quantity'] = Quantity;
				Data.push(Item);
			})
			console.log(Data);
			CalculateCost();
		}
		$scope.Change_Quantity = function (Product, Number) {
			var ID = Product.MODEL_NUMBER;
			var Cost = parseFloat(Product.MSRP);
			var Quantity = Number;
			angular.forEach(Data,function(obj){
				if(obj.ModelNumber == ID)
					{
						obj.Quantity = Quantity;
					}
			})
			ChangeTotal();
		}
		
		$scope.deleteProduct = function(product){
		    if(confirm("Are you sure to remove the product"))
			{
				
					$scope.Products = _.without($scope.Products, _.findWhere($scope.Products, {MODEL_NUMBER:product.MODEL_NUMBER}));
					RemoveItem(product);
		    }
		}
		var RemoveItem = function(Item)
		{
			angular.forEach(Data,function(obj){
				if(obj.ModelNumber == Item.MODEL_NUMBER)
					{
						
						console.log(obj)
						Data.splice(Data.indexOf(obj),1)
					}
				
			})
			ChangeTotal();
		}
		
		var ChangeTotal = function()
		{
			var Total = 0;
			angular.forEach(Data,function(obj){
				var Price = obj.Cost;
				var Quatity = obj.Quantity;
				Total = Total + Quatity * Price;
			})
			$scope.Total  = Total;
		}

		$scope.Navigate = function (Destination) {
			$location.path(Destination)
		}
		
		var CalculateCost = function () {
			var cost = 0;
			angular.forEach($scope.Products, function (Item) {
				var price = parseFloat(Item.MSRP);
				cost = cost + price;
			})

			$scope.Total = cost;
		}

		$scope.PlaceOrder = function()
		{
			//var CurrentUser = EditItemFactory.getLoggedUser();
			var CurrentUser = localStorage.getItem("USER")
			var OrderId = Math.floor((Math.random() * 1000+1))
			EditItemFactory.setOrderID(OrderId);
			EditItemFactory.setOrderTotal($scope.Total)
			DataFactory.PlaceOrder(CurrentUser,OrderId).success(function(data){
				DataFactory.PopulateOrders(OrderId,Data).success(function(data){
					$location.path("/Payments")
					toastr["success"]("Proceed to Payment");
					
				}).error(function(err){
					toastr["error"]("Error Placing the order");
				})
				
			}).error(function(err){
				toastr["error"](err);
			});
			
		}

		init();
	}
	OrdersController.$inject = ['$scope', '$location','EditItemFactory','DataFactory'];
	angular.module("SplitWise").controller("OrdersController", OrdersController)
}())