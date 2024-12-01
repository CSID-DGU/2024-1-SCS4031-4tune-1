package com.fortune.eyesee.repository;


import com.fortune.eyesee.entity.DetectedCheating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DetectedCheatingRepository extends JpaRepository<DetectedCheating, Integer> {
    Optional<DetectedCheating> findByUserIdAndCheatingTypeId(Integer userId, Integer cheatingTypeId);

    // 시험 ID로 부정행위 데이터 조회
    @Query("SELECT dc FROM DetectedCheating dc WHERE dc.sessionId = :sessionId")
    List<DetectedCheating> findBySessionId(@Param("sessionId") Integer sessionId);

    // 시험에 참여한 학생 수 조회
    @Query("SELECT COUNT(DISTINCT dc.userId) FROM DetectedCheating dc WHERE dc.sessionId = :sessionId")
    Integer countDistinctUsersBySessionId(@Param("sessionId") Integer sessionId);

    int countByUserIdAndSessionId(Integer userId, Integer sessionId);
}