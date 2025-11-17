package com.finance.tracker.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AppleLoginRequest {
    @NotBlank
    private String identityToken;
    private String nonce;
}


