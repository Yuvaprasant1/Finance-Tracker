package com.finance.tracker.user.service;

import com.finance.tracker.user.dto.LoginResponseDTO;
import com.finance.tracker.user.dto.UpdateUserProfileRequestDTO;
import com.finance.tracker.user.dto.UserProfileDTO;
import com.finance.tracker.user.entity.User;
import com.finance.tracker.user.exception.CurrencyEditNotAllowedException;
import com.finance.tracker.user.exception.UserNotFoundException;
import com.finance.tracker.user.mapper.UserProfileMapper;
import com.finance.tracker.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

/**
 * Unified service for User operations.
 * Handles all user-related business logic using UserProfileRepository.
 */
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserProfileRepository userProfileRepository;
    private final UserProfileMapper userProfileMapper;
    
    // ========== Login Operations ==========
    
    /**
     * Login with phone number. Generates UUID on backend and creates user if not exists.
     * Returns user data with generated UUID.
     */
    @Transactional
    public LoginResponseDTO login(String phoneNumber) {
        Optional<User> existingUser = userProfileRepository.findByPhoneNumber(phoneNumber);
        
        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            // Create new user with generated UUID
            user = new User(phoneNumber);
            user.setId(UUID.randomUUID());
            user = userProfileRepository.save(user);
        }
        
        return userProfileMapper.toLoginResponseDTO(user);
    }
    
    // ========== User Profile Operations ==========
    
    /**
     * Get user profile by userId. Throws exception if user doesn't exist.
     */
    @Transactional
    public UserProfileDTO getUserProfile(String userId) {
        User user = userProfileRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> UserNotFoundException.byId(userId));
        return userProfileMapper.toDTO(user);
    }
    /**
     * Update user profile. Throws exception if user doesn't exist.
     */
    @Transactional
    public UserProfileDTO updateUserProfile(String userId, UpdateUserProfileRequestDTO requestDTO) {
        User user = userProfileRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> UserNotFoundException.byId(userId));
        // Only allow currency change if user has no expenses
        if (requestDTO.getCurrency() != null) {
            throw new CurrencyEditNotAllowedException();
        }
        
        // Update fields using mapper
        userProfileMapper.updateEntityFromDTO(user, requestDTO);
        
        User savedUser = userProfileRepository.save(user);
        return userProfileMapper.toDTO(savedUser);
    }
    
    /**
     * Get user by ID. Used by ExpenseService.
     */
    public User getUserById(String userId) {
        return userProfileRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> UserNotFoundException.byId(userId));
    }
}


