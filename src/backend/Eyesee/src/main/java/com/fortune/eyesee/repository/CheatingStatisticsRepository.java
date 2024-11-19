package com.fortune.eyesee.repository;


import com.fortune.eyesee.entity.CheatingStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CheatingStatisticsRepository extends JpaRepository<CheatingStatistics, Integer> {
    List<CheatingStatistics> findByUserId(Integer userId);
    int countByUserId(Integer userId);
    // 특정 userId와 cheatingTypeId에 대한 통계 정보를 조회
    CheatingStatistics findByUserIdAndCheatingTypeId(Integer userId, Integer cheatingTypeId);
}