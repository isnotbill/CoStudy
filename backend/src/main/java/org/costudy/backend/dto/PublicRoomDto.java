package org.costudy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PublicRoomDto {
    private int id;
    private String code;
    private String roomName;
    private String hostName;
    private int members;
}
