package org.costudy.backend.service;

import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.model.User;
import org.costudy.backend.model.UserStudyRoom;
import org.costudy.backend.repo.UserRepo;
import org.costudy.backend.repo.UserStudyRoomRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepo repo;
    private final UserStudyRoomRepo userStudyRoomRepo;

    public UserService(UserRepo userRepo, UserStudyRoomRepo userStudyRoomRepo) {
        this.repo = userRepo;
        this.userStudyRoomRepo = userStudyRoomRepo;
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

    public List<StudyRoom> getUserRooms(String username) {
        User user = getCurrentUser(username);
        List<UserStudyRoom> relationships = userStudyRoomRepo.findByUser(user);

        return relationships.stream()
                .map(UserStudyRoom::getStudyRoom)
                .collect(Collectors.toList());
    }
}

