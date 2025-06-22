package org.costudy.backend.repo;

import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.model.timer.RoomTimer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudyRoomRepo extends JpaRepository<StudyRoom, Integer> {
    StudyRoom findByCode(String code);
    StudyRoom findByRoomId(int roomId);

    boolean existsByCode(String code);
}
