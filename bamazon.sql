drop database if exists bamazon_db;
create database bamazon_db;

use bamazon_db;

create table products (
    item_id int AUTO_INCREMENT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255),
    price decimal(10,2) NOT NULL,
    stock_quantity int not null,
    primary key(item_id)
);


INSERT INTO products ( item_name, price, stock_quantity, department_name) VALUES ("Toaster", 32.00, 15, "Kitchen");
INSERT INTO products ( item_name, price, stock_quantity, department_name) VALUES ("Kitchen Aide", 156.99, 6, "Kitchen");
INSERT INTO products ( item_name, price, stock_quantity, department_name) VALUES ("Mixing Bowl", 8.50, 30, "Kitchen");
INSERT INTO products ( item_name, price, stock_quantity, department_name) VALUES ("Refrigerator", 3421.67, 2, "Kitchen");

INSERT INTO products ( item_name, price, stock_quantity, department_name) VALUES ("Google Home", 129.00, 50,"Electronics");
INSERT INTO products ( item_name, price, stock_quantity, department_name) VALUES ("Apple Home", 250.00, 10,"Electronics");
INSERT INTO products ( item_name, price, stock_quantity, department_name) VALUES ("Samsung TV", 600.00, 3,"Electronics");
INSERT INTO products ( item_name, price, stock_quantity, department_name) VALUES ("Philips TV", 550.00, 4,"Electronics");

INSERT INTO products ( item_name, price, stock_quantity, department_name) VALUES ("Fingerlings", 14.99, 0,"Toys");
INSERT INTO products ( item_name, price, stock_quantity, department_name) VALUES ("Hatchimals", 39.00, 9,"Toys");
INSERT INTO products ( item_name, price, stock_quantity, department_name) VALUES ("L.O.L. Doll", 22.99, 10,"Toys");



SELECT * FROM products;