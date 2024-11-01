package com.fortune.eyesee.repository;


import com.fortune.eyesee.entity.VideoRecording;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRecordingRepository extends JpaRepository<VideoRecording, Integer> {
    List<VideoRecording> findByUserId(Integer userId);
}