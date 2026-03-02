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
@TableName("channel_config")
public class ChannelConfig {
    @TableId(type = IdType.ASSIGN_ID)
    private String id;
    private String channelName;
    private Integer defaultQuota;
    private Integer defaultAlertThreshold;
    private String createdAt;
}
