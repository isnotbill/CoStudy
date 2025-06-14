package org.costudy.backend.service;

import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.model.User;
import org.costudy.backend.model.UserStudyRoom;
import org.costudy.backend.model.UserStudyRoomId;
import org.costudy.backend.repo.StudyRoomRepo;
import org.costudy.backend.repo.UserStudyRoomRepo;
import org.costudy.backend.response.ApiResponse;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class StudyRoomService {
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 6;
    private static final SecureRandom random = new SecureRandom();

    private final UserStudyRoomRepo userStudyRoomRepo;
    private final StudyRoomRepo roomRepo;

    public StudyRoomService(UserStudyRoomRepo userStudyRoomRepo, StudyRoomRepo studyRoomRepo) {
        this.userStudyRoomRepo = userStudyRoomRepo;
        this.roomRepo = studyRoomRepo;
    }


    public String createRoom(User user, String name) {
        StudyRoom room = new StudyRoom();
        room.setName(name);

        String code = generateJoinCode();
        room.setCode(code);

        roomRepo.save(room);

        UserStudyRoom relationship = new UserStudyRoom();
        UserStudyRoomId id = new UserStudyRoomId(user.getId(), room.getRoomId());
        relationship.setId(id);
        relationship.setUser(user);
        relationship.setStudyRoom(room);
        relationship.setAdmin(true);

        userStudyRoomRepo.save(relationship);
        return code;
    }

    public StudyRoom getStudyRoom(String roomCode) {
        return roomRepo.findByCode(roomCode);
    }

    private String generateJoinCode() {
        String joinCode = null;
        do {
            joinCode = generateRandomCode();
        } while(roomRepo.existsByCode(joinCode));

        return joinCode;
    }

    private String generateRandomCode() {
        StringBuilder sb = new StringBuilder();
        for(int i = 0; i < CODE_LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }

//    public ApiResponse<?> deleteRoomById(int id, User user) {
//        UserStudyRoom userStudyRoom = userStudyRoomRepo.findByIdUserIdAndRoomId(id, user.getId());
//        if(!userStudyRoom.isAdmin()) {
//            return new ApiResponse<>(false, "User is not an admin of this room");
//        }
//        StudyRoom studyRoom = userStudyRoom.getStudyRoom();
//    }
}
