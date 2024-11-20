package com.fortune.eyesee.service;

import com.fortune.eyesee.entity.Session;
import com.fortune.eyesee.entity.User;
import com.fortune.eyesee.repository.UserRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class SessionCacheService {
    private final RedisTemplate<String, Integer> redisTemplate;
    private final UserRepository userRepository;
    private static final Duration CACHE_EXPIRATION = Duration.ofMinutes(30); // 30분 만료 시간

    public SessionCacheService(RedisTemplate<String, Integer> redisTemplate, UserRepository userRepository) {
        this.redisTemplate = redisTemplate;
        this.userRepository = userRepository;
    }

    public Integer getSessionId(Integer userId) {
        String key = buildKey(userId);
        ValueOperations<String, Integer> valueOps = redisTemplate.opsForValue();

        // Redis에서 세션 ID 조회
        Integer sessionId = valueOps.get(key);
        if (sessionId != null) {
            return sessionId; // 캐시된 데이터 반환
        }

        // Redis에 없으면 DB에서 조회
        sessionId = fetchFromDatabase(userId);
        if (sessionId != null) {
            valueOps.set(key, sessionId, CACHE_EXPIRATION); // Redis에 저장
        }

        return sessionId;
    }

    private Integer fetchFromDatabase(Integer userId) {
        // 데이터베이스에서 userId를 기반으로 sessionId를 조회
        User user = userRepository.findByUserId(userId);
        if (user != null && user.getSession() != null) {
            return user.getSession().getSessionId(); // 세션 ID 반환
        }
        return null; // 세션이 없는 경우 null 반환
    }

    public void invalidate(Integer userId) {
        String key = buildKey(userId);
        redisTemplate.delete(key); // Redis에서 삭제
    }

    private String buildKey(Integer userId) {
        return "session:user:" + userId;
    }
}