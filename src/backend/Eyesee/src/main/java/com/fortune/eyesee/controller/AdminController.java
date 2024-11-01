package com.fortune.eyesee.controller;

import com.fortune.eyesee.dto.AdminLoginDTO;
import com.fortune.eyesee.dto.AdminSignupDTO;
import com.fortune.eyesee.entity.Admin;
import com.fortune.eyesee.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    // 회원가입 API
    @PostMapping("/signup")
    public ResponseEntity<String> registerAdmin(@RequestBody AdminSignupDTO adminSignupDTO) {
        adminService.registerAdmin(adminSignupDTO);
        return ResponseEntity.ok("회원가입 성공");
    }

    // 로그인 API
    @PostMapping("/login")
    public ResponseEntity<String> loginAdmin(@RequestBody AdminLoginDTO adminLoginDTO, HttpSession session) {
        Admin admin = adminService.loginAdmin(adminLoginDTO);
        session.setAttribute("admin", admin); // 세션에 로그인 정보 저장
        return ResponseEntity.ok("로그인 성공");
    }

    // 로그아웃 API
    @PostMapping("/logout")
    public ResponseEntity<String> logoutAdmin(HttpSession session) {
        session.invalidate(); // 세션 무효화
        return ResponseEntity.ok("로그아웃 성공");
    }
}