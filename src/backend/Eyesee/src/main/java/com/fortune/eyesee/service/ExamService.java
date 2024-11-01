package com.fortune.eyesee.service;

import com.fortune.eyesee.dto.UserDetailResponseDTO;
import com.fortune.eyesee.dto.UserListResponseDTO;
import com.fortune.eyesee.entity.*;
import com.fortune.eyesee.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExamService {

    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final CheatingStatisticsRepository cheatingStatisticsRepository;
    private final VideoRecordingRepository videoRecordingRepository;
    private final DetectedCheatingRepository detectedCheatingRepository;
    private final CheatingTypeRepository cheatingTypeRepository;

    @Autowired
    public ExamService(ExamRepository examRepository,
                       UserRepository userRepository,
                       SessionRepository sessionRepository,
                       CheatingStatisticsRepository cheatingStatisticsRepository,
                       VideoRecordingRepository videoRecordingRepository,
                       DetectedCheatingRepository detectedCheatingRepository,
                       CheatingTypeRepository cheatingTypeRepository) {
        this.examRepository = examRepository;
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.cheatingStatisticsRepository = cheatingStatisticsRepository;
        this.videoRecordingRepository = videoRecordingRepository;
        this.detectedCheatingRepository = detectedCheatingRepository;
        this.cheatingTypeRepository = cheatingTypeRepository;
    }

    // 특정 ExamId로 사용자 리스트 조회
    public UserListResponseDTO getUserListByExamId(Integer examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new IllegalArgumentException("시험을 찾을 수 없습니다"));

        List<UserListResponseDTO.UserInfo> users = new ArrayList<>();

        // ExamId에 해당하는 모든 Session을 가져오기
        List<Session> sessions = sessionRepository.findByExamId(examId);
        for (Session session : sessions) {
            // 각 Session으로 모든 User를 가져오기
            List<User> sessionUsers = userRepository.findBySession(session);
            List<UserListResponseDTO.UserInfo> sessionUserInfo = sessionUsers.stream()
                    .map(user -> {
                        int cheatingCount = cheatingStatisticsRepository.countByUserId(user.getUserId());
                        return new UserListResponseDTO.UserInfo(
                                user.getUserId(),
                                user.getUserName(),
                                user.getUserNum(),
                                user.getSeatNum(),
                                cheatingCount
                        );
                    })
                    .collect(Collectors.toList());
            users.addAll(sessionUserInfo);
        }

        return new UserListResponseDTO(
                exam.getExamName(),
                exam.getExamStudentNumber(),
                exam.getExamDuration(),
                users
        );
    }

    // 특정 ExamId와 UserId로 User 상세 정보 조회
    public UserDetailResponseDTO getUserDetailByExamIdAndUserId(Integer examId, Integer userId) {
        List<Session> sessions = sessionRepository.findByExamId(examId);
        if (sessions.isEmpty()) {
            throw new IllegalArgumentException("시험을 찾을 수 없거나 세션이 없습니다");
        }

        Optional<User> userOpt = sessions.stream()
                .map(session -> userRepository.findBySessionAndUserId(session, userId))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .findFirst();

        User user = userOpt.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        // 부정행위 통계 리스트 생성
        List<UserDetailResponseDTO.CheatingStatistic> cheatingStatistics = cheatingStatisticsRepository.findByUserId(userId).stream()
                .map(stat -> {
                    String cheatingTypeName = cheatingTypeRepository.findById(stat.getCheatingTypeId())
                            .map(CheatingType::getCheatingTypeName)
                            .orElse("알 수 없음");

                    return new UserDetailResponseDTO.CheatingStatistic(
                            stat.getCheatingStatisticsId(),
                            cheatingTypeName,
                            stat.getCheatingCount(),
                            detectedCheatingRepository.findByUserIdAndCheatingTypeId(userId, stat.getCheatingTypeId())
                                    .map(detected -> detected.getDetectedTime() != null ? detected.getDetectedTime().toString() : null)
                                    .orElse(null)
                    );
                })
                .collect(Collectors.toList());

        // 부정행위 비디오 리스트 생성
        List<UserDetailResponseDTO.CheatingVideo> cheatingVideos = videoRecordingRepository.findByUserId(userId).stream()
                .map(video -> new UserDetailResponseDTO.CheatingVideo(
                        video.getVideoId(),
                        video.getStartTime().toString(),
                        video.getEndTime().toString(),
                        video.getFilePath()
                ))
                .collect(Collectors.toList());

        return new UserDetailResponseDTO(
                user.getUserId(),
                user.getUserName(),
                user.getUserNum(),
                user.getSeatNum(),
                cheatingStatistics,
                cheatingVideos
        );
    }
}
