package com.example.gray_release_backend.dto;

import lombok.Data;

@Data
public class CreateInviteCodeRequest {
    private String channel;
    private String code;
    private Integer totalQuota;
    private Integer alertThreshold;
    private String operator;
}
