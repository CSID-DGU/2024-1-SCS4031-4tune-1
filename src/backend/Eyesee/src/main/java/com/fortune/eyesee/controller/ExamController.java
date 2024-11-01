package com.fortune.eyesee.controller;

import com.fortune.eyesee.common.exception.BaseException;
import com.fortune.eyesee.common.response.BaseResponse;
import com.fortune.eyesee.common.response.BaseResponseCode;
import com.fortune.eyesee.dto.ExamResponseDTO;
import com.fortune.eyesee.enums.ExamStatus;
import com.fortune.eyesee.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
