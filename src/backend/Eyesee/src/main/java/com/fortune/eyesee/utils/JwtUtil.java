package com.fortune.eyesee.utils;

import com.fortune.eyesee.common.exception.BaseException;
import com.fortune.eyesee.common.response.BaseResponseCode;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refreshExpiration}")
    private long refreshTokenExpiration;

    @Value("${jwt.studentExpiration}")
    private long studentExpiration;

    // Access Token 생성
    public String generateToken(Integer adminId) {
        return Jwts.builder()
                .setSubject(adminId.toString())
                .claim("type", "access_token") // 토큰 타입 추가
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }

    // Refresh Token 생성
    public String generateRefreshToken(Integer adminId) {
        return Jwts.builder()
                .setSubject(adminId.toString())
                .claim("type", "refresh_token") // 토큰 타입 추가
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            throw new BaseException(BaseResponseCode.EXPIRED_TOKEN);
        } catch (MalformedJwtException e) {
            throw new BaseException(BaseResponseCode.MALFORMED_TOKEN);
        } catch (UnsupportedJwtException e) {
            throw new BaseException(BaseResponseCode.UNSUPPORTED_TOKEN);
        } catch (IllegalArgumentException e) {
            throw new BaseException(BaseResponseCode.TOKEN_ERROR);
        }
    }

    // 토큰 타입 검증
    public boolean isRefreshToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseClaimsJws(token)
                .getBody();
        return "refresh_token".equals(claims.get("type"));
    }

    // Session Token 생성 (Student용) Refresh 토큰은 없음.
    public String generateSessionToken(Integer sessionId, Integer userNum) {
        return Jwts.builder()
                .setSubject("session:" + sessionId + ":" + userNum)  // 세션 ID와 학생 번호로 subject 설정
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + studentExpiration))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }

    // 토큰에서 AdminId 추출
    public Integer getAdminIdFromToken(String token) {
        try {
            String subject = Jwts.parserBuilder()
                    .setSigningKey(secretKey.getBytes(StandardCharsets.UTF_8))
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            return Integer.parseInt(subject);
        } catch (JwtException | NumberFormatException e) {
            throw new IllegalArgumentException("Invalid token or admin ID", e);
        }
    }

    // 토큰에서 Session ID와 UserNum 추출
    public Integer[] getSessionInfoFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey.getBytes(StandardCharsets.UTF_8))
                .build()
                .parseClaimsJws(token)
                .getBody();
        String subject = claims.getSubject();

        if (subject.startsWith("session:")) {
            String[] parts = subject.split(":");
            Integer sessionId = Integer.parseInt(parts[1]);
            Integer userNum = Integer.parseInt(parts[2]);
            return new Integer[]{sessionId, userNum};
        }

        throw new JwtException("Invalid session token");
    }
}