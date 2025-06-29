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
public class UpdateInfoDto {

    @Size(min = 3, max = 16, message = "Username must be between 3 and 16 characters long.")
    @Pattern(
            regexp = "^[A-Za-z0-9_]*$",
            message = "Username can only contain numbers, characters, and underscore."
    )
    private String username;

    @Email
    private String email;
}
