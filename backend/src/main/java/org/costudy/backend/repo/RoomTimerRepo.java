package org.costudy.backend.repo;

import org.costudy.backend.model.RoomTimer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomTimerRepo extends JpaRepository<RoomTimer, Integer> {
}
