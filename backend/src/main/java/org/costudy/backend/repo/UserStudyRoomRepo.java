package org.costudy.backend.repo;

import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.model.User;
import org.costudy.backend.model.UserStudyRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserStudyRoomRepo extends JpaRepository<UserStudyRoom, Integer> {
    List<UserStudyRoom> findByUser(User user);
    List<UserStudyRoom> findByStudyRoom(StudyRoom studyRoom);
    Optional<UserStudyRoom> findByIdUserIdAndIdRoomId(int userId, int roomId);
}
