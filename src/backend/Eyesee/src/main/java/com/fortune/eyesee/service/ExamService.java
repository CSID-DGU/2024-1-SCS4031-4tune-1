package com.fortune.eyesee.service;

import com.fortune.eyesee.common.exception.BaseException;
import com.fortune.eyesee.common.response.BaseResponseCode;
import com.fortune.eyesee.dto.*;
import com.fortune.eyesee.entity.*;
import com.fortune.eyesee.enums.CheatingTypeEnum;
import com.fortune.eyesee.enums.ExamStatus;
import com.fortune.eyesee.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ExamService {

    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final CheatingStatisticsRepository cheatingStatisticsRepository;
    private final VideoRecordingRepository videoRecordingRepository;
    private final DetectedCheatingRepository detectedCheatingRepository;
    private final CheatingTypeRepository cheatingTypeRepository;
    private final AdminRepository adminRepository;



    @Autowired
    public ExamService(ExamRepository examRepository,
                       UserRepository userRepository,
                       SessionRepository sessionRepository,
                       CheatingStatisticsRepository cheatingStatisticsRepository,
                       VideoRecordingRepository videoRecordingRepository,
                       DetectedCheatingRepository detectedCheatingRepository,
                       CheatingTypeRepository cheatingTypeRepository,
                       AdminRepository adminRepository) {
        this.examRepository = examRepository;
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.cheatingStatisticsRepository = cheatingStatisticsRepository;
        this.videoRecordingRepository = videoRecordingRepository;
        this.detectedCheatingRepository = detectedCheatingRepository;
        this.cheatingTypeRepository = cheatingTypeRepository;
        this.adminRepository = adminRepository;
    }

    @Scheduled(cron = "0 0/10 * * * *") // 10분마다 실행
    public void updateExamStatuses() {
        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();

        // 필터링된 시험만 가져오기
        List<Exam> activeExams = examRepository.findActiveExams(currentDate, currentTime);
        LocalDateTime now = LocalDateTime.now();

        for (Exam exam : activeExams) {
            LocalDateTime examStartDateTime = LocalDateTime.of(exam.getExamDate(), exam.getExamStartTime());
            LocalDateTime examEndDateTime = examStartDateTime.plusMinutes(exam.getExamDuration());

            if (now.isBefore(examStartDateTime)) {
                exam.setExamStatus(ExamStatus.BEFORE);
            } else if (now.isAfter(examEndDateTime)) {
                exam.setExamStatus(ExamStatus.DONE);
            } else {
                exam.setExamStatus(ExamStatus.IN_PROGRESS);
            }
        }

        examRepository.saveAll(activeExams); // 상태 변경된 시험만 저장
    }

    // 시험 등록 메서드
    public ExamResponseDTO registerExam(Integer adminId, ExamRequestDTO examRequestDTO) {
        // Admin 인증 확인
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new BaseException(BaseResponseCode.UNAUTHORIZED));

        // 10자리 랜덤 영숫자 코드 생성
        String examRandomCode = RandomStringUtils.randomAlphanumeric(10);

        // Exam 생성
        Exam exam = new Exam();
        exam.setAdmin(admin);
        exam.setExamName(examRequestDTO.getExamName());
        exam.setExamSemester(examRequestDTO.getExamSemester());
        exam.setExamStudentNumber(examRequestDTO.getExamStudentNumber());
        exam.setExamLocation(examRequestDTO.getExamLocation());
        exam.setExamDate(examRequestDTO.getExamDate());
        exam.setExamStartTime(examRequestDTO.getExamStartTime());
        exam.setExamDuration(examRequestDTO.getExamDuration());
        exam.setExamQuestionNumber(examRequestDTO.getExamQuestionNumber());
        exam.setExamTotalScore(examRequestDTO.getExamTotalScore());
        exam.setExamNotice(examRequestDTO.getExamNotice());
        exam.setExamStatus(ExamStatus.BEFORE);
        exam.setExamRandomCode(examRandomCode);

        // 부정행위 유형 저장
        if (examRequestDTO.getCheatingTypes() != null) {
            exam.setCheatingTypes(examRequestDTO.getCheatingTypes());
        }

        // Exam 저장 후 ID 생성
        examRepository.save(exam);

        // ExamId를 사용해 Session 생성 및 설정
        Session session = new Session();
        session.setSessionId(exam.getExamId()); // ExamId와 동일하게 설정
        session.setExam(exam);
        sessionRepository.save(session);

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
                session.getSessionId(),
                exam.getExamRandomCode()
        );
    }

    // 특정 시험 ID로 존재 여부 확인
    public boolean existsById(Integer examId) {
        return examRepository.existsById(examId);
    }

    // Admin ID와 ExamStatus로 시험 목록 조회
