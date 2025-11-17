package com.finance.tracker.auth.service;

import com.google.firebase.auth.AuthErrorCode;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class FirebaseAuthService {
    /**
     * Try to find an existing Firebase user by email and return its UID.
     * If not found, create a new Firebase user (letting Firebase assign UID) and return that UID.
     * Returns null if email is blank or null.
     */
    private String resolveOrCreateUidForEmail(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }
        try {
            UserRecord user = FirebaseAuth.getInstance().getUserByEmail(email);
            return user.getUid();
        } catch (FirebaseAuthException ex) {
            throw new IllegalStateException("Failed to look up Firebase user by email: " + email, ex);
        }
    }
    
    /**
     * Get or create Firebase UID for email.
     * Public method to be used by SSOAuthController.
     * 
     * @param email User email address
     * @return Firebase UID as String
     */
    public String getOrCreateFirebaseUid(String email) {
        return resolveOrCreateUidForEmail(email);
    }
}


