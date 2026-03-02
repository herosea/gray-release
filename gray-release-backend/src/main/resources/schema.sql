CREATE TABLE IF NOT EXISTS customer (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    status VARCHAR(20),
    registered_at VARCHAR(50),
    total_spent VARCHAR(50)
);
