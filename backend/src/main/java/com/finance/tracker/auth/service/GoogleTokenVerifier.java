package com.finance.tracker.auth.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class GoogleTokenVerifier {

    private final GoogleIdTokenVerifier verifier;

    public GoogleTokenVerifier(@Value("${auth.google.clientIds}") List<String> allowedClientIds) {
        this.verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(allowedClientIds)
                .build();
    }

    public VerifiedGoogleToken verify(String idTokenString) {
        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new IllegalArgumentException("Invalid Google ID token");
            }
            GoogleIdToken.Payload payload = idToken.getPayload();
            String userId = payload.getSubject();
            String email = payload.getEmail();
            boolean emailVerified = Boolean.TRUE.equals(payload.getEmailVerified());
            String name = (String) payload.get("name");
            String picture = (String) payload.get("picture");

            return new VerifiedGoogleToken(userId, email, emailVerified, name, picture, payload.getIssuer(), payload.getAudience());
        } catch (Exception ex) {
            throw new IllegalArgumentException("Failed to verify Google ID token", ex);
        }
    }

    public record VerifiedGoogleToken(
            String userId,
            String email,
            boolean emailVerified,
            String name,
            String picture,
            String issuer,
            Object audience
    ) {}
}


