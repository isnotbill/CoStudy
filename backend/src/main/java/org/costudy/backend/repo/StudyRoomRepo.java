package org.costudy.backend.repo;

import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.model.timer.RoomTimer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StudyRoomRepo extends JpaRepository<StudyRoom, Integer> {
    StudyRoom findByCode(String code);
    StudyRoom findByRoomId(int roomId);

    boolean existsByCode(String code);
    Page<StudyRoom> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    @Query("""
            SELECT r FROM StudyRoom r
            JOIN r.settings s
            WHERE s.isPublic = true
            AND LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    Page<StudyRoom> findPublicRooms(@Param("keyword") String keyword, Pageable pageable);


    @Query("""
    SELECT r FROM StudyRoom r
    JOIN r.settings s
    WHERE s.isPublic = true
      AND LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
      AND NOT EXISTS (
          SELECT 1 FROM UserStudyRoom usr
          WHERE usr.studyRoom = r
            AND usr.user.username = :username
            AND usr.hasLeft = false
      )
""")
    Page<StudyRoom> findPublicRoomsExcludingUser(
            @Param("keyword") String keyword,
            @Param("username") String username,
            Pageable pageable
    );

    StudyRoom getStudyRoomByRoomId(int roomId);
}
