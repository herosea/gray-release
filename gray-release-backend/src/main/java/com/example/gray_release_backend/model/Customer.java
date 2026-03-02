package com.example.gray_release_backend.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("customer")
public class Customer {
    @TableId(type = IdType.ASSIGN_ID)
    private String id;
    private String name;
    private String email;
    private String phone;
    private String status;
    private String registeredAt;
    private String totalSpent;
}
