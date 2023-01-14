CREATE TABLE IF NOT EXISTS products (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR NOT NULL,
    "price" NUMERIC(19,2) NOT NULL,
    "category" VARCHAR(100) NOT NULL DEFAULT 'unlisted' 
);



INSERT INTO products (name, price, category) values ('bed', 200, 'bedroom'),
('bed', 200, 'bedroom'),('cupboard', 1200, 'bedroom'),('couch', 290, 'livingroom'),
('table', 250, 'livingroom'),
('deep freezer', 300, 'kitchen'),
('television', 2000 ,dEFAULT),
('fridge', 200, 'kitchen'),
('lamp', 16 ,dEFAULT),
('laptop', 3000, dEFAULT),
('cooker', 1500, 'kitchen')
