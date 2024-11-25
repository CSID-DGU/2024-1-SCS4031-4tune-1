package com.fortune.eyesee.dto;

public class TokenWithUserIdResponseDTO extends TokenResponseDTO {
    private Integer userId;

    public TokenWithUserIdResponseDTO(String accessToken, String refreshToken, Integer userId) {
        super(accessToken, refreshToken);
        this.userId = userId;
    }

    public Integer getUserId() {
        return userId;
    }
}