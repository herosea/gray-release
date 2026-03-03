package com.example.gray_release_backend.dto;

import lombok.Data;

@Data
public class InvitationCodeUpdateReq {
    private String code; // 只有未使用能改
    private String channel; // 只有未使用能改
    private Integer initialQuota;
    private Integer alertThreshold;
}
