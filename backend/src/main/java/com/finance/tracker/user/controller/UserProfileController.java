package com.finance.tracker.user.controller;

import com.finance.tracker.common.dto.ApiResponse;
import com.finance.tracker.user.dto.UpdateUserProfileRequestDTO;
import com.finance.tracker.user.dto.UserProfileDTO;
import com.finance.tracker.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for user profile operations.
 * Uses unified UserService for both user and profile operations.
 */
@RestController
@RequestMapping("/api/v1/user-profile")
@RequiredArgsConstructor
public class UserProfileController {
    
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<UserProfileDTO>> getUserProfile(@RequestParam String userId) {
        // Get or create user profile - eliminates need for two API calls
        UserProfileDTO profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
    @PutMapping
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateUserProfile(
            @RequestParam String userId,
            @Valid @RequestBody UpdateUserProfileRequestDTO requestDTO) {
        UserProfileDTO updatedProfile = userService.updateUserProfile(userId, requestDTO);
        return ResponseEntity.ok(ApiResponse.success(updatedProfile));
    }
}

