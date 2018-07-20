var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

// the start menu that has a inquirer interface to select possible objects
function start() {
    
    inquirer.prompt([
        {
            name: "menu",
            type: "rawlist",
            // the list of choices of products to purchace
            choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add new product"],
            message: "What item would you like to purchace?"
        }
    ])
        .then(function (answer) {

            console.log("answer.menu: "+answer.menu);

            switch (answer.menu) {
                case "View Products":
                    viewProducts();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addToInventory();
                    break;

                case "Add new product":
                    addNewProduct();
                    break;

                default:
                    console.log("Error | Invalid menu option | Starting Over.");
                    start();
            }


        });
}


function viewProducts(){
    console.log("Inside view products");
}

function viewLowInventory(){
    console.log("Inside loe inventory");
}

function addToInventory(){
    console.log("Inside add to inventory");
}

function addNewProduct(){
    console.log("Inside add new product");
}