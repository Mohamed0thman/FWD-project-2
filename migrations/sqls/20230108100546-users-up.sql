CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email  VARCHAR(255) UNIQUE NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    password VARCHAR NOT NULL
);

-- $2y$10$CRkvGivua7/4NPmC5FhvMOhbD3bb7FYjnCNXoDCHGnINOjFQGbUFS


INSERT INTO users (email, firstName, lastName,password) values ('test@gmail.com', 'test', 'test','1234asdf'),
('test1@gmail.com', 'test1', 'test1','1234asdf'),
('test2@gmail.com', 'test2', 'test2','1234asdf'),
('test3@gmail.com', 'test3', 'test3','1234asdf'),
('test4@gmail.com', 'test4', 'test4','1234asdf'),
('test5@gmail.com', 'test5', 'test5','1234asdf')