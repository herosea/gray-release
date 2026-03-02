package com.example.gray_release_backend.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.gray_release_backend.dto.CreateInviteCodeRequest;
import com.example.gray_release_backend.dto.InviteCodeResponse;
import com.example.gray_release_backend.dto.PagedResult;
import com.example.gray_release_backend.dto.UpdateInviteCodeRequest;
import com.example.gray_release_backend.exception.BizException;
import com.example.gray_release_backend.mapper.InviteCodeMapper;
import com.example.gray_release_backend.model.InviteCode;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Random;

@Service
public class InviteCodeService {

    private static final String STATUS_ENABLED = "ENABLED";
    private static final String STATUS_DISABLED = "DISABLED";
    private static final String SOURCE_MANUAL = "MANUAL";
    private static final String SOURCE_RANDOM = "RANDOM";
    private static final String CODE_PATTERN = "^[A-Z0-9]{6}$";
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private final InviteCodeMapper inviteCodeMapper;
    private final Random random = new Random();

    public InviteCodeService(InviteCodeMapper inviteCodeMapper) {
        this.inviteCodeMapper = inviteCodeMapper;
    }

    public InviteCodeResponse createInviteCode(CreateInviteCodeRequest request) {
        validateCreateOrUpdate(request.getChannel(), request.getCode(), request.getTotalQuota(), request.getAlertThreshold(), true);

        InviteCode inviteCode = new InviteCode();
        inviteCode.setChannel(request.getChannel().trim());
        inviteCode.setTotalQuota(request.getTotalQuota());
        inviteCode.setUsedQuota(0);
        inviteCode.setAlertThreshold(request.getAlertThreshold());
        inviteCode.setStatus(STATUS_ENABLED);
        inviteCode.setDeleted(0);
        inviteCode.setCreatedBy(resolveOperator(request.getOperator()));
        inviteCode.setUpdatedBy(resolveOperator(request.getOperator()));
        inviteCode.setCreatedAt(LocalDateTime.now());
        inviteCode.setUpdatedAt(LocalDateTime.now());

        if (StringUtils.hasText(request.getCode())) {
            String code = normalizeCode(request.getCode());
            validateCodePattern(code);
            ensureCodeNotExists(code);
            inviteCode.setCode(code);
            inviteCode.setSourceType(SOURCE_MANUAL);
        } else {
            inviteCode.setCode(generateOneCode());
            inviteCode.setSourceType(SOURCE_RANDOM);
        }

        inviteCodeMapper.insert(inviteCode);
        return toResponse(inviteCode);
    }

    public InviteCodeResponse getInviteCode(Long id) {
        InviteCode inviteCode = getByIdRequired(id);
        return toResponse(inviteCode);
    }

    public PagedResult<InviteCodeResponse> listInviteCodes(String keyword, String channel, String status, Integer page, Integer size) {
        int pageNo = page == null || page < 1 ? 1 : page;
        int pageSize = size == null || size < 1 ? 10 : size;

        LambdaQueryWrapper<InviteCode> queryWrapper = new LambdaQueryWrapper<InviteCode>()
                .eq(InviteCode::getDeleted, 0);

        if (StringUtils.hasText(channel)) {
            queryWrapper.eq(InviteCode::getChannel, channel.trim());
        }
        if (StringUtils.hasText(status)) {
            String normalizedStatus = status.trim().toUpperCase();
            if (!STATUS_ENABLED.equals(normalizedStatus) && !STATUS_DISABLED.equals(normalizedStatus)) {
                throw new BizException("INVITE_CODE_STATUS_INVALID", "状态仅支持 ENABLED 或 DISABLED");
            }
            queryWrapper.eq(InviteCode::getStatus, normalizedStatus);
        }
        if (StringUtils.hasText(keyword)) {
            String likeKeyword = keyword.trim();
            queryWrapper.and(w -> w.like(InviteCode::getCode, likeKeyword)
                    .or()
                    .like(InviteCode::getChannel, likeKeyword));
        }

        List<InviteCode> all = inviteCodeMapper.selectList(queryWrapper);
        Collections.sort(all, new Comparator<InviteCode>() {
            @Override
            public int compare(InviteCode o1, InviteCode o2) {
                return o2.getId().compareTo(o1.getId());
            }
        });

        int fromIndex = (pageNo - 1) * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, all.size());
        List<InviteCodeResponse> items = new ArrayList<InviteCodeResponse>();

