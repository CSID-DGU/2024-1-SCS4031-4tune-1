package com.fortune.eyesee.dto;


public class TokenWithUserIdResponseDTO extends TokenResponseDTO {
    private Integer userId;
    private Integer examId;

    public TokenWithUserIdResponseDTO(String accessToken, String refreshToken, Integer userId, Integer examId) {
        super(accessToken, refreshToken);
        this.userId = userId;
        this.examId = examId;
    }

    public Integer getUserId() {
        return userId;
    }

    public Integer getExamId() {
        return examId;
    }
}