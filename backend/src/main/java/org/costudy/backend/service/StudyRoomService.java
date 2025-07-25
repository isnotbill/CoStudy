package org.costudy.backend.service;

import jakarta.validation.Valid;
import org.costudy.backend.dto.CreateRoomDto;
import org.costudy.backend.dto.PublicRoomDto;
import org.costudy.backend.dto.UserDto;
import org.costudy.backend.exception.ConflictException;
import org.costudy.backend.exception.RoomLimitExceededException;
import org.costudy.backend.model.*;
import org.costudy.backend.model.MessageType;
import org.costudy.backend.repo.ChatMessageRepository;
import org.costudy.backend.repo.SettingsRepo;
import org.costudy.backend.repo.StudyRoomRepo;
import org.costudy.backend.repo.UserStudyRoomRepo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    private static final int maxRooms = 15;

    private final UserStudyRoomRepo userStudyRoomRepo;
    private final StudyRoomRepo roomRepo;
    private final ChatMessageRepository chatRepo;
    private final SettingsService settingsService;

    public StudyRoomService(UserStudyRoomRepo userStudyRoomRepo, StudyRoomRepo studyRoomRepo, ChatMessageRepository chatRepo, SettingsService settingsService) {
        this.userStudyRoomRepo = userStudyRoomRepo;
        this.roomRepo = studyRoomRepo;
        this.chatRepo = chatRepo;
        this.settingsService = settingsService;
    }


    public String createRoom(User user, CreateRoomDto createRoomDto) {
        if(userStudyRoomRepo.countByUser(user) >= maxRooms) {
            throw new RoomLimitExceededException("Room limit exceeded (15)");
        }

        StudyRoom room = new StudyRoom();
        room.setName(createRoomDto.getName());

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

        settingsService.createSettings(room, createRoomDto);

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
            throw new ConflictException("Duplicate");
        }

        if(userStudyRoomRepo.countByUser(currentUser) >= maxRooms) {
            throw new RoomLimitExceededException("Room limit exceeded (15)");
        }

        UserStudyRoom rel = new UserStudyRoom();
        UserDto user = new UserDto(currentUser, false);
        UserStudyRoomId id = new UserStudyRoomId(currentUser.getId(), room.getRoomId());

        rel.setId(id);
        rel.setStudyRoom(room);
        rel.setUser(currentUser);
        rel.setAdmin(false);
        rel.setHasLeft(false);

        userStudyRoomRepo.save(rel);

        return user;
    }

    public void leaveRoom(User currentUser, String roomCode) {
        StudyRoom room = getStudyRoom(roomCode);
        if(room == null) {
            throw new IllegalArgumentException("Room does not exist or invalid room code");
        }

        Optional<UserStudyRoom> rel = userStudyRoomRepo.findByIdUserIdAndIdRoomId(currentUser.getId(), room.getRoomId());

        if(rel.isEmpty()) {
            throw new AccessDeniedException("User is not in this room");
        }

        UserStudyRoom userRel = rel.get();
        userRel.setHasLeft(true);

        userStudyRoomRepo.save(userRel);
    }

    public List<UserDto> getUsersInRoom(String roomCode) {
        StudyRoom room = getStudyRoom(roomCode);
        List<UserStudyRoom> relationships = userStudyRoomRepo.findActiveByStudyRoom(room);
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

        Optional<UserStudyRoom> relationship = userStudyRoomRepo.findByIdUserIdAndIdRoomId(admin.getId(), room.getRoomId());
        if(relationship.isEmpty()) {
            throw new AccessDeniedException("This admin is not in this room");
        }

        UserStudyRoom rel = relationship.get();
        if(!rel.isAdmin()) {
            throw new AccessDeniedException("This user is not an admin");
        }

        rel.setHasLeft(true);

        userStudyRoomRepo.save(rel);
    }

    public ChatMessage announceJoin(User user, StudyRoom room) {
        ChatMessage chat = new ChatMessage();
        chat.setType(MessageType.SERVER);
        chat.setContent("\uD83E\uDC72 " + user.getUsername() + " joined the room!");
        chat.setStudyRoom(room);
        chatRepo.save(chat);
        return chat;
    }

    public ChatMessage announceKick(User user, StudyRoom room) {
        ChatMessage chat = new ChatMessage();
        chat.setType(MessageType.SERVER);
        chat.setContent("\uD83E\uDC70 " + user.getUsername() + " was shown the exit! \uD83D\uDC4B");
        chat.setStudyRoom(room);
        chatRepo.save(chat);
        return chat;
    }

    public ChatMessage announceLeave(User currentUser, StudyRoom room) {
        ChatMessage chat = new ChatMessage();
        chat.setType(MessageType.SERVER);
        chat.setContent("\uD83E\uDC70 " + currentUser.getUsername() + " left the room!");
        chat.setStudyRoom(room);
        chatRepo.save(chat);
        return chat;
    }


    public Page<PublicRoomDto> getPublicRooms(int page, int limit, String keyword, String username) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by("name").ascending());
        Page<StudyRoom> studyRooms = roomRepo.findPublicRoomsExcludingUser(keyword, username, pageable);
        return studyRooms
                .map(room -> {
                    List<UserStudyRoom> rels = userStudyRoomRepo.findByStudyRoom(room);
                    String hostName = null;
                    for(UserStudyRoom r : rels) {

                        if(r.isAdmin()) {
                            hostName = r.getUser().getUsername();
                        }
                    }
                    return new PublicRoomDto(room.getRoomId(), room.getCode(), room.getName(), hostName, userStudyRoomRepo.countByStudyRoomAndHasLeftFalse(room));
                });
    }


}
