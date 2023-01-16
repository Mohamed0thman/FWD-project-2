CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50)  NOT NULL DEFAULT 'active',
    user_id INTEGER NOT NULL,
    CONSTRAINT user_orders_foreign FOREIGN KEY( user_id) REFERENCES users(id)  ON DELETE CASCADE

);


INSERT INTO orders (user_id) values ('1'),('2'),('3'),('4'),('5')