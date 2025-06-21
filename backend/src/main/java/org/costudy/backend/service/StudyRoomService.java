package org.costudy.backend.service;

import org.costudy.backend.dto.UserDto;
import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.model.User;
import org.costudy.backend.model.UserStudyRoom;
import org.costudy.backend.model.UserStudyRoomId;
import org.costudy.backend.repo.StudyRoomRepo;
import org.costudy.backend.repo.UserStudyRoomRepo;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public void deleteRoomById(int roomId, User user){
        Optional<UserStudyRoom> relationshipOpt = userStudyRoomRepo.findByIdUserIdAndIdRoomId(user.getId(), roomId);
        if(relationshipOpt.isEmpty()) {
            throw new AccessDeniedException("User is not a member or room does not exist");
        }

        UserStudyRoom rel = relationshipOpt.get();

        if(!rel.isAdmin()) {
            throw new AccessDeniedException("User is not an admin");
        }
        roomRepo.deleteById(roomId);
    }

    public boolean isInRoom(User user, StudyRoom room) {
        Optional<UserStudyRoom> rel = userStudyRoomRepo.findByIdUserIdAndIdRoomId(user.getId(), room.getRoomId());
        if(rel.isEmpty()) {
            return false;
        }
        return true;
    }

    public UserDto joinRoom(User currentUser, String roomCode) {
        StudyRoom room = getStudyRoom(roomCode);
        if(room == null) {
            throw new IllegalArgumentException("Room does not exist or invalid room code");
        }

        if(isInRoom(currentUser, room)) {
            throw new AccessDeniedException("Duplicate");
        }

        UserStudyRoom rel = new UserStudyRoom();
        UserDto user = new UserDto(currentUser, false);
        UserStudyRoomId id = new UserStudyRoomId(currentUser.getId(), room.getRoomId());

        rel.setId(id);
        rel.setStudyRoom(room);
        rel.setUser(currentUser);
        rel.setAdmin(false);

        userStudyRoomRepo.save(rel);

        return user;
    }

    public void leaveRoom(User currentUser, String roomCode) {
        StudyRoom room = getStudyRoom(roomCode);
        if(room == null) {
            throw new IllegalArgumentException("Room does not exist or invalid room code");
        }

        if(!isInRoom(currentUser, room)) {
            throw new AccessDeniedException("User is not in this room");
        }

        userStudyRoomRepo.delete(
                userStudyRoomRepo.findByIdUserIdAndIdRoomId(currentUser.getId(), room.getRoomId())
                        .get());
    }

    public List<UserDto> getUsersInRoom(String roomCode) {
        StudyRoom room = getStudyRoom(roomCode);
        List<UserStudyRoom> relationships = userStudyRoomRepo.findByStudyRoom(room);
        return relationships
                .stream()
                .map(rel -> new UserDto(rel.getUser(), rel.isAdmin()))
                .collect(Collectors.toList());
    }

    public void kickUser(String roomCode, User admin, User user) {
        StudyRoom room = roomRepo.findByCode(roomCode);
        if(room == null) {
            throw new IllegalArgumentException("Room does not exist or this code is invalid");
        }

        if(!isInRoom(admin, room) || !isInRoom(user, room)) {
            throw new AccessDeniedException("This user does not belong to this room");
        }

        Optional<UserStudyRoom> relationship = userStudyRoomRepo.findByIdUserIdAndIdRoomId(admin.getId(), room.getRoomId());
        if(relationship.isEmpty()) {
            throw new AccessDeniedException("This admin is not in this room");
        }

        UserStudyRoom rel = relationship.get();
        if(!rel.isAdmin()) {
            throw new AccessDeniedException("This user is not an admin");
        }

        userStudyRoomRepo.delete(
                userStudyRoomRepo.findByIdUserIdAndIdRoomId(user.getId(), room.getRoomId()).get()
        );
    }
}
