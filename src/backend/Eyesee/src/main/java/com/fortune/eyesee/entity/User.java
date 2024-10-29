package com.fortune.eyesee.entity;


import lombok.Data;

import jakarta.persistence.*;

@Entity
@Table(name = "User")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(nullable = false)
    private String studentNumber;

    private String department;
    private String userName;
    private Integer seatNum; // 좌석 번호

}