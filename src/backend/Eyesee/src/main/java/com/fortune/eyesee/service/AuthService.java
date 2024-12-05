package com.fortune.eyesee.service;

import com.fortune.eyesee.common.exception.BaseException;
import com.fortune.eyesee.common.response.BaseResponseCode;
import com.fortune.eyesee.dto.AccessTokenResponseDTO;
import com.fortune.eyesee.dto.RefreshTokenRequestDTO;
import com.fortune.eyesee.utils.JwtUtil;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final JwtUtil jwtUtil;

    public AuthService(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    public AccessTokenResponseDTO refreshToken(RefreshTokenRequestDTO request) {
        // 리프레시 토큰 검증 (validateToken에서 예외 처리)
        jwtUtil.validateToken(request.getRefresh_token());

        // 리프레시 토큰에서 사용자 ID 추출
        Integer adminId = jwtUtil.getAdminIdFromToken(request.getRefresh_token());

        // 새로운 액세스 토큰 발급
        String newAccessToken = jwtUtil.generateToken(adminId);

        return new AccessTokenResponseDTO(newAccessToken);

    }
}