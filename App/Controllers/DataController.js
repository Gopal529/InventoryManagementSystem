(function () {

	var DataController = function ($scope, DataFactory) {
		google.charts.load('current', {
			'packages': ['corechart']
		});

		var Chart1Data = "";

		function drawChart() {
			var options = {
				title: 'Count of Orders'
			};

			var chart = new google.visualization.ColumnChart(document.getElementById('piechart'));

			chart.draw(Chart1Data, options);
		}


		$scope.GetData = function () {
			DataFactory.getChartData().success(function (data) {
				console.log(data)
				Chart1Data = datatable(data)
				//Chart1Data = google.visualization.arrayToDataTable(data);
				google.charts.setOnLoadCallback(drawChart);
			}).error(function (err) {
				toastr["error"]("Error Retriving Chart Data")
			})
		}

		var datatable = function (Chartdata) {
			var data = new google.visualization.DataTable();


			data.addColumn('string', 'Name');
			data.addColumn('number', 'Count');
			

			angular.forEach(Chartdata, function (item) {
				data.addRow([item.NAME, item.COUNT])
			});
			return data;
		}
		
		var GetUser = function()
		{
			DataFactory.getUsers().success(function(data){
				$scope.Name = data
				
			}).error(function(err){
				toastr["error"]("Error Retriving Users")
			})
		}
		
		$scope.GetOrders = function(UserID)
		{
			DataFactory.GetOrders(UserID).success(function(data){
				$scope.Orders = data
			}).error(function(err){
				toastr["error"]("Error Retriving Orders")
			})
		}
		$scope.GetResults = function(OrderID)
		{
			DataFactory.getResults(OrderID).success(function(data){
				console.log(data)
				$scope.Results = data;
			}).error(function(err){
				toastr["error"]("Error Retriving Order Data")
			})
		}
		GetUser();
		
	}
	DataController.$inject = ['$scope', 'DataFactory']
	angular.module("SplitWise").controller("DataController", DataController)
}())