        if (fromIndex < all.size()) {
            for (InviteCode inviteCode : all.subList(fromIndex, toIndex)) {
                items.add(toResponse(inviteCode));
            }
        }

        return new PagedResult<InviteCodeResponse>(pageNo, pageSize, (long) all.size(), items);
    }

    public InviteCodeResponse updateInviteCode(Long id, UpdateInviteCodeRequest request) {
        InviteCode inviteCode = getByIdRequired(id);
        validateCreateOrUpdate(request.getChannel(), request.getCode(), request.getTotalQuota(), request.getAlertThreshold(), false);

        if (inviteCode.getUsedQuota() > 0) {
            if (StringUtils.hasText(request.getChannel()) && !inviteCode.getChannel().equals(request.getChannel().trim())) {
                throw new BizException("INVITE_CODE_IMMUTABLE_FIELD", "该邀请码已被使用，渠道名称不可修改");
            }
            if (StringUtils.hasText(request.getCode())) {
                String normalizedCode = normalizeCode(request.getCode());
                if (!inviteCode.getCode().equals(normalizedCode)) {
                    throw new BizException("INVITE_CODE_IMMUTABLE_FIELD", "该邀请码已被使用，邀请码不可修改");
                }
            }
        } else {
            if (StringUtils.hasText(request.getChannel())) {
                inviteCode.setChannel(request.getChannel().trim());
            }
            if (StringUtils.hasText(request.getCode())) {
                String normalizedCode = normalizeCode(request.getCode());
                validateCodePattern(normalizedCode);
                if (!inviteCode.getCode().equals(normalizedCode)) {
                    ensureCodeNotExists(normalizedCode);
                    inviteCode.setCode(normalizedCode);
                    inviteCode.setSourceType(SOURCE_MANUAL);
                }
            }
        }

        if (request.getTotalQuota() != null) {
            if (request.getTotalQuota() < inviteCode.getUsedQuota()) {
                throw new BizException("INVITE_CODE_QUOTA_INVALID", "总额度不能小于已使用额度");
            }
            inviteCode.setTotalQuota(request.getTotalQuota());
        }
        if (request.getAlertThreshold() != null) {
            inviteCode.setAlertThreshold(request.getAlertThreshold());
        }
        if (inviteCode.getAlertThreshold() > inviteCode.getTotalQuota()) {
            throw new BizException("INVITE_CODE_ALERT_THRESHOLD_INVALID", "告警阈值不能大于总额度");
        }

        inviteCode.setUpdatedBy(resolveOperator(request.getOperator()));
        inviteCode.setUpdatedAt(LocalDateTime.now());

        inviteCodeMapper.updateById(inviteCode);
        return toResponse(inviteCode);
    }

    public InviteCodeResponse updateStatus(Long id, String status, String operator) {
        InviteCode inviteCode = getByIdRequired(id);
        if (!StringUtils.hasText(status)) {
            throw new BizException("INVITE_CODE_STATUS_REQUIRED", "状态不能为空");
        }
        String normalizedStatus = status.trim().toUpperCase();
        if (!STATUS_ENABLED.equals(normalizedStatus) && !STATUS_DISABLED.equals(normalizedStatus)) {
            throw new BizException("INVITE_CODE_STATUS_INVALID", "状态仅支持 ENABLED 或 DISABLED");
        }

        inviteCode.setStatus(normalizedStatus);
        inviteCode.setUpdatedBy(resolveOperator(operator));
        inviteCode.setUpdatedAt(LocalDateTime.now());
        inviteCodeMapper.updateById(inviteCode);
        return toResponse(inviteCode);
    }

    public void deleteInviteCode(Long id) {
        InviteCode inviteCode = getByIdRequired(id);
        if (inviteCode.getUsedQuota() > 0) {
            throw new BizException("INVITE_CODE_DELETE_FORBIDDEN", "邀请码已被使用，不可删除");
        }
        inviteCode.setDeleted(1);
        inviteCode.setUpdatedAt(LocalDateTime.now());
        inviteCodeMapper.updateById(inviteCode);
    }

    public List<String> generateCodes(Integer count) {
        int size = (count == null || count < 1) ? 1 : count;
        if (size > 50) {
            throw new BizException("INVITE_CODE_GENERATE_LIMIT", "一次最多生成 50 个邀请码");
        }

        List<String> codes = new ArrayList<String>();
        for (int i = 0; i < size; i++) {
            codes.add(generateOneCode());
        }
        return codes;
    }

    private String generateOneCode() {
        for (int i = 0; i < 100; i++) {
            String code = randomCode();
            if (!existsCode(code)) {
                return code;
            }
        }
        throw new BizException("INVITE_CODE_GENERATE_FAILED", "邀请码生成失败，请稍后重试");
    }

    private String randomCode() {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            int index = random.nextInt(CHARACTERS.length());
            builder.append(CHARACTERS.charAt(index));
        }
        return builder.toString();
    }

    private InviteCode getByIdRequired(Long id) {
        InviteCode inviteCode = inviteCodeMapper.selectById(id);
        if (inviteCode == null || inviteCode.getDeleted() != null && inviteCode.getDeleted() == 1) {
            throw new BizException("INVITE_CODE_NOT_FOUND", "邀请码不存在");
        }
        return inviteCode;
    }

    private void validateCreateOrUpdate(String channel, String code, Integer totalQuota, Integer alertThreshold, boolean requireCodeOrGenerate) {
        if (StringUtils.hasText(channel)) {
            if (channel.trim().length() > 50) {
                throw new BizException("INVITE_CODE_CHANNEL_TOO_LONG", "渠道名称长度不能超过 50");
            }
        } else if (requireCodeOrGenerate) {
            throw new BizException("INVITE_CODE_CHANNEL_REQUIRED", "渠道名称不能为空");
        }

        if (totalQuota != null && totalQuota < 0) {
            throw new BizException("INVITE_CODE_QUOTA_INVALID", "总额度不能为负数");
        }
        if (alertThreshold != null && alertThreshold < 0) {
            throw new BizException("INVITE_CODE_ALERT_THRESHOLD_INVALID", "告警阈值不能为负数");
        }
        if (totalQuota != null && alertThreshold != null && alertThreshold > totalQuota) {
            throw new BizException("INVITE_CODE_ALERT_THRESHOLD_INVALID", "告警阈值不能大于总额度");
        }

        if (requireCodeOrGenerate && totalQuota == null) {
            throw new BizException("INVITE_CODE_QUOTA_REQUIRED", "总额度不能为空");
        }
        if (requireCodeOrGenerate && alertThreshold == null) {
            throw new BizException("INVITE_CODE_ALERT_THRESHOLD_REQUIRED", "告警阈值不能为空");
        }

        if (StringUtils.hasText(code)) {
            validateCodePattern(normalizeCode(code));
        }
    }

    private void validateCodePattern(String code) {
        if (!code.matches(CODE_PATTERN)) {
            throw new BizException("INVITE_CODE_FORMAT_INVALID", "邀请码必须是 6 位大写字母和数字");
        }
    }

    private void ensureCodeNotExists(String code) {
        if (existsCode(code)) {
            throw new BizException("INVITE_CODE_DUPLICATE", "该邀请码已存在，请重新输入或重新生成");
        }
    }

    private boolean existsCode(String code) {
        Long count = inviteCodeMapper.selectCount(new LambdaQueryWrapper<InviteCode>()
                .eq(InviteCode::getCode, code));
        return count != null && count > 0;
    }

    private InviteCodeResponse toResponse(InviteCode inviteCode) {
        int remaining = inviteCode.getTotalQuota() - inviteCode.getUsedQuota();
        return new InviteCodeResponse(
                inviteCode.getId(),
                inviteCode.getChannel(),
                inviteCode.getCode(),
                inviteCode.getSourceType(),
                inviteCode.getTotalQuota(),
                inviteCode.getUsedQuota(),
                remaining,
                inviteCode.getAlertThreshold(),
                remaining < inviteCode.getAlertThreshold(),
                inviteCode.getStatus(),
                inviteCode.getCreatedAt(),
                inviteCode.getUpdatedAt()
        );
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase();
    }

    private String resolveOperator(String operator) {
        if (!StringUtils.hasText(operator)) {
            return "system";
        }
        return operator.trim();
    }
}
