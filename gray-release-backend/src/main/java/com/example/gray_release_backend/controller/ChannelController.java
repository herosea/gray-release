package com.example.gray_release_backend.controller;

import com.example.gray_release_backend.model.ChannelConfig;
import com.example.gray_release_backend.service.InvitationCodeService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/channels")
@CrossOrigin(origins = "*")
public class ChannelController {

    private final InvitationCodeService invitationCodeService;

    public ChannelController(InvitationCodeService invitationCodeService) {
        this.invitationCodeService = invitationCodeService;
    }

    @GetMapping
    public List<ChannelConfig> getChannels() {
        invitationCodeService.initChannelConfigs();
        return invitationCodeService.getAllChannels();
    }
}
