package org.costudy.backend.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
    @Pattern(
            regexp = "^[A-Za-z0-9_]*$",
            message = "Username can only contain numbers, characters, and underscore."
    )
    private String username;

    @NotBlank
    @Size(min = 8, max = 64, message = "Password must be between 8 and 64 characters.")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).+$",
            message = "Password must have at least one lowercase letter, one uppercase letter, one digit, and one special character"
    )
    private String password;

    @NotBlank
    @Email(message = "Invalid email")
    private String email;

    @NotBlank(message = "Captcha is required")
    private String captchaToken;
}
