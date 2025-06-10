package org.costudy.backend.service;

import org.costudy.backend.model.User;
import org.costudy.backend.repo.UserRepo;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepo repo;

    public UserService(UserRepo userRepo) {
        this.repo = userRepo;
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
}

