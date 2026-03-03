package com.example.gray_release_backend.dto;

import lombok.Data;

@Data
public class InvitationCodeCreateReq {
    private String code; // 可以为空，表示自动生成
    private String channel;
    private Integer initialQuota;
    private Integer alertThreshold;
}
