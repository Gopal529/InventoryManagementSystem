var express = require('express');
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var path = require('path');

var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
})); // for parsing       application/x-www-form-urlencoded
app.use(serveStatic(__dirname, {
	'index': ['Main.html']
}))

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(express.static(path.join(__dirname, "/App")))
app.use(express.static(path.join(__dirname, "/script")))


var port = process.env.PORT || 8080;
var Connection = require('tedious').Connection;


var config = {
	userName: 'darasandeep',
	password: 'Vijayawada$91',
	server: 'darasandeep.database.windows.net',
	// If you are on Microsoft Azure, you need this:  
	options: {
		encrypt: true,
		database: 'mySampleDatabase',
		rowCollectionOnDone: true
	}
};
var connection = new Connection(config);
connection.on('connect', function (err) {

	if (err) {
		console.log(err)

	}
	// If no error, then good to proceed.  
	console.log("Connected");
	//executeStatement();
});

function executeStatement() {
	request = new Request("SELECT * FROM IDBMS;", function (err) {
		if (err) {
			console.log(err);
		}
	});
	var result = "";
	request.on('row', function (columns) {

		columns.forEach(function (column) {
			console.log(column.colName)
			if (column.value === null) {
				console.log('NULL');
			} else {
				result += column.value + " ";
			}
		});
		console.log(result);
		result = "";
	});

	request.on('done', function (rowCount, more) {
		console.log(rowCount + ' rows returned');
	});
	connection.execSql(request);
}


app.get('/', function (req, res) {
	res.sendfile("Main.html"); // load the single view file (angular will handle the page changes on the front-end)
});

app.get("/GetAllItems", function (req, res) {

	console.log("Get All Items from DB");
	GetItems(function (response) {
		console.log("Entered Call Back")
		console.log(response)
		res.json(response);
	});

});

app.post("/EditItem", function (req, res) {

	var ID = Math.floor((Math.random() * 100) + 1);
	var NAME = req.body.Name;
	var SALE_PRICE = req.body.SalePrice;
	var MSRP = req.body.MSRP;
	var MODEL_NUMBER = req.body.ModelNumber;
	var UPC = req.body.UPC;
	var QUANTITY = req.body.Quantity;
	InsertIntoItems(MODEL_NUMBER, NAME, SALE_PRICE, MSRP, UPC, QUANTITY)

});

app.post("/DeleteItem", function (req, res) {


	var Model = req.body.Model;
	DeleteItem(Model, function (Response) {
		console.log(Response);
		return res.send(Response.toString());
	});

});

app.post("/UpdateItem", function (req, res) {

	var Model = req.body.Model;
	var Name = req.body.Name;
	var MSRP = req.body.MSRP;
	var Quantity = req.body.Quantity;

	UpdateItem(Model, Name, MSRP, Quantity, function (response) {
		return res.send(response.toString())
	})
})

app.post("/RegisterUser", function (req, res) {
	var Email = req.body.Email;
	var UserName = req.body.Username;
	var Name = req.body.Name;
	var Password = req.body.Password;
	Registeruser(Email, UserName, Name, Password, function (Data) {
		res.send(Data.toString());
	});
})

app.get("/Login", function (req, res) {

	var UserName = req.query.username;
	console.log(UserName);
	Login(UserName, function (response) {

		res.json(response);
	})

})

app.post("/PlaceOrder", function (req, res) {

	var EmailID = req.body.EmailID;
	var OrderID = req.body.OrderID;
	PlaceOrder(EmailID, OrderID, function (response) {
		console.log(response)
		res.send(response.toString())
	})

})

app.post("/PopulateOrders", function (req, res) {
	var Products = req.body.Products;
	var orderId = req.body.OrderID;
	var Statements = [];
	Products.forEach(function (Item) {
		console.log(Item);
		Statements.push(CreateStatement(orderId, Item.ModelNumber, Item.Quantity));
	})
	/*Products.forEach(function (Item) {
		Statements.push(CreateUpdate(Item.ModelNumber, Item.Quantity));
	})*/
	CreateOrderItems(Statements, function (response) {
		res.send(response.toString())
	})
})

app.post("/MakePayments", function (req, res) {

	var OrderID = req.body.OrderID;
	var Amount = req.body.Amount;
	var UserID = req.body.UserID;
	MakePayment(OrderID, Amount, UserID, function (response) {
		res.send(response.toString());
	})
})

