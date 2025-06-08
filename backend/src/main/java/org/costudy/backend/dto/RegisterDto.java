package org.costudy.backend.dto;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDto {

    @NotNull
    @Size(min = 3, max = 16)
    private String username;

    @NotNull
    @Size(min = 3, max = 16)
    private String password;

    @NotNull
    @Size(min = 3, max = 16)
    private String email;

}
