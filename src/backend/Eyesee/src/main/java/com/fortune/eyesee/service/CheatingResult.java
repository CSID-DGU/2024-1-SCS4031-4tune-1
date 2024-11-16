package com.fortune.eyesee.service;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class CheatingResult {

    @JsonProperty("user_id")
    private Integer userId;

    @JsonProperty("cheating_counts")
    private Map<String, Integer> cheatingCounts;

    @JsonProperty("timestamp")
    private String timestamp;

    public Integer getUserId() {
        return userId;
    }

    public Map<String, Integer> getCheatingCounts() {
        return cheatingCounts;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public void setCheatingCounts(Map<String, Integer> cheatingCounts) {
        this.cheatingCounts = cheatingCounts;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}