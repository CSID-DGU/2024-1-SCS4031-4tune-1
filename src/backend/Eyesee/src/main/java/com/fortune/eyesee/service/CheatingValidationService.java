package com.fortune.eyesee.service;

import com.fortune.eyesee.entity.DetectedCheating;
import com.fortune.eyesee.repository.DetectedCheatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class CheatingValidationService {

    @Autowired
    private DetectedCheatingRepository detectedCheatingRepository;

    /**
     * 기존 부정행위 횟수를 조회
     */
    public Integer getExistingCheatingCount(Integer userId, Integer sessionId, Integer cheatingTypeId) {
        return detectedCheatingRepository.findCheatingCountByUserIdAndSessionIdAndCheatingTypeId(
                userId, sessionId, cheatingTypeId
        );
    }

    /**
     * 새로운 부정행위 기록을 저장
     */
    public void saveNewCheatingRecord(Integer userId, Integer sessionId, Integer cheatingTypeId, LocalDateTime detectedTime) {
        DetectedCheating newCheating = new DetectedCheating();
        newCheating.setUserId(userId);
        newCheating.setSessionId(sessionId);
        newCheating.setCheatingTypeId(cheatingTypeId);
        newCheating.setDetectedTime(detectedTime);

        detectedCheatingRepository.save(newCheating);
    }
}