package com.fortune.eyesee.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class CheatingStatistic {
    private Integer cheatingStatisticsId;
    private String koreanTypeName;
    private Integer cheatingCount;
    private String detectedTime;

    // 생성자
    public CheatingStatistic(Integer cheatingStatisticsId, String koreanTypeName, Integer cheatingCount, String detectedTime) {
        this.cheatingStatisticsId = cheatingStatisticsId;
        this.koreanTypeName = koreanTypeName;
        this.cheatingCount = cheatingCount;
        this.detectedTime = detectedTime;
    }

}