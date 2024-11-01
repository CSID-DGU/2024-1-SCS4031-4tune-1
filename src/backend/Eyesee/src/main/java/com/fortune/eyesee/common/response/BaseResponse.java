package com.fortune.eyesee.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class BaseResponse<T> {

    private final int statusCode;
    private final String code;
    private final String message;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T data;

    // 성공 응답 (데이터 포함)
    public BaseResponse(T data) {
        this.statusCode = BaseResponseCode.SUCCESS.getStatus().value();
        this.code = BaseResponseCode.SUCCESS.getCode();
        this.message = BaseResponseCode.SUCCESS.getMessage();
        this.data = data;
    }

    // 메시지 커스텀 성공 응답 (데이터 없음)
    public BaseResponse(String customMessage) {
        this.statusCode = BaseResponseCode.SUCCESS.getStatus().value();
        this.code = BaseResponseCode.SUCCESS.getCode();
        this.message = customMessage; // 커스텀 메시지 사용
        this.data = null;
    }

    // 실패 응답 (BaseResponseCode 사용)
    public BaseResponse(BaseResponseCode baseResponseCode) {
        this.statusCode = baseResponseCode.getStatus().value();
        this.code = baseResponseCode.getCode();
        this.message = baseResponseCode.getMessage();
        this.data = null;
    }

    // 실패 응답 (직접 코드 및 메시지 설정)
    public BaseResponse(int statusCode, String code, String message) {
        this.statusCode = statusCode;
        this.code = code;
        this.message = message;
        this.data = null;
    }

    // 정적 메서드를 통한 오류 생성
    public static BaseResponse<?> error(int statusCode, String code, String message) {
        return new BaseResponse<>(statusCode, code, message);
    }
}