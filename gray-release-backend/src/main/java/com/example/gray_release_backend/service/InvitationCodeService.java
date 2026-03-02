package com.example.gray_release_backend.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.gray_release_backend.mapper.ChannelConfigMapper;
import com.example.gray_release_backend.mapper.InvitationCodeMapper;
import com.example.gray_release_backend.model.ChannelConfig;
import com.example.gray_release_backend.model.InvitationCode;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class InvitationCodeService {

    @Autowired
    private InvitationCodeMapper invitationCodeMapper;

    @Autowired
    private ChannelConfigMapper channelConfigMapper;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public List<InvitationCode> getAllCodes() {
        return invitationCodeMapper.selectList(null);
    }

    public Page<InvitationCode> getCodesPage(int page, int size, String channelName, String status) {
        Page<InvitationCode> pageParam = new Page<>(page, size);
        QueryWrapper<InvitationCode> wrapper = new QueryWrapper<>();

        if (channelName != null && !channelName.isEmpty()) {
            wrapper.eq("channel_name", channelName);
        }
        if (status != null && !status.isEmpty()) {
            wrapper.eq("status", status);
        }

        wrapper.orderByDesc("created_at");
        return invitationCodeMapper.selectPage(pageParam, wrapper);
    }

    public InvitationCode createCode(InvitationCode code) {
        String now = LocalDateTime.now().format(FORMATTER);
        code.setCreatedAt(now);
        code.setUpdatedAt(now);
        code.setUsedQuota(0);
        code.setStatus("active");
        invitationCodeMapper.insert(code);
        return code;
    }

    public InvitationCode updateCode(InvitationCode code) {
        code.setUpdatedAt(LocalDateTime.now().format(FORMATTER));
        invitationCodeMapper.updateById(code);
        return invitationCodeMapper.selectById(code.getId());
    }

    public boolean deleteCode(String id) {
        return invitationCodeMapper.deleteById(id) > 0;
    }

    public InvitationCode toggleStatus(String id) {
        InvitationCode code = invitationCodeMapper.selectById(id);
        if (code != null) {
            code.setStatus("active".equals(code.getStatus()) ? "disabled" : "active");
            code.setUpdatedAt(LocalDateTime.now().format(FORMATTER));
            invitationCodeMapper.updateById(code);
        }
        return code;
    }

    public boolean checkCodeUnique(String code) {
        QueryWrapper<InvitationCode> wrapper = new QueryWrapper<>();
        wrapper.eq("code", code);
        return invitationCodeMapper.selectCount(wrapper) == 0;
    }

    public String generateRandomCode() {
        String code;
        int attempts = 0;
        do {
            code = RandomStringUtils.random(6, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
            attempts++;
        } while (!checkCodeUnique(code) && attempts < 10);
        return code;
    }

    public InvitationCode getCodeById(String id) {
        return invitationCodeMapper.selectById(id);
    }

    public List<ChannelConfig> getAllChannels() {
        return channelConfigMapper.selectList(null);
    }

    public ChannelConfig getChannelByName(String channelName) {
        QueryWrapper<ChannelConfig> wrapper = new QueryWrapper<>();
        wrapper.eq("channel_name", channelName);
        return channelConfigMapper.selectOne(wrapper);
    }

    public boolean initChannelConfigs() {
        List<ChannelConfig> existing = channelConfigMapper.selectList(null);
        if (!existing.isEmpty()) {
            return false;
        }

        String now = LocalDateTime.now().format(FORMATTER);

        ChannelConfig xhs = new ChannelConfig();
        xhs.setChannelName("小红书");
        xhs.setDefaultQuota(100);
        xhs.setDefaultAlertThreshold(10);
        xhs.setCreatedAt(now);
        channelConfigMapper.insert(xhs);

        ChannelConfig app = new ChannelConfig();
        app.setChannelName("App内");
        app.setDefaultQuota(300);
        app.setDefaultAlertThreshold(20);
        app.setCreatedAt(now);
        channelConfigMapper.insert(app);

        return true;
    }
}
