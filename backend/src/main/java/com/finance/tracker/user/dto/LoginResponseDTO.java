package com.finance.tracker.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private String userId;
    private String phoneNumber;
    private String name;
    private String email;
    private String currency;
    private String address;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

