package com.fortune.eyesee.controller;

import com.fortune.eyesee.common.response.BaseResponse;
import com.fortune.eyesee.common.response.BaseResponseCode;
import com.fortune.eyesee.dto.CheatingResponseDTO;
import com.fortune.eyesee.entity.DetectedCheating;
import com.fortune.eyesee.service.DetectedCheatingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/cheatings")
public class DetectedCheatingController {

    private final DetectedCheatingService service;

    public DetectedCheatingController(DetectedCheatingService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<List<DetectedCheating>> saveCheating(@RequestBody CheatingResponseDTO cheatingResponseDTO) {
        log.info("Request: {}", cheatingResponseDTO);
        List<DetectedCheating> savedCheatings = service.saveCheating(cheatingResponseDTO);
        return ResponseEntity.ok(new BaseResponse<>(savedCheatings).getData());
    }
}