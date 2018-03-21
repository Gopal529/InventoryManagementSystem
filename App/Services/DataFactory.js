(function () {

	var DataFactory = function ($http) {
		var factory = {};




		factory.getAllItems = function () {
			return $http.get("http://localhost:8080/GetAllItems")
		}

		factory.DeleteItem = function (Product) {

			return $http.post("http://localhost:8080/DeleteItem", {
				"Model": Product.MODEL_NUMBER
			})
		}

		factory.UpdateItem = function (Product) {

			$http.post("http://localhost:8080/UpdateItem", {
				"Model": Product.MODEL_NUMBER,
				"Name": Product.NAME,
				"MSRP": Product.MSRP,
				"Quantity": Product.QUANTITY
			}).success(function (Data) {
				return Data;
			}).error(function (err) {
				return err;
			})
		}

		factory.RegisterUser = function (User) {

			return $http.post("http://localhost:8080/RegisterUser", {
				"Email": User.Email,
				"Username": User.UserName,
				"Name": User.Name,
				"Password": User.Password
			})
		}

		factory.Login = function (Email) {
			var config = {
				params: {
					username: Email,

				}
			}
			return $http.get("http://localhost:8080/Login", config);
		}

		factory.PlaceOrder = function (EmailID, OrderID) {
			return $http.post("http://localhost:8080/PlaceOrder", {
				"EmailID": EmailID,
				"OrderID": OrderID
			})
		}

		factory.PopulateOrders = function (OrderId, Items) {
			console.log(Items)
			return $http.post("http://localhost:8080/PopulateOrders", {
				"OrderID": OrderId,
				"Products": Items
			})
		}

		factory.PayOrder = function (OrderID, Amount, UserID) {
			console.log(OrderID);
			return $http.post("http://localhost:8080/MakePayments", {
				"OrderID": OrderID,
				"UserID": UserID,
				"Amount": Amount
			})
		}

		factory.getChartData = function () {
			return $http.get("http://localhost:8080/Chart1")
		}

		factory.getUsers = function () {
			return $http.get("http://localhost:8080/GetUserNames")
		}

		factory.GetOrders = function (UserName) {
			var config = {
				params: {
					UserName: UserName
				}
			}
			
			return $http.get("http://localhost:8080/GetOrders",config)
		}
		
		factory.getResults = function(OrderID)
		{
			var config = {
				params: {
					OrderID: OrderID
				}
			}
			return $http.get("http://localhost:8080/GetResults",config)
		}

		return factory
	}
	DataFactory.$inject = ['$http']
	angular.module('SplitWise').factory("DataFactory", DataFactory)
}())