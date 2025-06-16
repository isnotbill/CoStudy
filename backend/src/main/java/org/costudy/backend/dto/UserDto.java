package org.costudy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.costudy.backend.model.User;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private int id;
    private String username;
    private String image;
    private boolean isAdmin;

    public UserDto(User user, boolean isAdmin) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.image = user.getImage();
        this.isAdmin = isAdmin;
    }
}
