package com.fortune.eyesee.service;

import com.fortune.eyesee.common.exception.BaseException;
import com.fortune.eyesee.common.response.BaseResponseCode;
import com.fortune.eyesee.dto.ExamResponseDTO;
import com.fortune.eyesee.dto.UserDetailResponseDTO;
import com.fortune.eyesee.dto.UserListResponseDTO;
import com.fortune.eyesee.entity.*;
import com.fortune.eyesee.enums.ExamStatus;
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

    // 특정 시험 ID로 존재 여부 확인
    public boolean existsById(Integer examId) {
        return examRepository.existsById(examId);
    }

    // Admin ID와 ExamStatus로 시험 목록 조회
    public List<ExamResponseDTO> getExamsByStatus(Integer adminId, ExamStatus examStatus) {
        return examRepository.findByAdmin_AdminIdAndExamStatus(adminId, examStatus).stream()
                .map(exam -> new ExamResponseDTO(
                        exam.getExamId(),
                        exam.getExamName(),
                        exam.getExamSemester(),
                        exam.getExamStudentNumber(),
                        exam.getExamLocation(),
                        exam.getExamDate(),
                        exam.getExamStartTime(),
                        exam.getExamDuration(),
                        exam.getExamStatus(),
                        exam.getExamNotice(),
                        exam.getSession() != null ? exam.getSession().getSessionId() : null,
                        exam.getExamRandomCode()
                ))
                .collect(Collectors.toList());
    }

    // ExamCode로 시험 조회
    public ExamResponseDTO getExamByCode(String examCode) {
        Exam exam = examRepository.findByExamRandomCode(examCode);
        if (exam == null) {
            throw new BaseException(BaseResponseCode.NOT_FOUND_EXAM_CODE);
        }
        return new ExamResponseDTO(
                exam.getExamId(),
                exam.getExamName(),
                exam.getExamSemester(),
                exam.getExamStudentNumber(),
                exam.getExamLocation(),
                exam.getExamDate(),
                exam.getExamStartTime(),
                exam.getExamDuration(),
                exam.getExamStatus(),
                exam.getExamNotice(),
                exam.getSession() != null ? exam.getSession().getSessionId() : null,
                examCode
        );
    }

    // 특정 Exam ID로 사용자 리스트 조회
    public UserListResponseDTO getUserListByExamId(Integer examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new IllegalArgumentException("시험을 찾을 수 없습니다"));

        List<UserListResponseDTO.UserInfo> users = new ArrayList<>();
        List<Session> sessions = sessionRepository.findByExam_ExamId(examId); // 수정된 부분
        for (Session session : sessions) {
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


    // 특정 Exam ID와 User ID로 User 상세 정보 조회
    public UserDetailResponseDTO getUserDetailByExamIdAndUserId(Integer examId, Integer userId) {
        List<Session> sessions = sessionRepository.findByExam_ExamId(examId); // 수정된 부분
        if (sessions.isEmpty()) {
            throw new IllegalArgumentException("시험을 찾을 수 없거나 세션이 없습니다");
        }

        Optional<User> userOpt = sessions.stream()
                .map(session -> userRepository.findBySessionAndUserId(session, userId))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .findFirst();

        User user = userOpt.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));


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
