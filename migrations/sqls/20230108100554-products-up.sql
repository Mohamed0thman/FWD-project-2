CREATE TABLE IF NOT EXISTS products (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR NOT NULL,
    "price" NUMERIC(19,2) NOT NULL,
    "category" VARCHAR(100) NOT NULL DEFAULT 'untitled' 
);