package com.thaiglocal.webclient.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.thaiglocal.webclient.dto.request.ForgetPasswordRequest;
import com.thaiglocal.webclient.dto.request.RoleRequest;
import com.thaiglocal.webclient.dto.request.SignInRequest;
import com.thaiglocal.webclient.dto.request.SignUpRequest;
import com.thaiglocal.webclient.dto.request.UserRequest;
import com.thaiglocal.webclient.dto.response.SignInResponse;
import com.thaiglocal.webclient.dto.response.UserResponse;

import lombok.AllArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@AllArgsConstructor
public class UserService {
    @Autowired
    private final WebClient webClient;
    
    public Mono<SignInResponse> signIn(SignInRequest sinInRequest) {
        return webClient.post()
            .uri("/signin")
            .body(Mono.just(sinInRequest), SignInRequest.class)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, clientResponse ->
                clientResponse.bodyToMono(String.class)
                    .flatMap(errorBody -> Mono.error(new RuntimeException("Client error: " + errorBody)))
            )
            .onStatus(HttpStatusCode::is5xxServerError, serverResponse ->
                serverResponse.bodyToMono(String.class)
                    .flatMap(errorBody -> Mono.error(new RuntimeException("Server error: " + errorBody)))
            )
            .bodyToMono(SignInResponse.class)
            .onErrorMap(ex -> new RuntimeException("Network or timeout error: " + ex));
    }

    public Mono<UserResponse> signUp(SignUpRequest signUpRequest) {
        return webClient.post()
            .uri("/signup")
            .header("Content-Type", "application/json")
            .body(Mono.just(signUpRequest), SignUpRequest.class)
            .retrieve()
            .bodyToMono(UserResponse.class);
    }   

    public Mono<String> signOut() {
        return webClient.post()
            .uri("/signout")
            .retrieve()
            .bodyToMono(String.class);

    }

    public Mono<UserResponse> getMyProfile() {
        return webClient.get()
            .uri("/users/me")
            .header("Content-Type", "application/json")
            .retrieve()
            .bodyToMono(UserResponse.class);
    }

    public Mono<UserResponse> updateUser(UserRequest userRequest) {
        return webClient.patch()
            .uri("/users/me")
            .header("Content-Type", "application/json")
            .body(Mono.just(userRequest), UserRequest.class)
            .retrieve()
            .bodyToMono(UserResponse.class);
    }

    public Flux<UserResponse> getAllUsers() {
        return webClient.get()
            .uri("/admin/users")
            .header("Content-Type", "application/json")
            .retrieve()
            .bodyToFlux(UserResponse.class);
    }

    public Mono<UserResponse> adminUpdateUserByUserId(Long targetUserId, UserRequest request) {
        return webClient.patch()
            .uri("/admin/users/" + targetUserId)
            .header("Content-Type", "application/json")
            .body(Mono.just(request), UserRequest.class)
            .retrieve()
            .bodyToMono(UserResponse.class);
    }

    public Mono<UserResponse> grantAdminRole(Long targetUserId, RoleRequest roleRequest) {
        return webClient.patch()
            .uri("/admin/users/role/" + targetUserId)
            .header("Content-Type", "application/json")
            .body(Mono.just(roleRequest), RoleRequest.class)
            .retrieve()
            .bodyToMono(UserResponse.class);
    }

    public Mono<String> forgetPassword(ForgetPasswordRequest request) {
        return webClient.post()
            .uri("/forget-password")
            .header("Content-Type", "application/json")
            .body(Mono.just(request), ForgetPasswordRequest.class)
            .retrieve()
            .bodyToMono(String.class);
    }

    public Mono<Void> deleteUser(Long targetUserId) {
        return webClient.delete()
            .uri("/admin/users/" + targetUserId)
            .retrieve()
            .bodyToMono(Void.class);
    }
}
