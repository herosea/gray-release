package com.example.gray_release_backend.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.gray_release_backend.mapper.InvitationCodeMapper;
import com.example.gray_release_backend.model.InvitationCode;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class InvitationCodeService extends ServiceImpl<InvitationCodeMapper, InvitationCode> {

    /**
     * 判断邀请码是否存在，包括已逻辑删除的也查询
     * 因为要求“检查新码是否与当前已生效或历史已废弃的邀请码重复”
     */
    public boolean existsByCodeAll(String code) {
        // 由于配置了 @TableLogic，默认查不到已删除的
        // 所以我们手写自定义查询或者使用 count(0)
        // 简单起见，可以去掉 wrapper的默认逻辑，但 mybatis-plus 中比较麻烦（需要用自己的 mapper xml或者特定设置）
        // 这里我们可以查询数量，为了兼容已逻辑删除的记录，我们可以使用 xml/注解
        return this.baseMapper.existsByCodeAllIncludeDeleted(code); // TODO: implement in mapper
    }

    /**
     * 随机生成6位满足格式（数字+大写字母）的邀请码
     */
    public String generateRandomCode() {
        String chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
