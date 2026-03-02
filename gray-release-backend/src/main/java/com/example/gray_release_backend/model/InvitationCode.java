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
@TableName("invitation_code")
public class InvitationCode {
    @TableId(type = IdType.ASSIGN_ID)
    private String id;
    private String code;
    private String channelName;
    private Integer totalQuota;
    private Integer usedQuota;
    private Integer alertThreshold;
    private String status;
    private String createdAt;
    private String updatedAt;
}
