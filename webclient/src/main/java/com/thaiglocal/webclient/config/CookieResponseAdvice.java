package com.thaiglocal.webclient.config;

import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import com.thaiglocal.webclient.dto.response.SignInResponse;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Duration;

@RestControllerAdvice
public class CookieResponseAdvice implements ResponseBodyAdvice<Object> {

    private static final String ACCESS_TOKEN = "ACCESS_TOKEN";
    private static final String REFRESH_TOKEN = "REFRESH_TOKEN";

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                 Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                 org.springframework.http.server.ServerHttpRequest request,
                                 org.springframework.http.server.ServerHttpResponse response) {
        
        if (body instanceof SignInResponse signInResponse) {
            setAuthCookies(signInResponse.getAccessToken(), signInResponse.getRefreshToken());
        }
        
        return body;
    }

    private void setAuthCookies(String accessToken, String refreshToken) {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletResponse httpResponse = attributes.getResponse();
                if (httpResponse != null) {
                    
                    if (accessToken != null && !accessToken.isEmpty()) {
                        ResponseCookie accessCookie = ResponseCookie
                            .from(ACCESS_TOKEN, accessToken)
                            .httpOnly(true)
                            .secure(false)
                            .sameSite("Lax")
                            .path("/")
                            .maxAge(Duration.ofMinutes(15))
                            .build();
                        httpResponse.addHeader("Set-Cookie", accessCookie.toString());
                    }
                    
                    if (refreshToken != null && !refreshToken.isEmpty()) {
                        ResponseCookie refreshCookie = ResponseCookie
                            .from(REFRESH_TOKEN, refreshToken)
                            .httpOnly(true)
                            .secure(false)
                            .sameSite("Lax")
                            .path("/")
                            .maxAge(Duration.ofDays(7))
                            .build();
                        httpResponse.addHeader("Set-Cookie", refreshCookie.toString());
                    }
                }
            }
        } catch (Exception e) {
        }
    }
}