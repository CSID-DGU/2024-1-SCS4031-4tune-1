package com.fortune.eyesee.service;

import com.fortune.eyesee.common.exception.BaseException;
import com.fortune.eyesee.common.response.BaseResponseCode;
import com.fortune.eyesee.dto.ExamResponseDTO;
import com.fortune.eyesee.entity.Exam;
import com.fortune.eyesee.enums.ExamStatus;
import com.fortune.eyesee.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    public boolean existsById(Integer examId) {
        return examRepository.existsById(examId);
    }

    // 관리자 ID와 특정 ExamStatus로 Exam 리스트 조회
    public List<ExamResponseDTO> getExamsByStatus(Integer adminId, ExamStatus examStatus) {
        return examRepository.findByAdmin_AdminIdAndExamStatus(adminId, examStatus).stream()
                .map(exam -> new ExamResponseDTO(
                        exam.getExamId(),
                        exam.getExamName(),
                        exam.getExamSemester(),
                        exam.getExamStudentNumber(),
                        exam.getExamLocation(),
                        exam.getExamDate(),
                        exam.getExamStartTime(),
                        exam.getExamDuration(),
                        exam.getExamStatus(),
                        exam.getExamNotice(),
                        exam.getSession() != null ? exam.getSession().getSessionId() : null
                ))
                .collect(Collectors.toList());
    }

    public ExamResponseDTO getExamByCode(String examCode) {

        Exam exam = examRepository.findByExamRandomCode(examCode);
        if (exam == null) {
            throw new BaseException(BaseResponseCode.NOT_FOUND_EXAM_CODE);
        }
        return new ExamResponseDTO(
                exam.getExamId(),
                exam.getExamName(),
                exam.getExamSemester(),
                exam.getExamStudentNumber(),
                exam.getExamLocation(),
                exam.getExamDate(),
                exam.getExamStartTime(),
                exam.getExamDuration(),
                exam.getExamStatus(),
                exam.getExamNotice(),
                exam.getSession() != null ? exam.getSession().getSessionId() : null // 세션 ID가 있을 경우
        );
    }
}