//    public List<ExamResponseDTO> getExamsByStatus(Integer adminId, ExamStatus examStatus) {
//        return examRepository.findByAdmin_AdminIdAndExamStatus(adminId, examStatus).stream()
//                .map(exam -> new ExamResponseDTO(
//                        exam.getExamId(),
//                        exam.getExamName(),
//                        exam.getExamSemester(),
//                        exam.getExamStudentNumber(),
//                        exam.getExamLocation(),
//                        exam.getExamDate(),
//                        exam.getExamStartTime(),
//                        exam.getExamDuration(),
//                        exam.getExamStatus(),
//                        exam.getExamNotice(),
//                        exam.getSession() != null ? exam.getSession().getSessionId() : null,
//                        exam.getExamRandomCode()
//                ))
//                .collect(Collectors.toList());
//    }

    // Admin ID 없이 ExamStatus로만 시험 목록 조회
    public List<ExamResponseDTO> getExamsByStatus(Integer adminId, ExamStatus examStatus) {
        if (adminId == null) {
            return examRepository.findByExamStatus(examStatus).stream()
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
        } else {
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
    }



    // ExamCode로 시험 조회
    public ExamInfoResponseDTO getExamByCode(String examCode) {
        Exam exam = examRepository.findByExamRandomCode(examCode);
        if (exam == null) {
            throw new BaseException(BaseResponseCode.NOT_FOUND_EXAM_CODE);
        }
        return new ExamInfoResponseDTO(
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
                examCode,
                exam.getAdmin().getAdminName(),
                exam.getExamQuestionNumber(),
                exam.getExamTotalScore()
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
                        // 부정행위 횟수 합산
                        Integer cheatingCount = cheatingStatisticsRepository.findTotalCheatingCountByUserId(user.getUserId());
                        return new UserListResponseDTO.UserInfo(
                                user.getUserId(),
                                user.getUserName(),
                                user.getUserNum(),
                                user.getSeatNum(),
                                cheatingCount != null ? cheatingCount : 0 // null 처리
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


    public UserDetailResponseDTO getUserDetailByExamIdAndUserId(Integer examId, Integer userId) {
        List<Session> sessions = sessionRepository.findByExam_ExamId(examId);
        if (sessions.isEmpty()) {
            throw new IllegalArgumentException("시험을 찾을 수 없거나 세션이 없습니다");
        }

        Optional<User> userOpt = sessions.stream()
                .map(session -> userRepository.findBySessionAndUserId(session, userId))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .findFirst();

        User user = userOpt.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        List<CheatingStatistic> cheatingStatistics = cheatingStatisticsRepository.findStatisticsByUserId(userId);

//        Map<Integer, CheatingStatistic> mergedStatistics = new HashMap<>();
//
//        for (CheatingStatistic stat : cheatingStatistics) {
//            int statId = stat.getCheatingStatisticsId();
//
//            if (mergedStatistics.containsKey(statId)) {
//                CheatingStatistic existingStat = mergedStatistics.get(statId);
//                existingStat.addDetectedTime(stat.getDetectedTimes().get(0));
//            } else {
//                mergedStatistics.put(statId, new CheatingStatistic(
//                        stat.getCheatingStatisticsId(),
//                        stat.getKoreanTypeName(),
//                        stat.getCheatingCount(),
//                        stat.getDetectedTimes().get(0)
//                ));
//            }
//        }
//
//        List<CheatingStatistic> finalStatistics = new ArrayList<>(mergedStatistics.values());

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
                cheatingVideos,
                user.getSession().getExam().getExamName(),
                user.getSession().getExam().getExamStartTime(),
                user.getSession().getExam().getExamDuration()
        );
    }

    public Map<String, Boolean> getCheatingTypesByExamId(Integer examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new IllegalArgumentException("Exam not found for ID: " + examId));

        // JSON 컬럼에서 부정행위 타입을 가져오기
        List<String> enabledCheatingTypes = exam.getCheatingTypes(); // JSON 컬럼 파싱

        // 활성화된 항목만 포함하는 Map 생성
        Map<String, Boolean> cheatingTypesMap = new HashMap<>();
        for (String type : enabledCheatingTypes) {
            cheatingTypesMap.put(type, true);
        }

        return cheatingTypesMap;
    }
}
