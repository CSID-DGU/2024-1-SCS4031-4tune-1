package com.fortune.eyesee.repository;


import com.fortune.eyesee.dto.CheatingStatistic;
import com.fortune.eyesee.dto.UserDetailResponseDTO;
import com.fortune.eyesee.entity.CheatingStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CheatingStatisticsRepository extends JpaRepository<CheatingStatistics, Integer> {
    List<CheatingStatistics> findByUserId(Integer userId);

    //int countByUserId(Integer userId);
    // 특정 userId와 cheatingTypeId에 대한 통계 정보를 조회
    CheatingStatistics findByUserIdAndCheatingTypeId(Integer userId, Integer cheatingTypeId);

    @Query("""
    SELECT new com.fortune.eyesee.dto.CheatingStatistic(
        cs.cheatingStatisticsId,
        ct.koreanTypeName,
        cs.cheatingCount,
        CAST(dc.detectedTime AS string)
    )
    FROM CheatingStatistics cs
    JOIN CheatingType ct ON cs.cheatingTypeId = ct.cheatingTypeId
    LEFT JOIN DetectedCheating dc ON cs.userId = dc.userId AND cs.cheatingTypeId = dc.cheatingTypeId
    WHERE cs.userId = :userId
    ORDER BY CAST(dc.detectedTime AS string) ASC
    """)
    List<CheatingStatistic> findStatisticsByUserId(@Param("userId") Integer userId);

    // 특정 사용자 ID의 부정행위 횟수를 합산
    @Query("SELECT SUM(cs.cheatingCount) FROM CheatingStatistics cs WHERE cs.userId = :userId")
    Integer findTotalCheatingCountByUserId(@Param("userId") Integer userId);
}