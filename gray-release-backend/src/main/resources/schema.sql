CREATE TABLE IF NOT EXISTS customer (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    status VARCHAR(20),
    registered_at VARCHAR(50),
    total_spent VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS invite_code (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    channel VARCHAR(50) NOT NULL,
    code VARCHAR(6) NOT NULL,
    source_type VARCHAR(20) NOT NULL,
    total_quota INT NOT NULL,
    used_quota INT NOT NULL DEFAULT 0,
    alert_threshold INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ENABLED',
    deleted TINYINT NOT NULL DEFAULT 0,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_invite_code_code ON invite_code(code);

CREATE TABLE IF NOT EXISTS invite_redeem_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invite_code_id BIGINT,
    user_id VARCHAR(64),
    redeem_result VARCHAR(20) NOT NULL,
    reason VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_redeem_invite_code FOREIGN KEY (invite_code_id) REFERENCES invite_code(id)
);