app.get("/Chart1", function (req, res) {
	GetChart1(function (response) {
		res.send(response)
	})
})

app.get("/GetUserNames", function (req, res) {
	GetData(function (response) {
		res.send(response);
	})
})
app.get("/GetOrders", function (req, res) {
	var Username = req.query.UserName;
	GetOrders(Username, function (response) {
		res.send(response)
	})
})

app.get("/GetResults", function (req, res) {

	var OrderID = req.query.OrderID
	GetResults(OrderID,function(response){
		res.send(response);
	})
})

function GetResults(OrderID, CallBack) {
	var req = "SELECT PRODUCTS.NAME,PRODUCTS.MSRP,ORDER_ITEMS.QUANTITY, PAYMENTS.AMOUNT FROM PRODUCTS JOIN ORDER_ITEMS ON PRODUCTS.MODEL_NUMBER = ORDER_ITEMS.PRODUCT_ID JOIN PAYMENTS ON PAYMENTS.ORDER_ID = ORDER_ITEMS.ORDER_ID WHERE ORDER_ITEMS.ORDER_ID =" + OrderID;

	console.log(req);

	var NewData = [];
	request = new Request(req, function (err, rowCount) {
		if (err) {
			console.log(err);
		} else {
			CallBack(NewData)
		}
	});

	request.on('row', function (columns) {
		var Result = {}
		columns.forEach(function (column) {
			var ColumnName = column.metadata.colName;
			var Value = column.value;
			Result[ColumnName] = Value;
		})
		NewData.push(Result)
	});

	connection.execSql(request);
}

function GetOrders(UserName, CallBack) {
	var req = "SELECT * FROM ORDERS WHERE USER_ID='" + UserName + "';"
	console.log(req)
	var NewData = [];
	request = new Request(req, function (err, rowCount) {
		if (err) {
			console.log(err);
		} else {
			CallBack(NewData)
		}
	});

	request.on('row', function (columns) {
		var Result = {}
		columns.forEach(function (column) {
			var ColumnName = column.metadata.colName;
			var Value = column.value;
			Result[ColumnName] = Value;
		})
		NewData.push(Result)
	});

	connection.execSql(request);
}

function GetData(CallBack) {
	var req = "SELECT ID,USERNAME FROM USERS";
	console.log(req);
	var NewData = [];
	request = new Request(req, function (err, rowCount) {
		if (err) {
			console.log(err);
		} else {
			CallBack(NewData)
		}
	});

	request.on('row', function (columns) {
		var Result = {}
		columns.forEach(function (column) {
			var ColumnName = column.metadata.colName;
			var Value = column.value;
			Result[ColumnName] = Value;
		})
		NewData.push(Result)
	});

	connection.execSql(request);
}

function GetChart1(CallBack) {
	var req = "SELECT COUNT(ORDERS.ID) AS COUNT, USERS.NAME FROM USERS JOIN ORDERS ON USERS.ID= ORDERS.USER_ID GROUP BY USERS.NAME"
	console.log(req);
	var NewData = [];
	request = new Request(req, function (err, rowCount) {
		if (err) {
			console.log(err);
		} else {
			CallBack(NewData)
		}
	});

	request.on('row', function (columns) {
		var Result = {}
		columns.forEach(function (column) {
			var ColumnName = column.metadata.colName;
			var Value = column.value;
			Result[ColumnName] = Value;
		})
		NewData.push(Result)
	});

	connection.execSql(request);
}

function MakePayment(OrderID, Amount, UserID, Callback) {
	var Random = Math.floor((Math.random() * 1000 + 1))
	var req = "INSERT into PAYMENTS values ('" + Random + "','" + OrderID + "'," + Amount + ",'" + UserID + "')"
	console.log(req)
	request = new Request(req, function (err, rowCount) {

		if (err) {
			console.log(err);
		} else {
			Callback(rowCount)
		}
	});

	connection.execSql(request);
}

function CreateOrderItems(Statements, CallBack) {
	var req ="";
	Statements.forEach(function (Line) {
		req = Line + ";" + req;
	})
	console.log(req);
	request = new Request(req, function (err, rowCount) {

		if (err) {
			console.log(err);
		} else {
			CallBack(rowCount)
		}
	});

	connection.execSql(request);
}

