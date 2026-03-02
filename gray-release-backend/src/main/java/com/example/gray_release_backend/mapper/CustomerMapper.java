package com.example.gray_release_backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.gray_release_backend.model.Customer;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CustomerMapper extends BaseMapper<Customer> {
}
