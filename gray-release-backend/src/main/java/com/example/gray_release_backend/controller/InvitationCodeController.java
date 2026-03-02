package com.example.gray_release_backend.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.gray_release_backend.model.ChannelConfig;
import com.example.gray_release_backend.model.InvitationCode;
import com.example.gray_release_backend.service.InvitationCodeService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invitation-codes")
@CrossOrigin(origins = "*")
public class InvitationCodeController {

    private final InvitationCodeService invitationCodeService;

    public InvitationCodeController(InvitationCodeService invitationCodeService) {
        this.invitationCodeService = invitationCodeService;
    }

    @GetMapping
    public Map<String, Object> getCodes(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String channelName,
            @RequestParam(required = false) String status) {

        // 初始化渠道配置
        invitationCodeService.initChannelConfigs();

        Page<InvitationCode> pageResult = invitationCodeService.getCodesPage(page, size, channelName, status);

        Map<String, Object> result = new HashMap<>();
        result.put("data", pageResult.getRecords());
        result.put("total", pageResult.getTotal());
        result.put("page", pageResult.getCurrent());
        result.put("size", pageResult.getSize());

        return result;
    }

    @GetMapping("/list")
    public List<InvitationCode> getAllCodes() {
        invitationCodeService.initChannelConfigs();
        return invitationCodeService.getAllCodes();
    }

    @GetMapping("/{id}")
    public InvitationCode getCodeById(@PathVariable String id) {
        return invitationCodeService.getCodeById(id);
    }

    @PostMapping
    public InvitationCode createCode(@RequestBody InvitationCode code) {
        return invitationCodeService.createCode(code);
    }

    @PutMapping("/{id}")
    public InvitationCode updateCode(@PathVariable String id, @RequestBody InvitationCode code) {
        code.setId(id);
        return invitationCodeService.updateCode(code);
    }

    @DeleteMapping("/{id}")
    public boolean deleteCode(@PathVariable String id) {
        return invitationCodeService.deleteCode(id);
    }

    @PostMapping("/{id}/toggle")
    public InvitationCode toggleStatus(@PathVariable String id) {
        return invitationCodeService.toggleStatus(id);
    }

    @GetMapping("/check/{code}")
    public Map<String, Boolean> checkCodeUnique(@PathVariable String code) {
        Map<String, Boolean> result = new HashMap<>();
        result.put("unique", invitationCodeService.checkCodeUnique(code));
        return result;
    }

    @GetMapping("/generate")
    public Map<String, String> generateCode() {
        Map<String, String> result = new HashMap<>();
        result.put("code", invitationCodeService.generateRandomCode());
        return result;
    }
}
