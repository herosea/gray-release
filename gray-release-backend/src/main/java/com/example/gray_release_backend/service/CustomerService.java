package com.example.gray_release_backend.service;

import com.example.gray_release_backend.model.Customer;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerService {
    private final List<Customer> customers = new ArrayList<>();

    public CustomerService() {
        customers.add(new Customer("CUS-001", "张三", "zhangsan@example.com", "13800138000", "active", "2023-10-15", "¥12,500"));
        customers.add(new Customer("CUS-002", "李四", "lisi@test.com", "13900139000", "active", "2023-11-02", "¥8,300"));
        customers.add(new Customer("CUS-003", "王五", "wangwu@company.com", "13700137000", "inactive", "2024-01-20", "¥0"));
        customers.add(new Customer("CUS-004", "赵六", "zhaoliu@domain.cn", "13600136000", "active", "2024-02-14", "¥3,200"));
        customers.add(new Customer("CUS-005", "钱七", "qianqi@mail.com", "13500135000", "active", "2024-02-28", "¥1,150"));
    }

    public List<Customer> getAllCustomers() {
        return customers;
    }
}
