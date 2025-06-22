package org.costudy.backend.repo;

import org.costudy.backend.model.timer.RoomTimer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomTimerRepo extends JpaRepository<RoomTimer, Integer> {
    Optional<RoomTimer> findByRoomRoomId(int roomId);
}
