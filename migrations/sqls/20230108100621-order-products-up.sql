CREATE TABLE IF NOT EXISTS order_product(
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    CONSTRAINT order_product_orders_foreign FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT order_product_products_foreign FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    
);