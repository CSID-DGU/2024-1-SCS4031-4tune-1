package com.fortune.eyesee.service;

import com.fortune.eyesee.common.exception.BaseException;
import com.fortune.eyesee.common.response.BaseResponseCode;
import com.fortune.eyesee.dto.ExamCodeRequestDTO;
import com.fortune.eyesee.dto.UserInfoRequestDTO;
import com.fortune.eyesee.entity.Exam;
import com.fortune.eyesee.entity.User;
import com.fortune.eyesee.repository.ExamRepository;
import com.fortune.eyesee.repository.UserRepository;
import com.fortune.eyesee.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SessionService {

    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;

    @Autowired
    public SessionService(ExamRepository examRepository, UserRepository userRepository, SessionRepository sessionRepository) {
        this.examRepository = examRepository;
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
    }

    public boolean joinExamSession(String examCode) {
        Exam exam = examRepository.findByExamRandomCode(examCode);
        if (exam == null) {
            throw new BaseException(BaseResponseCode.NOT_FOUND_EXAM_CODE);
        }
        if (exam.getSession() == null) {
            throw new BaseException(BaseResponseCode.NOT_FOUND_SESSION);
        }
        return true;
    }

    // 사용자 정보 저장
    public void addUserInfo(UserInfoRequestDTO userInfoRequestDTO) {
        User user = new User();
        user.setUserName(userInfoRequestDTO.getName());
        user.setDepartment(userInfoRequestDTO.getDepartment());
        user.setUserNum(userInfoRequestDTO.getUserNum());
        user.setSeatNum(userInfoRequestDTO.getSeatNum());

        userRepository.save(user);
    }
}
