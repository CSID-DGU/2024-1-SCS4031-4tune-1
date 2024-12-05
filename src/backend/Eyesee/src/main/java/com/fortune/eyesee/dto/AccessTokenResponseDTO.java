package com.fortune.eyesee.dto;

public class AccessTokenResponseDTO {
    private String access_token;

    public AccessTokenResponseDTO(String accessToken) {
        this.access_token = accessToken;
    }

    public String getAccess_token() {
        return access_token;
    }
}