package com.example.gray_release_backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.gray_release_backend.model.InvitationCode;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface InvitationCodeMapper extends BaseMapper<InvitationCode> {

    @Select("SELECT COUNT(1) > 0 FROM invitation_code WHERE code = #{code}")
    boolean existsByCodeAllIncludeDeleted(@Param("code") String code);
}
