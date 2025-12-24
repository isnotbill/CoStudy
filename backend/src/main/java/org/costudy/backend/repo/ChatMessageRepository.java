package org.costudy.backend.repo;

import org.costudy.backend.model.ChatMessage;
import org.costudy.backend.model.StudyRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> getChatMessageByStudyRoomOrderBySentAtAsc(StudyRoom studyRoom);
}
