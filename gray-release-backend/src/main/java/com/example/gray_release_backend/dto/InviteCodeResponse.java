package com.example.gray_release_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InviteCodeResponse {
    private Long id;
    private String channel;
    private String code;
    private String sourceType;
    private Integer totalQuota;
    private Integer usedQuota;
    private Integer remainingQuota;
    private Integer alertThreshold;
    private Boolean alert;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
