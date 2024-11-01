package com.fortune.eyesee.repository;


import com.fortune.eyesee.entity.DetectedCheating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DetectedCheatingRepository extends JpaRepository<DetectedCheating, Integer> {
    Optional<DetectedCheating> findByUserIdAndCheatingTypeId(Integer userId, Integer cheatingTypeId);

}