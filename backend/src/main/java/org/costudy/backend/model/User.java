package org.costudy.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.costudy.backend.dto.RegisterDto;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue
    private int id;
    private String username;
    private String password;
    private String email;
    private String image;

    public User(RegisterDto registerDto) {
        this.username = registerDto.getUsername();
        this.password = registerDto.getPassword();
        this.email = registerDto.getEmail();
    }
}
