package com.finance.tracker.user.service;

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

/**
 * Unified service for User operations.
 * Handles all user-related business logic using UserProfileRepository.
 */
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserProfileRepository userProfileRepository;
    private final UserProfileMapper userProfileMapper;

    // ========== User Profile Operations ==========
    
    /**
     * Get user profile by userId. Throws exception if user doesn't exist.
     */
    @Transactional
    public UserProfileDTO getUserProfile(String userId) {
        User user = userProfileRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.byId(userId));
        return userProfileMapper.toDTO(user);
    }
    /**
     * Update user profile. Throws exception if user doesn't exist.
     */
    @Transactional
    public UserProfileDTO updateUserProfile(String userId, UpdateUserProfileRequestDTO requestDTO) {
        User user = userProfileRepository.findById(userId)
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
        return userProfileRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.byId(userId));
    }
    
    /**
     * Create user if not exists, or return existing user's ID.
     * Uses Firebase UID as the primary key (String).
     * 
     * @param firebaseUid Firebase UID string (stored directly as String)
     * @param email User email address
     * @param name User display name (optional, defaults to email prefix if null)
     * @return User ID as String (Firebase UID) of the user (existing or newly created)
     */
    @Transactional
    public String createUserIfNotExists(String firebaseUid, String email, String name) {
        // First, check if user already exists by Firebase UID
        Optional<User> existingUser = userProfileRepository.findById(firebaseUid);
        if (existingUser.isPresent()) {
            return existingUser.get().getId();
        }
        
        // Also check by email as fallback
        Optional<User> existingByEmail = userProfileRepository.findByEmail(email);
        if (existingByEmail.isPresent()) {
            return existingByEmail.get().getId();
        }
        
        // User doesn't exist, create new user
        User newUser = new User();
        newUser.setId(firebaseUid); // Use Firebase UID directly as String
        newUser.setEmail(email);
        newUser.setName(name != null && !name.isBlank() ? name : (email != null ? email.split("@")[0] : "User"));
        newUser.setCurrency("INR"); // Default currency
        newUser.setIsActive(true);
        newUser.setEmailVerified(true); // Google SSO means email is verified
        
        User savedUser = userProfileRepository.save(newUser);
        return savedUser.getId();
    }
}


