package org.costudy.backend.repo;

import org.costudy.backend.model.ChatMessage;
import org.costudy.backend.model.StudyRoom;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> getChatMessageByStudyRoomOrderBySentAtAsc(StudyRoom studyRoom);

    @Query("SELECT m FROM ChatMessage m WHERE m.studyRoom = :room ORDER BY m.sentAt DESC")
    List<ChatMessage> findRecent(@Param("room") StudyRoom room, Pageable pageable);

    @Query("SELECT m FROM ChatMessage m WHERE m.studyRoom = :room AND m.chatMessageId < :before ORDER BY m.sentAt DESC")
    List<ChatMessage> findBefore(@Param("room") StudyRoom room, @Param("before") int before, Pageable pageable);
}
