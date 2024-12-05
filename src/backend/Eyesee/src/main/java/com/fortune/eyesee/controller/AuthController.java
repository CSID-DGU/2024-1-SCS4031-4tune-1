package com.fortune.eyesee.controller;

import com.fortune.eyesee.common.exception.BaseException;
import com.fortune.eyesee.common.response.BaseResponse;
import com.fortune.eyesee.common.response.BaseResponseCode;

import com.fortune.eyesee.dto.AccessTokenResponseDTO;
import com.fortune.eyesee.dto.RefreshTokenRequestDTO;
import com.fortune.eyesee.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/refresh")
    public ResponseEntity<BaseResponse<AccessTokenResponseDTO>> refreshAccessToken(@RequestBody RefreshTokenRequestDTO refreshTokenRequestDTO) {
        try {
            AccessTokenResponseDTO accessTokenResponseDTO = authService.refreshToken(refreshTokenRequestDTO);

            return ResponseEntity.ok(new BaseResponse<>(accessTokenResponseDTO, "토큰 갱신 성공"));
        } catch (Exception e) {
            throw new BaseException(BaseResponseCode.TOKEN_ERROR);
        }
    }
}