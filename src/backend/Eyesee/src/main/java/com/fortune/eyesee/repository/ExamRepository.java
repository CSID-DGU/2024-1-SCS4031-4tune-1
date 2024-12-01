package com.fortune.eyesee.repository;

import com.fortune.eyesee.entity.Exam;
import com.fortune.eyesee.enums.ExamStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Integer> {

    // 특정 adminId에 해당하는 Exam 리스트 조회
    List<Exam> findByAdmin_AdminId(Integer adminId);

    // 특정 상태에 해당하는 Exam 리스트 조회
    List<Exam> findByAdmin_AdminIdAndExamStatus(Integer adminId, ExamStatus examStatus);

    // 랜덤 코드와 adminId로 Exam 조회
    Exam findByExamRandomCode(String examRandomCode);


    // adminId 없이 상태로만 Exam 조회
    List<Exam> findByExamStatus(ExamStatus examStatus);

    // 특정 sessionId와 adminId를 기준으로 Exam 데이터 조회
    Optional<Exam> findBySession_SessionIdAndAdmin_AdminId(Integer sessionId, Integer adminId);

}