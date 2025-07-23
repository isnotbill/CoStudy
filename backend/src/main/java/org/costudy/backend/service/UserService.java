package org.costudy.backend.service;

import jakarta.validation.Valid;
import org.costudy.backend.dto.UpdateInfoDto;
import org.costudy.backend.dto.UpdatePasswordDto;
import org.costudy.backend.dto.UserRoomDto;
import org.costudy.backend.exception.InvalidCredentialsException;
import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.model.User;
import org.costudy.backend.model.UserStudyRoom;
import org.costudy.backend.repo.StudyRoomRepo;
import org.costudy.backend.repo.UserRepo;
import org.costudy.backend.repo.UserStudyRoomRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepo repo;
    private final UserStudyRoomRepo userStudyRoomRepo;
    private final StudyRoomRepo studyRoomRepo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepo userRepo, UserStudyRoomRepo userStudyRoomRepo, StudyRoomRepo studyRoomRepo, PasswordEncoder passwordEncoder) {
        this.repo = userRepo;
        this.userStudyRoomRepo = userStudyRoomRepo;
        this.studyRoomRepo = studyRoomRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public User getCurrentUser(String username) {
        return repo.findByUsername(username);
    }

    public User getCurrentUserById(int id){
        return repo.findById(id);
    }

    public void save(User user) {
        repo.save(user);
    }

    public List<UserRoomDto> getUserRooms(String username) {
        User user = getCurrentUser(username);
        List<UserStudyRoom> relationships = userStudyRoomRepo.findActiveByUser(user);
        return relationships.stream()
                .map(rel -> {
                    StudyRoom room = rel.getStudyRoom();
                    return new UserRoomDto(room, rel.isAdmin(), userStudyRoomRepo.countByStudyRoomAndHasLeftFalse(room));
                })
                .collect(Collectors.toList());
    }

    public void deleteAccount(User user) {
        List<StudyRoom> roomsToDelete = userStudyRoomRepo.findAdminRoomsByUser(user.getId());
        studyRoomRepo.deleteAll(roomsToDelete);
        repo.delete(user);
    }

    public void updatePassword(UpdatePasswordDto updatePasswordDto, User currentUser) {
        String currentPassword = currentUser.getPassword();
        if(!passwordEncoder.matches(updatePasswordDto.getOldPassword(), currentPassword)) {
            throw new InvalidCredentialsException("Old password does not match.");
        }

        if(!updatePasswordDto.getNewPassword()
                .equals(updatePasswordDto.getConfirmPassword())) {
            throw new InvalidCredentialsException("Password does not match.");
        }

        currentUser.setPassword(
                passwordEncoder.encode(updatePasswordDto.getNewPassword())
        );
        User user = repo.save(currentUser);
        System.out.println(passwordEncoder.encode(updatePasswordDto.getNewPassword()));
        System.out.println(user.getPassword());
    }

    public void updateUserInfo(UpdateInfoDto updateInfoDto, User currentUser) {
        currentUser.setUsername(updateInfoDto.getNewUsername());

        repo.save(currentUser);
    }
}

