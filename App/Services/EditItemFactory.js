/**
 * Created by daras on 27-Mar-17.
 */
(function () {

    var EditItemFactory=function () {

        var factory = {};

        var Data = {
            SearchTerm:null,
            Items:null
        }
        var Item;
		var CartItems = [];
		
		var Email = "";
		var OrderID = "";
		var OrderTotal = "";
		factory.setLoggedinUser = function(strEmail)
		{
			Email = strEmail;
		}
		factory.getLoggedUser = function()
		{
			return Email;
		}
		factory.setOrderID = function(strOrderID)
		{
			OrderID = strOrderID;
			
		}
		factory.getOrderID = function()
		{
			return OrderID;
		}
		factory.setOrderTotal = function(strOrderTotal)
		{
			OrderTotal = strOrderTotal;
		}
		factory.getOrderTotal = function()
		{
			return OrderTotal;
		}
		
		factory.AddItems = function(Product)
		{
			CartItems.push(Product);
		}
		
		factory.GetItems = function()
		{
			return CartItems;
		}

        factory.setSelectedItem = function (item) {
            Item = item;

        }

        factory.getSelectedItem = function () {
            return Item
        }


        factory.setData = function (SearchValue,Result) {
            Data.SearchTerm = SearchValue;
            Data.Items = Result
        }

        factory.getData = function () {
            return Data;
        }
        return factory;
    }
    EditItemFactory.$inject=[]
    angular.module('SplitWise').factory("EditItemFactory",EditItemFactory)

}())