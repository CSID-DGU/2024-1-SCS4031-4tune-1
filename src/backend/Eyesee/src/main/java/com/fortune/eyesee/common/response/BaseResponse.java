package com.fortune.eyesee.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fortune.eyesee.common.response.BaseResponseCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
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

    // 성공 응답 (데이터 없음)
    public BaseResponse() {
        this.statusCode = BaseResponseCode.SUCCESS.getStatus().value();
        this.code = BaseResponseCode.SUCCESS.getCode();
        this.message = BaseResponseCode.SUCCESS.getMessage();
    }

    // 실패 응답 (BaseResponseCode 사용)
    public BaseResponse(BaseResponseCode baseResponseCode) {
        this.statusCode = baseResponseCode.getStatus().value();
        this.code = baseResponseCode.getCode();
        this.message = baseResponseCode.getMessage();
    }

    // 실패 응답 (직접 코드 및 메시지 설정)
    public BaseResponse(int statusCode, String code, String message) {
        this.statusCode = statusCode;
        this.code = code;
        this.message = message;
    }

    // 정적 메서드를 통한 오류 생성
    public static BaseResponse<?> error(int statusCode, String code, String message) {
        return new BaseResponse<>(statusCode, code, message);
    }
}