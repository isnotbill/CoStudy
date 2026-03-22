package org.costudy.backend.service;

import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class PresenceRegistry {

    // roomId → set of online userIds
    private final Map<Integer, Set<Integer>> roomOnline = new ConcurrentHashMap<>();

    // sessionId → [roomId, userId]
    private final Map<String, int[]> sessionMap = new ConcurrentHashMap<>();

    /** Mark a user online in a room. Returns the updated online set for that room. */
    public Set<Integer> userJoined(String sessionId, int roomId, int userId) {
        sessionMap.put(sessionId, new int[]{roomId, userId});
        roomOnline.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(userId);
        return Collections.unmodifiableSet(roomOnline.get(roomId));
    }

    /**
     * Remove a user by session. Returns int[]{roomId, userId} if the session was known,
     * or null if the session was never registered (e.g. user never joined a room).
     */
    public int[] userLeft(String sessionId) {
        int[] entry = sessionMap.remove(sessionId);
        if (entry == null) return null;
        int roomId = entry[0];
        int userId = entry[1];
        Set<Integer> set = roomOnline.get(roomId);
        if (set != null) {
            set.remove(userId);
            if (set.isEmpty()) roomOnline.remove(roomId);
        }
        return entry;
    }

    public Set<Integer> getOnlineUsers(int roomId) {
        return roomOnline.getOrDefault(roomId, Collections.emptySet());
    }

    public int getOnlineCount(int roomId) {
        return getOnlineUsers(roomId).size();
    }
}
