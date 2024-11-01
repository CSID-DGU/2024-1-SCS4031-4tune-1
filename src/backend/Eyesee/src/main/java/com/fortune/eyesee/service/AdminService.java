package com.fortune.eyesee.service;

import com.fortune.eyesee.dto.AdminLoginDTO;
import com.fortune.eyesee.dto.AdminSignupDTO;
import com.fortune.eyesee.entity.Admin;
import com.fortune.eyesee.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 회원가입 메서드
    public Admin registerAdmin(AdminSignupDTO adminSignupDTO) {
        if (adminRepository.findByAdminEmail(adminSignupDTO.getAdminEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        if (!adminSignupDTO.getPassword().equals(adminSignupDTO.getPasswordConfirm())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        Admin admin = new Admin();
        admin.setAdminEmail(adminSignupDTO.getAdminEmail());
        admin.setPassword(passwordEncoder.encode(adminSignupDTO.getPassword()));
        admin.setAdminName(adminSignupDTO.getAdminName());
        return adminRepository.save(admin);
    }

    // 로그인 메서드
    public Admin loginAdmin(AdminLoginDTO adminLoginDTO) {
        Admin admin = adminRepository.findByAdminEmail(adminLoginDTO.getAdminEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 잘못되었습니다."));

        if (!passwordEncoder.matches(adminLoginDTO.getPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 잘못되었습니다.");
        }
        return admin;
    }
}