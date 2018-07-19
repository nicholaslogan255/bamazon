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

        // once you have the items, create user prompt the user for product and quantity
        inquirer.prompt([
            {
                name: "product",
                type: "rawlist",
                // the list of choices of products to purchace
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

            // determine if quantity in database is bigger than the amount ordered
            if (chosenItem.stock_quantity >= parseInt(answer.quantity)) {
                //console.log("HAVE STOCK");

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
                    function (error) {
                        if (error) throw err;
                        console.log("\nObject purchaced successfully!");
                        console.log(`You purchase has a total cost of $${totalPrice}`);
                        start();
                    }
                );
            }
            else {
                // 
                console.log("\nYour order quantity exceeds our inventory for that item.");
                selectQuantity(chosenItem);
            }

        }); 
    }
} // end start



    // // function to handle posting new items up for auction
    // function post() {
    //     // prompt for info about the item being put up for auction
    //     inquirer
    //         .prompt([
    //             {
    //                 name: "item",
    //                 type: "input",
    //                 message: "What is the item you would like to submit?"
    //             },
    //             {
    //                 name: "category",
    //                 type: "input",
    //                 message: "What category would you like to place your auction in?"
    //             },
    //             {
    //                 name: "startingBid",
    //                 type: "input",
    //                 message: "What would you like your starting bid to be?",
    //                 validate: function (value) {
    //                     if (isNaN(value) === false) {
    //                         return true;
    //                     }
    //                     return false;
    //                 }
    //             }
    //         ])
    //         .then(function (answer) {

    //             // determine if quantity in database is bigger than the amount ordered
    //             if (chosenItem.stock_quantity >= parseInt(answer.quantity)) {
    //                 //console.log("HAVE STOCK");

    //                 var totalPrice = parseInt(answer.quantity) * chosenItem.price;
    //                 var newQuantity = chosenItem.stock_quantity - parseInt(answer.quantity)

    //                 connection.query(
    //                     "UPDATE products SET ? WHERE ?",
    //                     [
    //                         {
    //                             stock_quantity: newQuantity
    //                         },
    //                         {
    //                             item_id: chosenItem.item_id
    //                         }
    //                     ],
    //                     function (error) {
    //                         if (error) throw err;
    //                         console.log("Object purchaced successfully!");
    //                         console.log(`You purchase has a total cost of $${totalPrice}`);
    //                         start();
    //                     }
    //                 );
    //             }
    //             else {
    //                 // bid wasn't high enough, so apologize and start over
    //                 console.log("Your order quantity exceeds our inventory for that item.");
    //                 start();
    //             }


    //         });
    // }