package com.finance.tracker.auth.controller;

import com.finance.tracker.common.dto.ApiResponse;
import com.finance.tracker.user.dto.LoginRequestDTO;
import com.finance.tracker.user.dto.LoginResponseDTO;
import com.finance.tracker.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(
            @Valid @RequestBody LoginRequestDTO requestDTO) {
        LoginResponseDTO response = userService.login(requestDTO.getPhoneNumber());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

