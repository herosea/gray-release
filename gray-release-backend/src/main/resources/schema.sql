CREATE TABLE IF NOT EXISTS customer (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    status VARCHAR(20),
    registered_at VARCHAR(50),
    total_spent VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS invitation_code (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    channel_name VARCHAR(50) NOT NULL,
    total_quota INT NOT NULL DEFAULT 0,
    used_quota INT NOT NULL DEFAULT 0,
    alert_threshold INT NOT NULL DEFAULT 10,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at VARCHAR(50),
    updated_at VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS channel_config (
    id VARCHAR(50) PRIMARY KEY,
    channel_name VARCHAR(50) NOT NULL UNIQUE,
    default_quota INT NOT NULL,
    default_alert_threshold INT NOT NULL,
    created_at VARCHAR(50)
);
