package org.costudy.backend.repo;

import org.costudy.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {
    User findByUsername(String username);
    User findById(int id);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    User findByEmail(String username);
}
