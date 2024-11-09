package com.fortune.eyesee.entity;

import java.io.Serializable;
import lombok.EqualsAndHashCode;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class UserId implements Serializable {
    private Integer sessionId; // 세션 ID
    private Integer userNum;   // 학번
}