function CreateStatement(OrderID, ProductID, Quantity) {
	var Random = Math.floor((Math.random() * 1000 + 1))
	var Req = "INSERT INTO ORDER_ITEMS VALUES ('" + Random + "','" + OrderID + "','" + ProductID + "'," + Quantity + ")" 
	console.log(Req);
	return Req

}

function CreateUpdate(ProductID, Quantity)
{
	var req = "Update PRODUCTS SET QUANTITY = (QUANTITY -"+Quantity+") where MODEL_NUMBER = '"+ProductID+"'"
	console.log(req)
	//return req;
}

function PlaceOrder(EmailID, OrderID, CallBack) {
	var req = "INSERT INTO ORDERS VALUES ('" + OrderID + "','" + EmailID + "')"
	console.log(req);

	request = new Request(req, function (err, rowCount) {

		if (err) {
			console.log(err);
		} else {
			CallBack(rowCount)
		}
	});

	connection.execSql(request);
}

function Login(UserName, CallBack) {
	var req = "SELECT ID,PASSWORD FROM USERS WHERE USERNAME='" + UserName + "'"
	console.log(req);

	var NewData = [];
	request = new Request(req, function (err, rowCount) {

		if (err) {

			console.log(err);

		} else {

			CallBack(NewData)

		}
	});

	request.on('row', function (columns) {
		var Result = {}

		columns.forEach(function (column) {
			var ColumnName = column.metadata.colName;
			var Value = column.value;
			Result[ColumnName] = Value;
		})

		NewData.push(Result)

	});

	connection.execSql(request);
}

function Registeruser(Email, UserName, Name, Password, CallBack) {
	var req = "Insert INTO USERS values ('" + Email + "','" + Name + "','" + UserName + "','" + Password + "');"
	console.log(req)

	request = new Request(req, function (err, rowCount) {

		if (err) {

			console.log(err);


		} else {

			CallBack(rowCount)

		}
	});

	connection.execSql(request);

}

function UpdateItem(Model, NAME, MSRP, QUANTITY, CallBack) {
	var req = "UPDATE PRODUCTS SET NAME=" + "'" + NAME + "', MSRP =" + MSRP + ", QUANTITY =" + QUANTITY + " WHERE MODEL_NUMBER = '" + Model + "'";
	console.log(req);

	request = new Request(req, function (err, rowCount) {
		if (err) {
			console.log(err);
		} else {
			CallBack(rowCount)

		}
	});

	connection.execSql(request);
}

function DeleteItem(Model, CallBack) {
	var req = "DELETE FROM PRODUCTS WHERE MODEL_NUMBER=" + "'" + Model + "'";
	console.log(req);

	request = new Request(req, function (err, rowCount) {
		if (err) {
			CallBack(err);
		} else {
			CallBack(rowCount)

		}
	});

	connection.execSql(request);
}

function GetItems(callback) {
	var req = "select * from PRODUCTS"
	console.log(req)


	var NewData = []
	request = new Request(req, function (err, rowCount) {
		if (err) {
			console.log(err);
		} else {
			if (rowCount < 1) {
				callback(null);
			} else {

				callback(NewData);
			}
		}
	});

	request.on('row', function (columns) {
		var Result = {}

		columns.forEach(function (column) {
			var ColumnName = column.metadata.colName;
			var Value = column.value;
			Result[ColumnName] = Value;
		})

		NewData.push(Result)

	});

	connection.execSql(request);
}

function InsertIntoItems(Model_Number, Name, SalePrice, MSRP, UPC, Quantity) {

	var Status = 'ACTIVE'
	if (Quantity > 20) {
		Status = 'ACTIVE'
	} else {
		Status = 'INACTIVE'
	}
	var req = "Insert INTO PRODUCTS values(" +
		"'" + Model_Number + "'" + "," +
		"'" + Name + "'" + "," +
		SalePrice + "," +
		MSRP + "," +
		UPC + "," +
		Quantity + "," +
		"'" + Status + "'" + ")"

	console.log(req)
	request = new Request(req, function (err, rowcount) {
		if (err) {
			console.log(err);
		} else if (rowcount) {
			console.log("Rows Effected" + rowcount);
		}
	});

	connection.execSql(request);
}


app.listen(port, function (Err) {

	console.log("Running Server on Port " + port);
});