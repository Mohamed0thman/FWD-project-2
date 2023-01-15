CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email  VARCHAR(255) UNIQUE NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    password VARCHAR NOT NULL
);

-- INSERT INTO users (email, firstName, lastName, password) values('user@gmail.com', 'mohamed', 'ramadan', '$2a$10$zO/ZkL9W042FsEF2JcYkVO./NFqRysacRCP7ROVr2eQJLPw7E/pQ6
-- ')