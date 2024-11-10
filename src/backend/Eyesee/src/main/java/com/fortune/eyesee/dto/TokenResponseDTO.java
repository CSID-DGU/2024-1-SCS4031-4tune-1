package com.fortune.eyesee.dto;

public class TokenResponseDTO {
    private String access_token;
    private String refresh_token;

    public TokenResponseDTO(String accessToken, String refreshToken) {
        this.access_token = accessToken;
        this.refresh_token = refreshToken;
    }

    public String getAccess_token() {
        return access_token;
    }

    public String getRefresh_token() {
        return refresh_token;
    }
}