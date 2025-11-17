package com.finance.tracker.user.mapper;

import com.finance.tracker.user.dto.CreateUserProfileRequestDTO;
import com.finance.tracker.user.dto.LoginResponseDTO;
import com.finance.tracker.user.dto.UpdateUserProfileRequestDTO;
import com.finance.tracker.user.dto.UserProfileDTO;
import com.finance.tracker.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserProfileMapper {
    
    public UserProfileDTO toDTO(User user) {
        if (user == null) {
            return null;
        }
        
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setCurrency(user.getCurrency());
        dto.setAddress(user.getAddress());
        dto.setCanEditCurrency(false);
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        
        return dto;
    }
    
    public LoginResponseDTO toLoginResponseDTO(User user) {
        if (user == null) {
            return null;
        }
        
        LoginResponseDTO dto = new LoginResponseDTO();
        dto.setUserId(user.getId());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setCurrency(user.getCurrency());
        dto.setAddress(user.getAddress());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        
        return dto;
    }
    
    public void updateEntityFromDTO(User user, UpdateUserProfileRequestDTO dto) {
        if (user == null || dto == null) {
            return;
        }
        
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setAddress(dto.getAddress());
        if (dto.getCurrency() != null) {
            user.setCurrency(dto.getCurrency());
        }
    }
    
    public User toEntityFromCreateDTO(CreateUserProfileRequestDTO dto, String userId) {
        if (dto == null) {
            return null;
        }
        
        User user = new User();
        if (userId != null && !userId.isEmpty()) {
            user.setId(userId);
        }
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setCurrency(dto.getCurrency() != null && !dto.getCurrency().isEmpty() 
                ? dto.getCurrency() : "INR");
        user.setAddress(dto.getAddress());
        user.setIsActive(true);
        
        return user;
    }
}

