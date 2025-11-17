package com.finance.tracker.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

import jakarta.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Configuration
public class FirebaseConfig {


    private static final Logger log = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${spring.application.name:finance-tracker}")
    private String applicationName;

    @Value("${auth.firebase.credentialsBase64:}")
    private String firebaseCredentialsBase64;
    @Value("${auth.firebase.credentialsPath:}")
    private String firebaseCredentialsPath;

    @PostConstruct
    public void initializeFirebase() {
        if (!FirebaseApp.getApps().isEmpty()) {
            log.info("Firebase already initialized. Skipping re-initialization.");
            return;
        }
        try (InputStream credentialsStream = resolveCredentialsStream()) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(credentialsStream))
                    .build();
            FirebaseApp.initializeApp(options);
            log.info("Firebase initialized successfully for application '{}'", applicationName);
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to initialize Firebase Admin SDK", ex);
        }
    }

    private InputStream resolveCredentialsStream() throws Exception {
        if (firebaseCredentialsBase64 != null && !firebaseCredentialsBase64.isBlank()) {
            log.info("Initializing Firebase using Base64 credentials from property 'auth.firebase.credentialsBase64'.");
            byte[] decoded = java.util.Base64.getDecoder().decode(firebaseCredentialsBase64);
            return new ByteArrayInputStream(decoded);
        }
        if (firebaseCredentialsPath != null && !firebaseCredentialsPath.isBlank()) {
            if (firebaseCredentialsPath.startsWith("classpath:")) {
                String resourcePath = firebaseCredentialsPath.substring("classpath:".length());
                log.info("Initializing Firebase using credentials from classpath resource '{}'", resourcePath);
                return new ClassPathResource(resourcePath).getInputStream();
            } else {
                log.info("Initializing Firebase using credentials file from property 'auth.firebase.credentialsPath': {}", firebaseCredentialsPath);
                return new FileInputStream(firebaseCredentialsPath);
            }
        }
        String gacPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
        if (gacPath != null && !gacPath.isBlank()) {
            log.info("Initializing Firebase using credentials file from env 'GOOGLE_APPLICATION_CREDENTIALS': {}", gacPath);
            return new FileInputStream(gacPath);
        }
        throw new IllegalStateException(
                "Firebase credentials not provided. Configure one of: " +
                "1) property 'auth.firebase.credentialsBase64' (Base64 of service account JSON), " +
                "2) property 'auth.firebase.credentialsPath' (file path), " +
                "3) env 'GOOGLE_APPLICATION_CREDENTIALS' (file path).");
    }
}


