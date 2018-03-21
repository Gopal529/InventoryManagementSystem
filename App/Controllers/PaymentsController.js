(function(){
	
	PaymentsController = function($scope,EditItemFactory,DataFactory)
	{
		$scope.Makepayment = function()
		{
			var OrderID = EditItemFactory.getOrderID();
			//var EmailID = EditItemFactory.getLoggedUser();
			var EmailID = localStorage.getItem("USER");
			var OrderTotal = EditItemFactory.getOrderTotal();
			DataFactory.PayOrder(OrderID,OrderTotal,EmailID).success(function(data){
				toastr["success"]("Successfully Placed Order");
			}).error(function(err){
				toastr["error"]("Error Processing payment");
			})
		}
	}
	PaymentsController.$inject = ['$scope','EditItemFactory','DataFactory'];
	angular.module("SplitWise").controller("PaymentsController",PaymentsController)
}())