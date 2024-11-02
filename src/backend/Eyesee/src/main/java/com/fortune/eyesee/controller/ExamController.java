package com.fortune.eyesee.controller;

import com.fortune.eyesee.common.exception.BaseException;
import com.fortune.eyesee.common.response.BaseResponse;
import com.fortune.eyesee.common.response.BaseResponseCode;
import com.fortune.eyesee.dto.ExamCodeRequestDTO;
import com.fortune.eyesee.dto.ExamResponseDTO;
import com.fortune.eyesee.enums.ExamStatus;
import com.fortune.eyesee.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.List;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    @Autowired
    private ExamService examService;

    // "before" 상태의 Exam 리스트 조회
    @GetMapping("/before")
    public ResponseEntity<BaseResponse<List<ExamResponseDTO>>> getBeforeExams(HttpSession session) {
        return getExamsByStatus("BEFORE", session);
    }

    // "in-progress" 상태의 Exam 리스트 조회
    @GetMapping("/in-progress")
    public ResponseEntity<BaseResponse<List<ExamResponseDTO>>> getInProgressExams(HttpSession session) {
        return getExamsByStatus("IN_PROGRESS", session);
    }

    // "done" 상태의 Exam 리스트 조회
    @GetMapping("/done")
    public ResponseEntity<BaseResponse<List<ExamResponseDTO>>> getDoneExams(HttpSession session) {
        return getExamsByStatus("DONE", session);
    }

    // 공통 메서드: 상태별 Exam 조회
    private ResponseEntity<BaseResponse<List<ExamResponseDTO>>> getExamsByStatus(String status, HttpSession session) {
        Integer adminId = (Integer) session.getAttribute("adminId");
        if (adminId == null) {
            throw new BaseException(BaseResponseCode.UNAUTHORIZED);
        }

        ExamStatus examStatus = ExamStatus.fromString(status);
        if (examStatus == null) {
            throw new BaseException(BaseResponseCode.INVALID_STATUS);
        }

        List<ExamResponseDTO> examList = examService.getExamsByStatus(adminId, examStatus);
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
}
