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
    @Size(min = 3, max = 16, message = "Username must be between 3 and 16 characters long.")
    private String username;

    @NotBlank
    @Size(min = 8, max = 32, message = "Password must be between 8 and 32 characters.")
    private String password;

    @NotBlank
    @Email(message = "Invalid email")
    private String email;

}
