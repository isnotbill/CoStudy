package org.costudy.backend.service;

import org.costudy.backend.dto.TimerDto;
import org.costudy.backend.model.Settings;
import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.model.timer.RoomTimer;
import org.costudy.backend.model.timer.TimerPhase;
import org.costudy.backend.model.timer.TimerStatus;
import org.costudy.backend.repo.RoomTimerRepo;
import org.costudy.backend.repo.SettingsRepo;
import org.costudy.backend.repo.StudyRoomRepo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.*;


@Service
public class TimerService {

    private final RoomTimerRepo timerRepo;
    private final SimpMessagingTemplate tpl;
    private final StudyRoomRepo studyRoomRepo;
    private final SettingsRepo settingsRepo;

    private final ScheduledExecutorService exec =
            Executors.newScheduledThreadPool(4);

    private final Map<Integer, ScheduledFuture<?>> tasks = new ConcurrentHashMap<>();

    public TimerService(RoomTimerRepo timerRepo, SimpMessagingTemplate tpl, StudyRoomRepo studyRoomRepo, SettingsRepo settingsRepo) {
        this.timerRepo = timerRepo;
        this.tpl = tpl;
        this.studyRoomRepo = studyRoomRepo;
        this.settingsRepo = settingsRepo;
    }


    public TimerDto start(Integer roomId) {
        Optional<RoomTimer> tCheck = timerRepo.findByRoomRoomId(roomId);
        Settings roomSettings = settingsRepo.findByStudyRoomRoomId(roomId);
        if (tCheck.isEmpty()) {throw new RuntimeException("No timer created yet");}

        RoomTimer t = tCheck.get();


        t.setPhase(TimerPhase.WORK);
        t.setStatus(TimerStatus.PAUSED);
        t.setDurationMs(roomSettings.getStudyTimeMs());
        t.setStartedAt(Instant.now());
        t.setWorkCyclesDone(0);
        timerRepo.save(t);

        schedule(roomId, roomSettings.getStudyTimeMs());
        broadcast(roomId, t);

        return TimerDto.from(t);

    }

    public RoomTimer create(int roomId){
        Optional<RoomTimer> checkTimer = timerRepo.findByRoomRoomId(roomId);
        Settings roomSettings = settingsRepo.findByStudyRoomRoomId(roomId);
        if(checkTimer.isPresent()){
            return checkTimer.get();
        }

        StudyRoom room = studyRoomRepo.findByRoomId(roomId);

        RoomTimer t = new RoomTimer();
        t.setRoom(room);
        t.setPhase(TimerPhase.WORK);
        t.setStatus(TimerStatus.PAUSED);
        t.setDurationMs(roomSettings.getStudyTimeMs());
        t.setWorkCyclesDone(0);
        return timerRepo.save(t);

    }

    public TimerDto pause(int roomId) {
        RoomTimer t = must(roomId);

        if (t.getStatus() == TimerStatus.PAUSED) {
            return TimerDto.from(t);
        }

        t.setStatus(TimerStatus.PAUSED);
        t.setDurationMs(remaining(t));
        t.setStartedAt(null);
        timerRepo.save(t);

        cancel(roomId);
        broadcast(roomId, t);
        return TimerDto.from(t);

    }


    public TimerDto resume(int roomId) {
        RoomTimer t = must(roomId);
        if (t.getStatus() == TimerStatus.RUNNING){
            return TimerDto.from(t);
        }

        t.setStartedAt(Instant.now());
        t.setStatus(TimerStatus.RUNNING);
        t.setDurationMs(remaining(t));
        timerRepo.save(t);

        schedule(roomId, t.getDurationMs());
        broadcast(roomId, t);
        return TimerDto.from(t);
    }

    public TimerDto status(int roomId){
        return TimerDto.from(must(roomId));

    }

    public TimerDto skipTo(Integer roomId, TimerPhase skipToPhase) {
        Settings roomSettings = settingsRepo.findByStudyRoomRoomId(roomId);
        RoomTimer t = must(roomId);
        if (t.getPhase() == skipToPhase){return TimerDto.from(t);}

        cancel(roomId);
        t.setStatus(TimerStatus.PAUSED);
        t.setPhase(skipToPhase);

        switch(skipToPhase){
            case WORK:
                if (t.getWorkCyclesDone() + 1 > roomSettings.getCyclesTillLongBreak())
                {
                    t.setWorkCyclesDone(0);
                }
                t.setDurationMs(roomSettings.getStudyTimeMs());
                break;
            case SHORT_BREAK:
                t.setDurationMs(roomSettings.getShortBreakTimeMs());
                if (t.getWorkCyclesDone() + 1 > roomSettings.getCyclesTillLongBreak())
                {
                    t.setPhase(TimerPhase.LONG_BREAK);
                    t.setDurationMs(roomSettings.getLongBreakTimeMs());
                    t.setWorkCyclesDone(roomSettings.getCyclesTillLongBreak());
                    break;
                }
                t.setWorkCyclesDone(t.getWorkCyclesDone() + 1);
                break;
            case LONG_BREAK:
                t.setDurationMs(roomSettings.getLongBreakTimeMs());
                t.setWorkCyclesDone(0);
                break;
            default:
                throw new IllegalArgumentException("Unknown skipToPhase: " + skipToPhase);
        }
        timerRepo.save(t);
        broadcast(roomId, t);

        return TimerDto.from(t);
    }

    // Internal



    private Long remaining(RoomTimer t){
        return Math.max(0, t.getDurationMs() - Duration.between(t.getStartedAt(), Instant.now()).toMillis());
    }

    private void schedule(Integer roomId, long delay) {
        cancel(roomId);
        tasks.put(roomId, exec.schedule(() -> autoAdvance(roomId
        ), delay, TimeUnit.MILLISECONDS));

    }

    private void cancel(int roomId){
        Optional.ofNullable(tasks.remove(roomId)).ifPresent(f -> f.cancel(false));

    }

    private void autoAdvance(int roomId){
        RoomTimer t = must(roomId);
        Settings roomSettings = settingsRepo.findByStudyRoomRoomId(roomId);

        if (t.getPhase() == TimerPhase.WORK) {
            t.setWorkCyclesDone(t.getWorkCyclesDone() + 1);
            if (t.getWorkCyclesDone() == roomSettings.getCyclesTillLongBreak()){
                t.setPhase(TimerPhase.LONG_BREAK);
                t.setDurationMs(roomSettings.getLongBreakTimeMs());
                t.setWorkCyclesDone(0);
            } else {
                t.setPhase(TimerPhase.SHORT_BREAK);
                t.setDurationMs(roomSettings.getShortBreakTimeMs());
            }
        } else {
            t.setPhase(TimerPhase.WORK);
            t.setDurationMs(roomSettings.getStudyTimeMs());
        }

        t.setStartedAt(null);
        t.setStatus(TimerStatus.PAUSED);
        timerRepo.save(t);
        cancel(roomId);
        broadcast(roomId, t);

    }

    private void broadcast(int roomId, RoomTimer t) {
        tpl.convertAndSend("/topic/room/" + roomId + "/timer", TimerDto.from(t));
    }

    private RoomTimer must(int roomId){
        return timerRepo.findByRoomRoomId(roomId)
                .orElseThrow(() -> new IllegalStateException("Timer missing for room " + roomId));
    }



}
