package com.example.gray_release_backend.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.gray_release_backend.mapper.InvitationCodeMapper;
import com.example.gray_release_backend.model.InvitationCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AlertService {

    @Autowired
    private InvitationCodeMapper invitationCodeMapper;

    public List<Map<String, Object>> getAlertStatus() {
        List<InvitationCode> codes = invitationCodeMapper.selectList(null);
        List<Map<String, Object>> alertList = new ArrayList<>();

        for (InvitationCode code : codes) {
            int remaining = code.getTotalQuota() - code.getUsedQuota();
            if (remaining < code.getAlertThreshold()) {
                Map<String, Object> alert = new HashMap<>();
                alert.put("code", code.getCode());
                alert.put("channelName", code.getChannelName());
                alert.put("totalQuota", code.getTotalQuota());
                alert.put("usedQuota", code.getUsedQuota());
                alert.put("remainingQuota", remaining);
                alert.put("alertThreshold", code.getAlertThreshold());
                alert.put("status", code.getStatus());
                alertList.add(alert);
            }
        }

        return alertList;
    }

    public boolean shouldAlert(String codeId) {
        InvitationCode code = invitationCodeMapper.selectById(codeId);
        if (code == null) {
            return false;
        }
        int remaining = code.getTotalQuota() - code.getUsedQuota();
        return remaining < code.getAlertThreshold();
    }
}
