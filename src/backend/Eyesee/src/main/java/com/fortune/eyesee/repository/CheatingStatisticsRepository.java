package com.fortune.eyesee.repository;


import com.fortune.eyesee.entity.CheatingStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CheatingStatisticsRepository extends JpaRepository<CheatingStatistics, Integer> {
    List<CheatingStatistics> findByUserId(Integer userId);
    int countByUserId(Integer userId);
}