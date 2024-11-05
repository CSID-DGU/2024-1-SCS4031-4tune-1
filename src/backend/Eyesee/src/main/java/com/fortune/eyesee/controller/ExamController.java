package com.fortune.eyesee.controller;

import com.fortune.eyesee.common.exception.BaseException;
import com.fortune.eyesee.common.response.BaseResponse;
import com.fortune.eyesee.common.response.BaseResponseCode;
import com.fortune.eyesee.dto.*;
import com.fortune.eyesee.enums.ExamStatus;
import com.fortune.eyesee.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    @Autowired
    private ExamService examService;

//    // "before" 상태의 Exam 리스트 조회
//    @GetMapping("/before")
//    public ResponseEntity<BaseResponse<List<ExamResponseDTO>>> getBeforeExams(HttpSession session) {
//        return getExamsByStatus("BEFORE", session);
//    }
//
//    // "in-progress" 상태의 Exam 리스트 조회
//    @GetMapping("/in-progress")
//    public ResponseEntity<BaseResponse<List<ExamResponseDTO>>> getInProgressExams(HttpSession session) {
//        return getExamsByStatus("IN_PROGRESS", session);
//    }
//
//    // "done" 상태의 Exam 리스트 조회
//    @GetMapping("/done")
//    public ResponseEntity<BaseResponse<List<ExamResponseDTO>>> getDoneExams(HttpSession session) {
//        return getExamsByStatus("DONE", session);
//    }

    // 공통 메서드: 상태별 Exam 조회
//    private ResponseEntity<BaseResponse<List<ExamResponseDTO>>> getExamsByStatus(String status, HttpSession session) {
//        Integer adminId = (Integer) session.getAttribute("adminId");
//        if (adminId == null) {
//            throw new BaseException(BaseResponseCode.UNAUTHORIZED);
//        }
//
//        ExamStatus examStatus = ExamStatus.fromString(status);
//        if (examStatus == null) {
//            throw new BaseException(BaseResponseCode.INVALID_STATUS);
//        }
//
//        List<ExamResponseDTO> examList = examService.getExamsByStatus(adminId, examStatus);
//        return ResponseEntity.ok(new BaseResponse<>(examList));
//    }

    // 시험 등록
//    @PostMapping
//    public ResponseEntity<BaseResponse<ExamResponseDTO>> registerExam(@RequestBody ExamRequestDTO examRequestDTO, HttpSession session) {
//        Integer adminId = (Integer) session.getAttribute("adminId");
//        if (adminId == null) {
//            // 로그인되지 않은 경우 예외처리
//            throw new BaseException(BaseResponseCode.UNAUTHORIZED);
//        }
//
//        // 시험 생성 및 랜덤 코드 생성
//        ExamResponseDTO response = examService.registerExam(adminId, examRequestDTO);
//        return ResponseEntity.ok(new BaseResponse<>(response, "시험 등록에 성공했습니다."));
//    }
    @PostMapping
    public ResponseEntity<BaseResponse<Map<String, String>>> registerExam(@RequestBody ExamRequestDTO examRequestDTO, HttpSession session) {
        Integer adminId = (Integer) session.getAttribute("adminId");
        if (adminId == null) {
            throw new BaseException(BaseResponseCode.UNAUTHORIZED);
        }

        ExamResponseDTO response = examService.registerExam(adminId, examRequestDTO);

        // examRandomCode만 포함된 응답 생성
        Map<String, String> responseData = new HashMap<>();
        responseData.put("examRandomCode", response.getExamRandomCode());

        return ResponseEntity.ok(new BaseResponse<>(responseData, "시험 등록에 성공했습니다."));
    }

    // "before" 상태의 Exam 리스트 조회
    @GetMapping("/before")
    public ResponseEntity<BaseResponse<List<ExamResponseDTO>>> getBeforeExams() {
        return getExamsByStatus("BEFORE");
    }

    // "in-progress" 상태의 Exam 리스트 조회
    @GetMapping("/in-progress")
    public ResponseEntity<BaseResponse<List<ExamResponseDTO>>> getInProgressExams() {
        return getExamsByStatus("IN_PROGRESS");
    }

    // "done" 상태의 Exam 리스트 조회
    @GetMapping("/done")
    public ResponseEntity<BaseResponse<List<ExamResponseDTO>>> getDoneExams() {
        return getExamsByStatus("DONE");
    }

    // 공통 메서드: 상태별 Exam 조회 (세션 검증 없이)
    private ResponseEntity<BaseResponse<List<ExamResponseDTO>>> getExamsByStatus(String status) {
        ExamStatus examStatus = ExamStatus.fromString(status);
        if (examStatus == null) {
            throw new BaseException(BaseResponseCode.INVALID_STATUS);
        }

        // adminId를 사용하지 않는 조회 방식으로 수정
        List<ExamResponseDTO> examList = examService.getExamsByStatus(null, examStatus);
        return ResponseEntity.ok(new BaseResponse<>(examList));
    }



    // ExamCode로 특정 Exam 조회 (POST 요청)
    @PostMapping("/{examId}/code")
    public ResponseEntity<BaseResponse<ExamResponseDTO>> getExamByCode(@PathVariable Integer examId, @RequestBody ExamCodeRequestDTO examCodeRequestDTO, HttpSession session) {
        // examId가 존재하는지 확인
        if (!examService.existsById(examId)) {
            throw new BaseException(BaseResponseCode.NOT_FOUND_EXAM);
        }

        // examCode로 시험 정보 조회
        ExamResponseDTO examResponseDTO = examService.getExamByCode(examCodeRequestDTO.getExamCode());

        // examId 비교
        if (!examResponseDTO.getExamId().equals(examId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new BaseResponse<>(HttpStatus.NOT_FOUND.value(),
                            BaseResponseCode.NOT_FOUND_EXAM.getCode(),
                            "제공된 examId와 조회된 시험의 examId가 일치하지 않습니다."));
        }

        return ResponseEntity.ok(new BaseResponse<>(examResponseDTO));
    }

    // 특정 시험 ID에 해당하는 세션 내 모든 학생들의 리스트를 조회
    @GetMapping("/{examId}/sessions")
    public ResponseEntity<BaseResponse<UserListResponseDTO>> getUserListByExamId(@PathVariable Integer examId) {
        UserListResponseDTO response = examService.getUserListByExamId(examId);
        return ResponseEntity.ok(new BaseResponse<>(response, "학생 리스트 조회 성공"));
    }

    // 특정 시험 ID와 사용자 ID에 해당하는 학생의 상세 정보를 조회
    @GetMapping("/{examId}/sessions/{userId}")
    public ResponseEntity<BaseResponse<UserDetailResponseDTO>> getUserDetailByExamIdAndUserId(
            @PathVariable Integer examId,
            @PathVariable Integer userId) {
        UserDetailResponseDTO response = examService.getUserDetailByExamIdAndUserId(examId, userId);
        return ResponseEntity.ok(new BaseResponse<>(response, "학생 상세 정보 조회 성공"));
    }
}
