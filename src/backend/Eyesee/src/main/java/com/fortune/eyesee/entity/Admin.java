package com.fortune.eyesee.entity;

import lombok.Data;

import jakarta.persistence.*;

@Entity
@Table(name = "Admin")
@Data
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer adminId;

    private String adminEmail;
    private String password;
    private String adminName;
}