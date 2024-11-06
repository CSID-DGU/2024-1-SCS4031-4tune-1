package com.fortune.eyesee.controller;

import com.fortune.eyesee.common.response.BaseResponse;
import com.fortune.eyesee.dto.ExamCodeRequestDTO;
import com.fortune.eyesee.dto.UserInfoRequestDTO;
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

    // 시험 세션 입장
    @PostMapping("/join")
    public ResponseEntity<BaseResponse<String>> joinExam(@RequestBody ExamCodeRequestDTO examCodeRequestDTO) {
        sessionService.joinExamSession(examCodeRequestDTO.getExamCode());
        return ResponseEntity.ok(new BaseResponse<>("시험 세션 입장에 성공했습니다."));
    }

    // 사용자 정보 입력
    @PostMapping("/student")
    public ResponseEntity<BaseResponse<String>> addUserInfo(@RequestBody UserInfoRequestDTO userInfoRequestDTO) {
        sessionService.addUserInfo(userInfoRequestDTO);
        return ResponseEntity.ok(new BaseResponse<>("사용자 정보 입력에 성공했습니다."));
    }
}
