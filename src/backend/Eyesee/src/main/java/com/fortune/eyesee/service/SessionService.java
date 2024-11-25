package com.fortune.eyesee.service;

import com.fortune.eyesee.common.exception.BaseException;
import com.fortune.eyesee.common.response.BaseResponseCode;
import com.fortune.eyesee.dto.TokenWithUserIdResponseDTO;
import com.fortune.eyesee.dto.UserInfoRequestDTO;
import com.fortune.eyesee.dto.TokenResponseDTO;
import com.fortune.eyesee.entity.Session;
import com.fortune.eyesee.entity.User;
import com.fortune.eyesee.repository.SessionRepository;
import com.fortune.eyesee.repository.UserRepository;
import com.fortune.eyesee.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;


    // 세션에 학생을 등록하고 토큰을 발급
    @Transactional
    public TokenWithUserIdResponseDTO addUserInfo(UserInfoRequestDTO requestDTO) {
        // 시험 세션 찾기
        Session session = sessionRepository.findByExamExamRandomCode(requestDTO.getExamCode())
                .orElseThrow(() -> new BaseException(BaseResponseCode.NOT_FOUND_SESSION));

        // 학생 정보를 등록 (이미 있는 경우 무시)
        User user = userRepository.findBySessionAndUserNum(session, requestDTO.getUserNum())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setSession(session);
                    newUser.setUserNum(requestDTO.getUserNum());
                    newUser.setUserName(requestDTO.getName());
                    newUser.setDepartment(requestDTO.getDepartment());
                    newUser.setSeatNum(requestDTO.getSeatNum());
                    return userRepository.save(newUser);
                });

        // 세션 토큰 생성 및 반환
        String accessToken = jwtUtil.generateSessionToken(session.getSessionId(), user.getUserNum());
        return new TokenWithUserIdResponseDTO(accessToken, null, user.getUserId());  // Refresh Token은 필요 없으므로 null 설정
    }

}