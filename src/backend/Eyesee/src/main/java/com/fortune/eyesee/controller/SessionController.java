package com.fortune.eyesee.controller;

import com.fortune.eyesee.common.response.BaseResponse;
import com.fortune.eyesee.dto.ExamCodeRequestDTO;
import com.fortune.eyesee.dto.StudentSessionRequestDTO;
import com.fortune.eyesee.dto.TokenResponseDTO;
import com.fortune.eyesee.entity.Session;
import com.fortune.eyesee.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    // 학생이 세션에 접속하고 토큰을 발급받는 요청
    @PostMapping("/join")
    public ResponseEntity<BaseResponse<TokenResponseDTO>> joinSession(@RequestBody StudentSessionRequestDTO requestDTO) {
        TokenResponseDTO tokenResponse = sessionService.joinSession(requestDTO);
        return ResponseEntity.ok(new BaseResponse<>(tokenResponse, "로그인 성공"));
    }
}