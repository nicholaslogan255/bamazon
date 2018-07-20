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


// function which prompts the user for what action they should take
function start() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        //insert newline
        console.log("");

        // once you have the items, create user prompt to find product
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
                message: "What item would you like to purchace?"
            }
        ])
            .then(function (answer) {

                // get the information of the chosen item
                var chosenItem;

                // search through every item for the one with the matching name
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_name === answer.product) {
                        //console.log(results[i]);
                        chosenItem = results[i];
                    }
                }

                // ask the user for quantity, and if stock is sufficient, sell them their order
                selectQuantity(chosenItem);
            });
    });

    // menu that shows the inventory and price of a particular object, and allows them to buy that object
    function selectQuantity(chosenItem) {

        // show quantity availiable and price, ask for quantity
        inquirer.prompt([
            {
                name: "quantity",
                type: "input",
                message: `\n${chosenItem.item_name}: ${chosenItem.stock_quantity} in stock. Unit Price: $${chosenItem.price}\n`
                    + `How many would you like to purchace?`
            }
        ]).then(function (answer) {
            
            // check if user typed in an integer number
            if(  isNaN(parseInt(answer.quantity) )){
                console.log("\nError: Only integer numbers allowed");
                selectQuantity(chosenItem);
            }

            // if the user typed in a negative number (zero is allowed)
            else if(parseInt(answer.quantity) < 0){
                // log error and start transaction over
                console.log("\nError: Negative quantities are not allowed!");
                selectQuantity(chosenItem);

            }

            // determine if quantity in database is bigger than the amount ordered
            else if (chosenItem.stock_quantity >= parseInt(answer.quantity)) {
               
                // calculate total price and new quantity in stock
                var totalPrice = parseInt(answer.quantity) * chosenItem.price;
                var newQuantity = chosenItem.stock_quantity - parseInt(answer.quantity)

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
                        console.log("\nObject purchaced successfully!");
                        console.log(`You purchase has a total cost of $${totalPrice}`);
                        start();
                    }
                );
            }
            else {
                // if user ordered too much, go back to the select quantity menu
                console.log("\nYour order quantity exceeds our inventory for that item.");
                selectQuantity(chosenItem);
            }

        }); 
    }
} // end start
