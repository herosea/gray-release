package com.example.gray_release_backend.dto;

import lombok.Data;

@Data
public class UpdateInviteCodeStatusRequest {
    private String status;
    private String operator;
}
