package com.thaiglocal.server.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(
        HttpServletRequest request, 
        HttpServletResponse response, 
        FilterChain filterChain
    ) throws ServletException, IOException {
        String accessToken = null;
        String refreshToken = null;


        // 1. อ่านจาก Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            accessToken = authHeader.substring(7);
        }

        // 2. อ่านจาก cookie
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie: cookies) {
                if ("ACCESS_TOKEN".equals(cookie.getName())) {
                    accessToken = accessToken == null ? cookie.getValue() : accessToken;
                } else if ("REFRESH_TOKEN".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                }
            }
        }

        if (accessToken != null && jwtUtils.validateAccessToken(accessToken)) {
            authenticateUser(accessToken, true, request);
        } else if (refreshToken != null && jwtUtils.validateRefreshToken(refreshToken)) {
            Long userId = jwtUtils.extractUserId(refreshToken, false);
            UserDetails userDetails = customUserDetailsService.loadUserByUserId(userId);

            String currentRoleFromDb = userDetails.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("USER");
                
            String newAccessToken = jwtUtils.refreshAccessToken(refreshToken, currentRoleFromDb);

            Cookie newAccessCookie = new Cookie("ACCESS_TOKEN", newAccessToken);
            newAccessCookie.setHttpOnly(true);
            newAccessCookie.setSecure(false);
            newAccessCookie.setPath("/");
            response.addCookie(newAccessCookie);

            authenticateUser(newAccessToken, true, request);
        } else {
            System.out.println("[DEBUG] No valid token found, skipping authentication.");
        }

        filterChain.doFilter(request, response);
    }

    private void authenticateUser(String token, boolean isAccessToken, HttpServletRequest request) {
        Long userId = jwtUtils.extractUserId(token, isAccessToken);

        if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = customUserDetailsService.loadUserByUserId(userId);

            boolean isValid = isAccessToken ? jwtUtils.validateAccessToken(token) : jwtUtils.validateRefreshToken(token);

            if (isValid) {
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }

        }
    }
}
