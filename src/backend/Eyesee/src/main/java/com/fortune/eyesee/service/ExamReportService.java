package com.fortune.eyesee.service;

import com.fortune.eyesee.common.exception.BaseException;
import com.fortune.eyesee.common.response.BaseResponseCode;
import com.fortune.eyesee.dto.ExamReportResponseDTO;
import com.fortune.eyesee.entity.*;
import com.fortune.eyesee.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExamReportService {

    @Autowired
    private DetectedCheatingRepository detectedCheatingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private CheatingTypeRepository cheatingTypeRepository;

    public ExamReportResponseDTO generateExamReport(Integer adminId, Integer sessionId) {

        // Admin 인증 확인
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new BaseException(BaseResponseCode.UNAUTHORIZED));

        // Admin이 생성한 시험인지 확인
        Exam exam = examRepository.findBySession_SessionIdAndAdmin_AdminId(sessionId, admin.getAdminId())
                .orElseThrow(() -> new BaseException(BaseResponseCode.UNAUTHORIZED));

        // 시험의 전체 학생 수 가져오기
        Integer totalStudents = exam.getExamStudentNumber();

        // 1. 부정행위 데이터 조회
        List<DetectedCheating> detectedCheatings = detectedCheatingRepository.findBySessionId(sessionId);

        // 2. 총 부정행위 횟수
        int totalCheatingCount = detectedCheatings.size();

        // 3. 부정행위 탐지된 학생 수
        int cheatingStudentsCount = detectedCheatingRepository.countDistinctUsersBySessionId(sessionId);

        // 4. 평균 부정행위 횟수
        double averageCheatingCount = totalCheatingCount / (double) cheatingStudentsCount;

        // 5. 최다 부정행위 탐지 학생
        Map<Integer, Long> userCheatingCounts = detectedCheatings.stream()
                .collect(Collectors.groupingBy(DetectedCheating::getUserId, Collectors.counting()));
        Map.Entry<Integer, Long> maxCheatingEntry = userCheatingCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(null);

        String maxCheatingStudent = "N/A";
        if (maxCheatingEntry != null) {
            Integer maxUserId = maxCheatingEntry.getKey();
            User maxUser = userRepository.findById(maxUserId).orElse(null);
            if (maxUser != null) {
                maxCheatingStudent = "학번: " + maxUser.getUserNum() + ", 횟수: " + maxCheatingEntry.getValue();
            }
        }

        // 6. 부정행위 탐지율
        double cheatingRate = (cheatingStudentsCount / (double) totalStudents) * 100;

        // 7. 부정행위 유형별 통계
        Map<String, Integer> cheatingTypeStatistics = detectedCheatings.stream()
                .collect(Collectors.groupingBy(dc -> {
                    CheatingType cheatingType = cheatingTypeRepository.findByCheatingTypeId(dc.getCheatingTypeId())
                            .orElseThrow(() -> new BaseException(BaseResponseCode.NOT_FOUND_DATA));
                    return cheatingType.getKoreanTypeName();
                }, Collectors.summingInt(e -> 1)));

        // 8. 부정행위 발생 시간대 분석
        Map<LocalTime, Long> timeFrequency = detectedCheatings.stream()
                .collect(Collectors.groupingBy(dc -> dc.getDetectedTime().withMinute(0).withSecond(0).withNano(0),
                        Collectors.counting()));
        LocalTime peakTime = timeFrequency.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
        String peakCheatingTimeRange = peakTime != null
                ? peakTime + " ~ " + peakTime.plusMinutes(30)
                : "N/A";


        ExamReportResponseDTO report = new ExamReportResponseDTO();

        report.setExamName(exam.getExamName());
        report.setTotalCheatingCount(totalCheatingCount);
        report.setCheatingStudentsCount(cheatingStudentsCount);
        report.setAverageCheatingCount(averageCheatingCount);
        report.setMaxCheatingStudent(maxCheatingStudent);
        report.setCheatingRate(cheatingRate);
        report.setCheatingTypeStatistics(cheatingTypeStatistics);
        report.setPeakCheatingTimeRange(peakCheatingTimeRange);

        return report;
    }
}
