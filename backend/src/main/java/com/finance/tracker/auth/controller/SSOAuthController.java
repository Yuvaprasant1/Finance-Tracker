package com.finance.tracker.auth.controller;

import com.finance.tracker.auth.dto.GoogleLoginRequest;
import com.finance.tracker.auth.dto.SSOLoginResponse;
import com.finance.tracker.auth.service.FirebaseAuthService;
import com.finance.tracker.auth.service.GoogleTokenVerifier;
import com.finance.tracker.common.dto.ApiResponse;
import com.finance.tracker.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class SSOAuthController {

    private final GoogleTokenVerifier googleTokenVerifier;
    private final FirebaseAuthService firebaseAuthService;
    private final UserService userService;

    @PostMapping("/login/google")
    public ResponseEntity<ApiResponse<SSOLoginResponse>> loginWithGoogle(
            @Valid @RequestBody GoogleLoginRequest request
    ) {
        // Verify Google token
        var verified = googleTokenVerifier.verify(request.getIdToken());
        
        // Get or create Firebase user and extract Firebase UID
        String firebaseUid = firebaseAuthService.getOrCreateFirebaseUid(verified.email());
        
        // Create user in our database if not exists, or get existing user ID
        String userId = userService.createUserIfNotExists(
            firebaseUid,
            verified.email(),
            verified.name()
        );
        
        // Return user ID (Firebase UID as String) and email
        SSOLoginResponse response = new SSOLoginResponse(userId, verified.email());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}


