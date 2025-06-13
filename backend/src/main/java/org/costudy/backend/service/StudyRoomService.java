package org.costudy.backend.service;

import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.model.User;
import org.costudy.backend.model.UserStudyRoom;
import org.costudy.backend.model.UserStudyRoomId;
import org.costudy.backend.repo.StudyRoomRepo;
import org.costudy.backend.repo.UserStudyRoomRepo;
import org.springframework.stereotype.Service;

@Service
public class StudyRoomService {

    private final UserStudyRoomRepo userStudyRoomRepo;
    private final StudyRoomRepo roomRepo;

    public StudyRoomService(UserStudyRoomRepo userStudyRoomRepo, StudyRoomRepo studyRoomRepo) {
        this.userStudyRoomRepo = userStudyRoomRepo;
        this.roomRepo = studyRoomRepo;
    }


    public void createRoom(User user) {
        StudyRoom room = new StudyRoom();
        room.setCode("POOP");

        roomRepo.save(room);


        UserStudyRoom relationship = new UserStudyRoom();
        UserStudyRoomId id = new UserStudyRoomId(user.getId(), room.getRoom_id());
        relationship.setId(id);
        relationship.setUser(user);
        relationship.setStudyRoom(room);

        userStudyRoomRepo.save(relationship);
    }

    public StudyRoom getStudyRoom(String roomCode) {
        return roomRepo.findByCode(roomCode);
    }
}
