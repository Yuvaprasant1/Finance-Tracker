package com.finance.tracker.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SSOLoginResponse {
    private String userId; // Firebase UID as String
    private String email;
}

