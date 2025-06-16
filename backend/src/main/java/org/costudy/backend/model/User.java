package org.costudy.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.costudy.backend.dto.RegisterDto;

import java.util.List;

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

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<UserStudyRoom> userStudyRooms;
}
