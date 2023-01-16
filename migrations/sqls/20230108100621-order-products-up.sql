CREATE TABLE IF NOT EXISTS order_product(
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    CONSTRAINT order_product_orders_foreign FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT order_product_products_foreign FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    
);


INSERT INTO order_product (order_id,product_id,quantity) values ('1','1',4),('1','2',5),('1','3',2),('1','4',10),
('2','1',1),('2','2',2),('2','3',2),('2','4',3),
('3','1',3),('3','7',3),('3','6',2),('3','5',3),
('4','1',3),('4','7',3),('4','6',2),('4','5',5),
('5','1',13),('5','7',4),('5','6',12),('5','5',6)