package com.fortune.eyesee.controller;

import com.fortune.eyesee.common.response.BaseResponse;
import com.fortune.eyesee.dto.AdminLoginRequestDTO;
import com.fortune.eyesee.dto.AdminSignupRequestDTO;
import com.fortune.eyesee.dto.TokenResponseDTO;
import com.fortune.eyesee.service.AdminService;
import com.fortune.eyesee.utils.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/api/admins")
public class AdminController {
    @Autowired
    private AdminService adminService;
    @Autowired
    private JwtUtil jwtUtil;

    // 회원가입 API
    @PostMapping("/signup")
    public ResponseEntity<BaseResponse<TokenResponseDTO>> registerAndLogin(@RequestBody AdminSignupRequestDTO adminSignupRequestDTO) {
        TokenResponseDTO tokens = adminService.registerAndLogin(adminSignupRequestDTO);
        return ResponseEntity.ok(new BaseResponse<>(tokens, "회원가입 및 로그인 성공"));
    }

    // 로그인 API
    @PostMapping("/login")
    public ResponseEntity<BaseResponse<TokenResponseDTO>> loginAdmin(@RequestBody AdminLoginRequestDTO adminLoginRequestDTO) {
        TokenResponseDTO tokens = adminService.loginAdmin(adminLoginRequestDTO);
        return ResponseEntity.ok(new BaseResponse<>(tokens, "로그인 성공"));
    }

//    // 로그아웃 API
//    @PostMapping("/logout")
//    public ResponseEntity<BaseResponse<String>> logoutAdmin(HttpSession session) {
//        session.invalidate(); // 세션 무효화
//        return ResponseEntity.ok(BaseResponse.success("로그아웃 성공"));
//    }

}