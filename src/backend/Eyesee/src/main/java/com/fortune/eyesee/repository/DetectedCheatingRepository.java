package com.fortune.eyesee.repository;


import com.fortune.eyesee.entity.DetectedCheating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface DetectedCheatingRepository extends JpaRepository<DetectedCheating, Integer> {
    Optional<DetectedCheating> findByUserIdAndCheatingTypeId(Integer userId, Integer cheatingTypeId);

    // 특정 부정행위가 이미 기록되었는지 확인하는 메서드
    @Query("SELECT COUNT(dc) FROM DetectedCheating dc WHERE dc.userId = :userId AND dc.sessionId = :sessionId AND dc.cheatingTypeId = :cheatingTypeId")
    Integer findCheatingCountByUserIdAndSessionIdAndCheatingTypeId(
            @Param("userId") Integer userId,
            @Param("sessionId") Integer sessionId,
            @Param("cheatingTypeId") Integer cheatingTypeId
    );
    }