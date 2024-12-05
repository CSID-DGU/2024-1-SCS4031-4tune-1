package com.fortune.eyesee.controller;

import com.fortune.eyesee.common.exception.BaseException;
import com.fortune.eyesee.common.response.BaseResponse;
import com.fortune.eyesee.common.response.BaseResponseCode;
import com.fortune.eyesee.dto.*;
import com.fortune.eyesee.entity.Session;
import com.fortune.eyesee.enums.ExamStatus;
import com.fortune.eyesee.repository.SessionRepository;
import com.fortune.eyesee.service.ExamReportService;
import com.fortune.eyesee.service.ExamService;
import com.fortune.eyesee.service.ExcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    @Autowired
    private ExamService examService;

    @Autowired
    private ExamReportService examReportService;

    @Autowired
    private ExcelService excelService;

    @Autowired
    private SessionRepository sessionRepository;

    // "before" 상태의 Exam 리스트 조회
    @GetMapping("/before")
    public ResponseEntity<BaseResponse<List<ExamResponseDTO>>> getBeforeExams() {
        return fetchExamsByStatus(ExamStatus.BEFORE);
    }

    // "in-progress" 상태의 Exam 리스트 조회
    @GetMapping("/in-progress")
    public ResponseEntity<BaseResponse<List<ExamResponseDTO>>> getInProgressExams() {
        return fetchExamsByStatus(ExamStatus.IN_PROGRESS);
    }

    // "done" 상태의 Exam 리스트 조회
    @GetMapping("/done")
    public ResponseEntity<BaseResponse<List<ExamResponseDTO>>> getDoneExams() {
        return fetchExamsByStatus(ExamStatus.DONE);
    }

    // 공통 메서드: 상태별 Exam 조회 (세션 검증 포함)
    private ResponseEntity<BaseResponse<List<ExamResponseDTO>>> fetchExamsByStatus(ExamStatus status) {
        Integer adminId = (Integer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (adminId == null) {
            throw new BaseException(BaseResponseCode.UNAUTHORIZED);
        }

        List<ExamResponseDTO> examList = examService.getExamsByStatus(adminId, status);
        return ResponseEntity.ok(new BaseResponse<>(examList));
    }

    @PostMapping
    public ResponseEntity<BaseResponse<Map<String, String>>> registerExam(@RequestBody ExamRequestDTO examRequestDTO ) {

        // SecurityContextHolder에서 adminId를 가져옴
        Integer adminId = (Integer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        ExamResponseDTO examResponseDTO = examService.registerExam(adminId, examRequestDTO);

        // examRandomCode만 포함된 응답 생성
        Map<String, String> response = new HashMap<>();
        response.put("examRandomCode", examResponseDTO.getExamRandomCode());

        return ResponseEntity.ok(new BaseResponse<>(response, "시험 등록에 성공했습니다."));
    }

    // 특정 시험 ID에 해당하는 세션 내 모든 학생들의 리스트를 조회
    @GetMapping("/{examId}/users")
    public ResponseEntity<BaseResponse<UserListResponseDTO>> getUserListByExamId(@PathVariable Integer examId) {

        // SecurityContextHolder에서 adminId를 가져옴
        Integer adminId = (Integer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Admin 권한 확인
        if (!examService.isAdminAuthorizedForExam(adminId, examId)) {
            throw new BaseException(BaseResponseCode.EXAM_ACCESS_DENIED);
        }

        UserListResponseDTO response = examService.getUserListByExamId(examId);
        return ResponseEntity.ok(new BaseResponse<>(response, "학생 리스트 조회 성공"));
    }

    // 특정 시험 ID와 사용자 ID에 해당하는 학생의 상세 정보를 조회
    @GetMapping("/{examId}/users/{userId}")
    public ResponseEntity<BaseResponse<UserDetailResponseDTO>> getUserDetailByExamIdAndUserId(
            @PathVariable Integer examId,
            @PathVariable Integer userId) {

        // SecurityContextHolder에서 adminId를 가져옴
        Integer adminId = (Integer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Admin 권한 확인
        if (!examService.isAdminAuthorizedForExam(adminId, examId)) {
            throw new BaseException(BaseResponseCode.EXAM_ACCESS_DENIED);
        }

        UserDetailResponseDTO response = examService.getUserDetailByExamIdAndUserId(examId, userId);

        return ResponseEntity.ok(new BaseResponse<>(response, "학생 상세 정보 조회 성공"));
    }

    // 사후 레포트 생성
    @GetMapping("/{sessionId}/report")
    public ResponseEntity<ExamReportResponseDTO> getExamReport(@PathVariable Integer sessionId) {
        // SecurityContextHolder에서 adminId 가져오기
        Integer adminId = (Integer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 레포트 생성
        ExamReportResponseDTO report = examReportService.generateExamReport(adminId, sessionId);
        return ResponseEntity.ok(report);
    }


    // 사후 레포트 엑셀 다운로드
    @GetMapping("/{sessionId}/report/download")
    public ResponseEntity<InputStreamResource> downloadExamReport(@PathVariable Integer sessionId) throws IOException {

        List<Session> sessionList = sessionRepository.findByExam_ExamId(sessionId);
        Session session = sessionList.get(0);

        // SecurityContextHolder에서 adminId 가져오기
        Integer adminId = (Integer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 레포트 생성
        ExamReportResponseDTO report = examReportService.generateExamReport(adminId, sessionId);

        // 학생 정보 가져오기
        List<UserListResponseDTO.UserInfo> userInfos = examReportService.getUserInfoList(sessionId);


        // 엑셀 파일 생성
        ByteArrayInputStream excelFile = excelService.generateExcelFile(report, userInfos);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=exam_report.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(excelFile));
    }


    @GetMapping("/{examId}/cheating-types")
    public ResponseEntity<Map<String, Boolean>> getCheatingTypes(@PathVariable Integer examId) {
        Map<String, Boolean> cheatingTypes = examService.getCheatingTypesByExamId(examId);
        return ResponseEntity.ok(cheatingTypes);
    }

}
