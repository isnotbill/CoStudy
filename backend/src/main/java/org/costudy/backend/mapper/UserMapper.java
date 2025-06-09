package org.costudy.backend.mapper;

import org.costudy.backend.dto.RegisterDto;
import org.costudy.backend.model.User;

public class UserMapper {
    public static User toUser(RegisterDto registerDto) {
        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setPassword(registerDto.getPassword());
        user.setEmail(registerDto.getEmail());
        return user;
    }
}
