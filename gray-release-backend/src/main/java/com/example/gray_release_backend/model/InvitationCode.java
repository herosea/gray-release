package com.example.gray_release_backend.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("invitation_code")
public class InvitationCode {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String code;
    private String channel;
    private Integer initialQuota;
    private Integer usedQuota;
    private Integer alertThreshold;
    private Integer status; // 0: 禁用, 1: 启用
    
    @TableLogic(value = "0", delval = "1")
    private Integer isDeleted;
    
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
