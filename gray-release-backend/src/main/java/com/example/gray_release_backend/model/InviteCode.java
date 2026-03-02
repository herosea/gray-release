package com.example.gray_release_backend.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("invite_code")
public class InviteCode {

    @TableId(type = IdType.AUTO)
    private Long id;
    private String channel;
    private String code;
    private String sourceType;
    private Integer totalQuota;
    private Integer usedQuota;
    private Integer alertThreshold;
    private String status;
    private Integer deleted;
    private String createdBy;
    private String updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
