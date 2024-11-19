package com.fortune.eyesee.controller;

import com.fortune.eyesee.service.VideoCaptureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VideoController {

    @Autowired
    private VideoCaptureService videoCaptureService;


}