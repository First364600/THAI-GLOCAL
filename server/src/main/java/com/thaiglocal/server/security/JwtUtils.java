package com.thaiglocal.server.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {

    @Value("${jwt.access-secret}")
    private String accessSecret;

    @Value("${jwt.refresh-secret}")
    private String refreshSecret;

    @Value("${jwt.issuer:thai-glocal}")
    private String issuer;

    @Value("${jwt.access-expiration-ms:900000}") // 15 minutes
    private long accessTokenValidityMs;

    @Value("${jwt.refresh-expiration-ms:604800000}") // 7 days
    private long refreshTokenValidityMs;

    private Key getAccessSigningKey() {
        return Keys.hmacShaKeyFor(accessSecret.getBytes(StandardCharsets.UTF_8));
    }

    private Key getRefreshSigningKey() {
        return Keys.hmacShaKeyFor(refreshSecret.getBytes(StandardCharsets.UTF_8));
    }

    private String buildToken(String userId, Key key, long validityMs, String tokenType, Map<String, Object> extraClaims) {
        Instant now = Instant.now();
        Instant exp = now.plusMillis(validityMs);

        var builder = Jwts.builder()
            .setId(UUID.randomUUID().toString())
            .setIssuer(issuer)
            .setSubject(userId)
            .claim("type", tokenType)
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(exp))
            .signWith(key, SignatureAlgorithm.HS512);

        if (extraClaims != null && !extraClaims.isEmpty()) {
            extraClaims.forEach(builder::claim);
        }

        return builder.compact();
    }

    public String generateAccessToken(Long userId, String role) {
        return buildToken(
            String.valueOf(userId),
            getAccessSigningKey(),
            accessTokenValidityMs,
            "access",
            Map.of("role", role)
        );
    }

    public String generateRefreshToken(Long userId) {
        return buildToken(
            String.valueOf(userId),
            getRefreshSigningKey(),
            refreshTokenValidityMs,
            "refresh",
            Map.of()
        );
    }

    public Long extractUserId(String token, boolean isAccessToken) {
        Claims claims = parseClaims(token, isAccessToken ? getAccessSigningKey() : getRefreshSigningKey());
        try {
            return Long.parseLong(claims.getSubject());
        } catch (NumberFormatException e) {
            throw new JwtException("Invalid subject format");
        }
    }

    private Claims parseClaims(String token, Key key) {
        return Jwts.parserBuilder()
            .setSigningKey(key)
            .requireIssuer(issuer)
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    private boolean validateTokenWithKey(String token, Key key, String expectedType) {
        try {
            Claims claims = parseClaims(token, key);
            String type = claims.get("type", String.class);
            Date exp = claims.getExpiration();
            return expectedType.equals(type) && exp != null && exp.after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean validateAccessToken(String token) {
        return validateTokenWithKey(token, getAccessSigningKey(), "access");
    }

    public boolean validateRefreshToken(String token) {
        return validateTokenWithKey(token, getRefreshSigningKey(), "refresh");
    }

    public String refreshAccessToken(String refreshToken, String currentRoleFromDb) {
        if (!validateRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid or expired refresh token.");
        }

        Long userId = extractUserId(refreshToken, false);
        return generateAccessToken(userId, currentRoleFromDb);
    }

    // Backward-compatible aliases (optional, remove later)
    public Long extrackUserId(String token, Boolean isAccess) {
        return extractUserId(token, Boolean.TRUE.equals(isAccess));
    }

    public String genrateAccessToken(String userId) {
        return generateAccessToken(Long.parseLong(userId), "USER");
    }

    private Key getRefreshSigninKey() {
        return getRefreshSigningKey();
    }
}
