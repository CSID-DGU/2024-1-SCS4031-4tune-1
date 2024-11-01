package com.fortune.eyesee.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "User")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @ManyToOne
    @JoinColumn(name = "sessionId", referencedColumnName = "sessionId")
    private Session session;

    private int userNum;
    private String department;
    private String userName;
    private Integer seatNum;
}
