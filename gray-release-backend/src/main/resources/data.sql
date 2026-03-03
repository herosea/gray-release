INSERT INTO customer (id, name, email, phone, status, registered_at, total_spent) VALUES
('CUS-001', '张三', 'zhangsan@example.com', '13800138000', 'active', '2023-10-15', '¥12,500'),
('CUS-002', '李四', 'lisi@test.com', '13900139000', 'active', '2023-11-02', '¥8,300'),
('CUS-003', '王五', 'wangwu@company.com', '13700137000', 'inactive', '2024-01-20', '¥0'),
('CUS-004', '赵六', 'zhaoliu@domain.cn', '13600136000', 'active', '2024-02-14', '¥3,200'),
('CUS-005', '钱七', 'qianqi@mail.com', '13500135000', 'active', '2024-02-28', '¥1,150');

INSERT INTO invitation_code (code, channel, initial_quota, used_quota, alert_threshold, status, is_deleted) VALUES
('XHS888', '小红书', 100, 0, 10, 1, 0),
('APP2025', 'App内', 300, 0, 20, 1, 0),
('VIP001', '小红书', 10, 10, 5, 1, 0),
('E43AAB', 'App内', 100, 0, 10, 0, 0);
