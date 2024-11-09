package com.fortune.eyesee.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "User", uniqueConstraints = {@UniqueConstraint(columnNames = {"sessionId", "userNum"})})
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

//    @Column(name = "sessionId", nullable = false)
//    private int sessionId; // 세션 ID (int 타입)
//
//    @Column(nullable = false)
//    private String userNum;

    @ManyToOne
    @JoinColumn(name = "sessionId", referencedColumnName = "sessionId")
    private Session session;

    @Column(nullable = false)
    private Integer userNum;  // 학번, 복합 키의 일부

    private String department;
    private String userName;
    private Integer seatNum;
}
