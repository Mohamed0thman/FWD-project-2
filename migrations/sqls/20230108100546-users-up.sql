CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email  VARCHAR(255) UNIQUE NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    password VARCHAR NOT NULL
);

