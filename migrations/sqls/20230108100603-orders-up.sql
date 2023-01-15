CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50)  NOT NULL DEFAULT 'active',
    user_id INTEGER NOT NULL,
    CONSTRAINT user_orders_foreign FOREIGN KEY( user_id) REFERENCES users(id) on delete no action

);