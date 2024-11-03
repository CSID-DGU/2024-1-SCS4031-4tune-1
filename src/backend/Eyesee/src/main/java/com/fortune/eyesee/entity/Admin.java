package com.fortune.eyesee.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "Admin")
@Data
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer adminId;

    @Column(nullable = false, unique = true) // 이메일 중복 방지
    private String adminEmail;

    @Column(nullable = false, length = 255) // 비밀번호 암호화 후 저장 시 충분한 크기로 설정
    private String password;

    @Column(nullable = false, length = 100)
    private String adminName;

    @OneToMany(mappedBy = "admin")
    @JsonManagedReference
    private List<Exam> exams; // 관리자가 관리하는 시험 목록
}