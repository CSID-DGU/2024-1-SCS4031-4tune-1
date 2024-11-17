package com.fortune.eyesee.repository;

import com.fortune.eyesee.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Integer> {
    List<Session> findByExam_ExamId(Integer examId);

    Optional<Session> findByExamExamRandomCode(String examCode);
}