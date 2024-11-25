package com.fortune.eyesee.controller;

import com.fortune.eyesee.common.response.BaseResponse;
import com.fortune.eyesee.dto.*;
import com.fortune.eyesee.service.ExamService;
import com.fortune.eyesee.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    @Autowired
    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @Autowired
    private ExamService examService;

    // 시험 세션 입장
    @PostMapping("/join")
    public ResponseEntity<BaseResponse<ExamInfoResponseDTO>> joinExam(@RequestBody ExamCodeRequestDTO examCodeRequestDTO) {
        // examCode로 시험 정보 조회
        ExamInfoResponseDTO examInfoResponseDTO = examService.getExamByCode(examCodeRequestDTO.getExamCode());
        return ResponseEntity.ok(new BaseResponse<>(examInfoResponseDTO, "시험 세션 입장 성공"));

    }

    // 학생 정보 입력
    @PostMapping("/student")
    public ResponseEntity<BaseResponse<TokenWithUserIdResponseDTO>> addUserInfo(@RequestBody UserInfoRequestDTO userInfoRequestDTO) {
        // 학생 정보 입력, 토큰 및 userId 반환
        TokenWithUserIdResponseDTO tokenWithUserIdResponseDTO = sessionService.addUserInfo(userInfoRequestDTO);
        return ResponseEntity.ok(new BaseResponse<>(tokenWithUserIdResponseDTO, "사용자 정보 입력 성공"));

    }
}