package com.fortune.eyesee.repository;

import com.fortune.eyesee.entity.Session;
import com.fortune.eyesee.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    // Session 객체로 사용자 리스트를 검색하는 메소드
    List<User> findBySession(Session session);

    // Session과 UserId로 특정 사용자 검색하는 메소드
    Optional<User> findBySessionAndUserId(Session session, Integer userId);

    Optional<User> findBySessionAndUserNum(Session session, Integer userNum);

    User findByUserId(Integer userId);

    // sessionId로 User 리스트 조회
    List<User> findBySession_SessionId(Integer sessionId);}