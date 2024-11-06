package com.fortune.eyesee.service;

import com.fortune.eyesee.common.exception.BaseException;
import com.fortune.eyesee.common.response.BaseResponseCode;
import com.fortune.eyesee.dto.AdminLoginRequestDTO;
import com.fortune.eyesee.dto.AdminLoginResponseDTO;
import com.fortune.eyesee.dto.AdminSignupRequestDTO;
import com.fortune.eyesee.dto.TokenResponseDTO;
import com.fortune.eyesee.entity.Admin;
import com.fortune.eyesee.repository.AdminRepository;
import com.fortune.eyesee.utils.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public TokenResponseDTO registerAndLogin(AdminSignupRequestDTO adminSignupRequestDTO) {
        // 입력값 검증
        if (adminSignupRequestDTO.getAdminEmail() == null ||
                adminSignupRequestDTO.getPassword() == null ||
                adminSignupRequestDTO.getPasswordConfirm() == null) {
            throw new BaseException(BaseResponseCode.INVALID_INPUT);
        }

        if (adminRepository.findByAdminEmail(adminSignupRequestDTO.getAdminEmail()).isPresent()) {
            throw new BaseException(BaseResponseCode.ALREADY_EXIST_USER);
        }

        if (!adminSignupRequestDTO.getPassword().equals(adminSignupRequestDTO.getPasswordConfirm())) {
            throw new BaseException(BaseResponseCode.NOT_EQUAL_PASSWORD);
        }

        if (adminSignupRequestDTO.getPassword().length() < 8) {
            throw new BaseException(BaseResponseCode.WEAK_PASSWORD);
        }

        String emailPattern = "^[A-Za-z0-9+_.-]+@(.+)$";
        if (!adminSignupRequestDTO.getAdminEmail().matches(emailPattern)) {
            throw new BaseException(BaseResponseCode.INVALID_EMAIL_FORMAT);
        }

        // 회원가입 처리
        Admin admin = new Admin();
        admin.setAdminEmail(adminSignupRequestDTO.getAdminEmail());
        admin.setPassword(passwordEncoder.encode(adminSignupRequestDTO.getPassword()));
        admin.setAdminName(adminSignupRequestDTO.getAdminName());
        adminRepository.save(admin);

        // Access Token 및 Refresh Token 생성
        String accessToken = jwtUtil.generateToken(admin.getAdminId());
        String refreshToken = jwtUtil.generateRefreshToken(admin.getAdminId());

        return new TokenResponseDTO(accessToken, refreshToken);

    }

    // 로그인 메서드
    public TokenResponseDTO loginAdmin(AdminLoginRequestDTO adminLoginRequestDTO) {
        Admin admin = adminRepository.findByAdminEmail(adminLoginRequestDTO.getAdminEmail())
                .orElseThrow(() -> new BaseException(BaseResponseCode.NOT_FOUND_USER));

        if (!passwordEncoder.matches(adminLoginRequestDTO.getPassword(), admin.getPassword())) {
            throw new BaseException(BaseResponseCode.WRONG_PASSWORD);
        }

        // 로그인 성공 시 JWT 토큰 반환
        String accessToken = jwtUtil.generateToken(admin.getAdminId());
        String refreshToken = jwtUtil.generateRefreshToken(admin.getAdminId());

        return new TokenResponseDTO(accessToken, refreshToken);
    }
}