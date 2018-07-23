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
            message: "What would you like to do?"
        }
    ])
        .then(function (answer) {

            // call the menu function that fufills the request of the start menu's inquiry
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

                default: // if request doesn't make sense, start over
                    console.log("Error | Invalid menu option | Starting Over.");

                    start();
            }


        });
}

// prints out the entire contents of the products table
function viewProducts() {
    // console.log("Inside view products");

    // query the database for all items in the products table
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        // print out the products table
        console.log("\nproducts table")
        console.log("item_id | item_name | stock_quantity | price | department_name");
        for (var i in results) {
            console.log(`${results[i].item_id} | ${results[i].item_name} | ${results[i].stock_quantity} | $${results[i].price} | ${results[i].department_name}`);
        }

        // print an extra lines
        console.log("");
        start();

    });


}

function viewLowInventory() {
    console.log("Inside low inventory");

    // query the database for all items in the products table with less than 5 in stock
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, results) {
        if (err) throw err;

        // print out the products table
        console.log("\nShowing items with low quantity!")
        console.log("item_id | item_name | stock_quantity | price | department_name");
        for (var i in results) {
            console.log(`${results[i].item_id} | ${results[i].item_name} | ${results[i].stock_quantity} | $${results[i].price} | ${results[i].department_name}`);
        }

        // print an extra lines
        console.log("");
        start();

    });
}

function addToInventory() {
    console.log("Inside add to inventory");


    // query the database for all items in products table
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        // once you have the items, create user prompt to find which item they want to edit
        inquirer.prompt([
            {
                name: "product",
                type: "rawlist",
                // creates an array which will be the list of choices of products to purchace
                choices: function () {
                    var choiceArray = [];

                    // add every object in the database to the array
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].item_name);
                    }
                    return choiceArray;
                },
                message: "What item would you like to add more?"
            }
        ])
            .then(function (answer) {

                var chosenItem;

                // search through every item for the one with the matching name and return it
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_name === answer.product) {
                        chosenItem = results[i];
                    }
                }

                // show quantity in stock, ask for how much to add
                inquirer.prompt([
                    {
                        name: "quantity",
                        type: "input",
                        message: `\n${chosenItem.item_name}: ${chosenItem.stock_quantity} in stock.\n`
                            + `How many would you like to add to the inventory?`
                    }
                ]).then(function (answer) {

                    // check if user typed in an integer number
                    if (isNaN(parseInt(answer.quantity))) {
                        console.log("\nError: Only integer numbers allowed");
                        selectQuantity(chosenItem);
                    }

                    // if the user typed in a negative number (zero is allowed)
                    else if (parseInt(answer.quantity) < 0) {
                        // log error and start transaction over
                        console.log("\nError: Negative quantities are not allowed!");
                        selectQuantity(chosenItem);

                    }
                    else { // if the user typed in a reasonable number in 

                        var newQuantity = parseInt(answer.quantity) + chosenItem.stock_quantity;

                        // update database with new quantity
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: newQuantity
                                },
                                {
                                    item_id: chosenItem.item_id
                                }
                            ],
                            function (error) { // after attempting to add object
                                if (error) throw err;

                                // log result and go back to the menu
                                console.log("\nAddition Complete!");
                                console.log(`There is now ${newQuantity} in stock!`);
                                start();
                            }
                        );

                    }

                });

            });

    });

}

function addNewProduct() {
    console.log("Inside add new product");


    // values to be inserted into database initialized to default values
    var newName = "";
    var newPrice = 0;
    var newQuantity = 0;
    var newDepartment = "";


    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the product"
        },
        {
            name: "price",
            type: "input",
            message: "What is the price of the product"
        },
        {
            name: "quantity",
            type: "input",
            message: "What is the quantity of the product"
        },
        {
            name: "department",
            type: "input",
            message: "What is the department name of the product"
        }
    ]).then(function (answer) {

        console.log("Recieved answer")

        newName = answer.name;
        newDepartment = answer.department;


        // if quantity and price are non-negative numbers, update from default
        if ((!isNaN(parseInt(answer.quantity)) && parseInt(answer.quantity) >= 0)) {
            newQuantity = parseInt(answer.quantity);
        }

        if ((!isNaN(parseFloat(answer.price)) && parseFloat(answer.price) >= 0)) {

            newPrice = parseFloat(answer.price);
        }

        console.log(`name: ${newName} ${typeof(newName)}`);
        console.log(`department: ${newDepartment} ${typeof(newDepartment)}`);
        console.log(`quantity: ${newQuantity} ${typeof(newQuantity)}`);
        console.log(`price: ${newPrice} ${typeof(newPrice)}`);

        

        var query = "INSERT INTO products (item_name, price, stock_quantity, department_name) VALUES (?,?,?,?)";

        console.log(query);


        // insert item into database 
        connection.query(query,[newName, newPrice, newQuantity, newDepartment], function (err, results) {
            if (err) throw err;

            // log result and go back to the menu
            console.log("\nObject created successfully!");
            start();

        });
    });

}

