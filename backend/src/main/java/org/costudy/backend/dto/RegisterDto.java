package org.costudy.backend.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDto {

    @NotBlank
    @Size(min = 3, max = 16, message = "Invalid username")
    private String username;

    @NotBlank
    @Size(min = 8, max = 32, message = "Invalid password")
    private String password;

    @NotBlank
    @Email(message = "Invalid email")
    private String email;

}
