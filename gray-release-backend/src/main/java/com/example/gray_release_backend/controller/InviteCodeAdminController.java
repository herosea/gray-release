package com.example.gray_release_backend.controller;

import com.example.gray_release_backend.dto.CreateInviteCodeRequest;
import com.example.gray_release_backend.dto.GenerateInviteCodeRequest;
import com.example.gray_release_backend.dto.GenerateInviteCodeResponse;
import com.example.gray_release_backend.dto.InviteCodeResponse;
import com.example.gray_release_backend.dto.PagedResult;
import com.example.gray_release_backend.dto.UpdateInviteCodeRequest;
import com.example.gray_release_backend.dto.UpdateInviteCodeStatusRequest;
import com.example.gray_release_backend.service.InviteCodeService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/invite-codes")
@CrossOrigin(origins = "*")
public class InviteCodeAdminController {

    private final InviteCodeService inviteCodeService;

    public InviteCodeAdminController(InviteCodeService inviteCodeService) {
        this.inviteCodeService = inviteCodeService;
    }

    @PostMapping
    public InviteCodeResponse createInviteCode(@RequestBody CreateInviteCodeRequest request) {
        return inviteCodeService.createInviteCode(request);
    }

    @GetMapping
    public PagedResult<InviteCodeResponse> listInviteCodes(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String channel,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        return inviteCodeService.listInviteCodes(keyword, channel, status, page, size);
    }

    @GetMapping("/{id}")
    public InviteCodeResponse getInviteCode(@PathVariable Long id) {
        return inviteCodeService.getInviteCode(id);
    }

    @PutMapping("/{id}")
    public InviteCodeResponse updateInviteCode(@PathVariable Long id, @RequestBody UpdateInviteCodeRequest request) {
        return inviteCodeService.updateInviteCode(id, request);
    }

    @PatchMapping("/{id}/status")
    public InviteCodeResponse updateStatus(@PathVariable Long id, @RequestBody UpdateInviteCodeStatusRequest request) {
        return inviteCodeService.updateStatus(id, request.getStatus(), request.getOperator());
    }

    @DeleteMapping("/{id}")
    public void deleteInviteCode(@PathVariable Long id) {
        inviteCodeService.deleteInviteCode(id);
    }

    @PostMapping("/generate")
    public GenerateInviteCodeResponse generateCodes(@RequestBody(required = false) GenerateInviteCodeRequest request) {
        Integer count = request == null ? null : request.getCount();
        return new GenerateInviteCodeResponse(inviteCodeService.generateCodes(count));
    }
}
