package org.costudy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.costudy.backend.model.StudyRoom;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRoomDto {
    private int roomId;
    private String name;
    private String code;
    private boolean admin;
    private int members;
    private int onlineCount;

    public UserRoomDto(StudyRoom room, boolean isAdmin, int members, int onlineCount) {
        this.roomId = room.getRoomId();
        this.name = room.getName();
        this.code = room.getCode();
        this.admin = isAdmin;
        this.members = members;
        this.onlineCount = onlineCount;
    }
}
