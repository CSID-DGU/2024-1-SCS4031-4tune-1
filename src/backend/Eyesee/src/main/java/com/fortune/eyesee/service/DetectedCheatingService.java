package com.fortune.eyesee.service;

import com.fortune.eyesee.common.exception.BaseException;
import com.fortune.eyesee.common.response.BaseResponseCode;
import com.fortune.eyesee.dto.CheatingResponseDTO;
import com.fortune.eyesee.entity.DetectedCheating;
import com.fortune.eyesee.entity.CheatingStatistics;
import com.fortune.eyesee.repository.DetectedCheatingRepository;
import com.fortune.eyesee.repository.CheatingStatisticsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DetectedCheatingService {

    private final DetectedCheatingRepository detectedCheatingRepository;
    private final CheatingStatisticsRepository cheatingStatisticsRepository;
    private final SessionCacheService sessionCacheService;

    public DetectedCheatingService(DetectedCheatingRepository detectedCheatingRepository,
                                   CheatingStatisticsRepository cheatingStatisticsRepository, SessionCacheService sessionCacheService) {
        this.detectedCheatingRepository = detectedCheatingRepository;
        this.cheatingStatisticsRepository = cheatingStatisticsRepository;
        this.sessionCacheService = sessionCacheService;
    }

    public List<DetectedCheating> saveCheating(CheatingResponseDTO cheatingResponseDTO) {
        List<DetectedCheating> detectedCheatings = new ArrayList<>();
        Integer userId = Integer.parseInt(cheatingResponseDTO.getUserId());

        // Redis에서 세션 ID 조회
        Integer sessionId = null;
        try {
            sessionId = sessionCacheService.getSessionId(userId);
        } catch (Exception e) {
            // Redis 장애 시 Graceful Fallback
            System.err.println("Redis failure: " + e.getMessage());
        }
        if (sessionId == null) {
            throw new BaseException(BaseResponseCode.NOT_FOUND_SESSION);
        }

        Integer finalSessionId = sessionId;

        // 부정행위 타입 및 세션ID가 있는지 확인
        cheatingResponseDTO.getCheatingCounts().forEach((cheatingType, count) -> {
            if (count > 0) {
                Integer cheatingTypeId = mapCheatingType(cheatingType);

                // 해당 부정행위 종류에 대한 카운트 조회
                CheatingStatistics existingStat = cheatingStatisticsRepository
                        .findByUserIdAndCheatingTypeId(userId, cheatingTypeId);

                // 기존 카운트가 없다면, 새로운 카운트로 저장
                if (existingStat == null || existingStat.getCheatingCount() < count) {
                    // 새로운 DetectedCheating 기록 저장
                    DetectedCheating detectedCheating = new DetectedCheating();
                    detectedCheating.setUserId(userId);
                    detectedCheating.setSessionId(finalSessionId);  // 세션 ID 추가
                    detectedCheating.setCheatingTypeId(cheatingTypeId);
                    detectedCheating.setDetectedTime(LocalTime.from(cheatingResponseDTO.getTimestamp()));
                    detectedCheatings.add(detectedCheatingRepository.save(detectedCheating));

                    // CheatingStatistics 갱신
                    if (existingStat != null) {
                        existingStat.setCheatingCount(count);  // 기존 카운트 갱신
                        cheatingStatisticsRepository.save(existingStat);
                    } else {
                        // 새로 추가해야 할 경우
                        CheatingStatistics newStat = new CheatingStatistics();
                        newStat.setUserId(userId);
                        newStat.setCheatingTypeId(cheatingTypeId);
                        newStat.setCheatingCount(count);
                        cheatingStatisticsRepository.save(newStat);
                    }
                }
            }
        });

        return detectedCheatings;
    }

    private Integer mapCheatingType(String cheatingType) {
        switch (cheatingType) {
            case "look_around": return 1;
            case "repeated_gaze": return 2;
            case "object": return 3;
            case "face_absence_long": return 4;
            case "face_absence_repeat": return 5;
            case "hand_gesture": return 6;
            case "head_turn_long": return 7;
            case "head_turn_repeat": return 8;
            case "eye_movement": return 9;
            default: throw new BaseException(BaseResponseCode.NOT_FOUND_CHEATING_TYPE);
        }
    }
}