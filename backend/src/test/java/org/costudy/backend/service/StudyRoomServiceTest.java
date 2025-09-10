package org.costudy.backend.service;

import org.costudy.backend.dto.CreateRoomDto;
import org.costudy.backend.exception.RoomLimitExceededException;
import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.model.User;
import org.costudy.backend.model.UserStudyRoom;
import org.costudy.backend.repo.ChatMessageRepository;
import org.costudy.backend.repo.StudyRoomRepo;
import org.costudy.backend.repo.UserStudyRoomRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StudyRoomServiceTest {
    @InjectMocks
    private StudyRoomService studyRoomService;

    @Mock
    private UserStudyRoomRepo userStudyRoomRepo;

    @Mock
    private StudyRoomRepo studyRoomRepo;

    @Mock
    private ChatMessageRepository chatRepo;

    @Mock
    private SettingsService settingsService;

    @Test
    void createRoomSuccess() {
        User testuser = new User();
        testuser.setId(1);
        testuser.setUsername("testuser");

        CreateRoomDto dto = new CreateRoomDto();
        dto.setName("Test Room");

        when(userStudyRoomRepo.countActiveByUser(testuser)).thenReturn(0);
        when(studyRoomRepo.existsByCode(anyString())).thenReturn(false);

        String code = studyRoomService.createRoom(testuser, dto);

        verify(studyRoomRepo).save(any(StudyRoom.class));
        verify(userStudyRoomRepo).save(any(UserStudyRoom.class));
    }

    @Test
    void createRoomExceedsLimit() {
        User testuser = new User();
        testuser.setId(1);
        testuser.setUsername("testuser");

        CreateRoomDto dto = new CreateRoomDto();

        when(userStudyRoomRepo.countActiveByUser(testuser)).thenReturn(15);

        assertThrows(RoomLimitExceededException.class, () -> {
            studyRoomService.createRoom(testuser, dto);
        });
    }
}
