package com.fortune.eyesee.controller;

import com.fortune.eyesee.common.response.BaseResponse;
import com.fortune.eyesee.dto.UserDetailResponseDTO;
import com.fortune.eyesee.dto.UserListResponseDTO;
import com.fortune.eyesee.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/exams")
public class ExamController {

    private final ExamService examService;

    @Autowired
    public ExamController(ExamService examService) {
        this.examService = examService;
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
