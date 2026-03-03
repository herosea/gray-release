package com.example.gray_release_backend.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.gray_release_backend.dto.InvitationCodeCreateReq;
import com.example.gray_release_backend.dto.InvitationCodeUpdateReq;
import com.example.gray_release_backend.model.InvitationCode;
import com.example.gray_release_backend.service.InvitationCodeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/invitation-codes")
@CrossOrigin(origins = "*")
public class AdminInvitationCodeController {

    private final InvitationCodeService invitationCodeService;

    public AdminInvitationCodeController(InvitationCodeService invitationCodeService) {
        this.invitationCodeService = invitationCodeService;
    }

    @GetMapping
    public ResponseEntity<Page<InvitationCode>> getCodes(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<InvitationCode> page = new Page<>(current, size);
        return ResponseEntity.ok(invitationCodeService.page(page));
    }

    @PostMapping
    public ResponseEntity<String> createCode(@RequestBody InvitationCodeCreateReq req) {
        String code = req.getCode();
        if (code == null || code.trim().isEmpty()) {
            // Auto generate
            do {
                code = invitationCodeService.generateRandomCode();
            } while (invitationCodeService.existsByCodeAll(code));
        } else {
            // Check uniqueness
            if (invitationCodeService.existsByCodeAll(code)) {
                return ResponseEntity.badRequest().body("该邀请码已存在，请重新输入或重新生成");
            }
        }

        InvitationCode entity = new InvitationCode();
        entity.setCode(code);
        entity.setChannel(req.getChannel());
        entity.setInitialQuota(req.getInitialQuota());
        entity.setUsedQuota(0);
        entity.setAlertThreshold(req.getAlertThreshold());
        entity.setStatus(1);
        entity.setIsDeleted(0);
        invitationCodeService.save(entity);

        return ResponseEntity.ok("Success");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateCode(@PathVariable Long id, @RequestBody InvitationCodeUpdateReq req) {
        InvitationCode existing = invitationCodeService.getById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        boolean isUsed = existing.getUsedQuota() > 0;
        
        if (!isUsed) {
            // 未被使用：可以修改全部（包括 code, channel）
            if (req.getCode() != null && !req.getCode().equals(existing.getCode())) {
                if (invitationCodeService.existsByCodeAll(req.getCode())) {
                    return ResponseEntity.badRequest().body("该邀请码已存在，请重新输入或重新生成");
                }
                existing.setCode(req.getCode());
            }
            if (req.getChannel() != null) {
                existing.setChannel(req.getChannel());
            }
        }
        
        if (req.getInitialQuota() != null) {
            if (isUsed && req.getInitialQuota() < existing.getUsedQuota()) {
                return ResponseEntity.badRequest().body("修改后的额度不能小于已使用额度");
            }
            existing.setInitialQuota(req.getInitialQuota());
        }
        
        if (req.getAlertThreshold() != null) {
            existing.setAlertThreshold(req.getAlertThreshold());
        }

        invitationCodeService.updateById(existing);
        return ResponseEntity.ok("Success");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        InvitationCode existing = invitationCodeService.getById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        existing.setStatus(status);
        invitationCodeService.updateById(existing);
        return ResponseEntity.ok("Success");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCode(@PathVariable Long id) {
        InvitationCode existing = invitationCodeService.getById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        invitationCodeService.removeById(id);
        return ResponseEntity.ok("Success");
    }
}
