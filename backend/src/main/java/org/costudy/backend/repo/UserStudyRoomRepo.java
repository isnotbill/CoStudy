package org.costudy.backend.repo;

import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.model.User;
import org.costudy.backend.model.UserStudyRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserStudyRoomRepo extends JpaRepository<UserStudyRoom, Integer> {
    List<UserStudyRoom> findByUser(User user);
    List<UserStudyRoom> findByStudyRoom(StudyRoom studyRoom);
    Optional<UserStudyRoom> findByIdUserIdAndIdRoomId(int userId, int roomId);

    int countByStudyRoom(StudyRoom room);
    int countByUser(User user);
    int countByStudyRoomAndHasLeftFalse(StudyRoom studyRoom);

    @Query("""
           SELECT usr.studyRoom FROM UserStudyRoom usr WHERE usr.user.id = :id AND usr.isAdmin = true
           """)
    List<StudyRoom> findAdminRoomsByUser(int id);
}
