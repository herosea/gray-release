package com.example.gray_release_backend.service;

import com.example.gray_release_backend.mapper.CustomerMapper;
import com.example.gray_release_backend.model.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerMapper customerMapper;

    public List<Customer> getAllCustomers() {
        return customerMapper.selectList(null);
    }
}
