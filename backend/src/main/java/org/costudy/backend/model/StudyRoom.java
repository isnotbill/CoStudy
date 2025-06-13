package org.costudy.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudyRoom {
    @Id
    @GeneratedValue
    private int roomId;
    private String name;
    private String code;

    @OneToMany(mappedBy = "studyRoom")
    @JsonIgnore
    private List<UserStudyRoom> userStudyRooms;
}
