package org.costudy.backend.repo;

import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.model.User;
import org.costudy.backend.model.UserStudyRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserStudyRoomRepo extends JpaRepository<UserStudyRoom, Integer> {
    List<UserStudyRoom> findByUser(User user);
    List<UserStudyRoom> findByStudyRoom(StudyRoom studyRoom);
    Optional<UserStudyRoom> findByIdUserIdAndIdRoomId(int userId, int roomId);

    @Query("SELECT u FROM UserStudyRoom u WHERE u.user = :user AND u.hasLeft = false")
    List<UserStudyRoom> findActiveByUser(@Param("user") User user);

    @Query("SELECT u FROM UserStudyRoom u WHERE u.studyRoom = :studyRoom AND u.hasLeft = false")
    List<UserStudyRoom> findActiveByStudyRoom(@Param("studyRoom") StudyRoom studyRoom);

    @Query("SELECT COUNT(u) FROM UserStudyRoom u WHERE u.user = :user AND u.hasLeft = false")
    int countActiveByUser(@Param("user") User user);

    int countByStudyRoom(StudyRoom room);
    int countByUser(User user);
    int countByStudyRoomAndHasLeftFalse(StudyRoom room);

    @Query("""
           SELECT usr.studyRoom FROM UserStudyRoom usr WHERE usr.user.id = :id AND usr.isAdmin = true
           """)
    List<StudyRoom> findAdminRoomsByUser(int id);
}
