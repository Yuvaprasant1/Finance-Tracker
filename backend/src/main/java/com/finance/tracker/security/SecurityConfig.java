package com.finance.tracker.security;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SecurityConfig {

    @Bean
    public FilterRegistrationBean<FirebaseIdTokenFilter> firebaseIdTokenFilterRegistration() {
        FilterRegistrationBean<FirebaseIdTokenFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new FirebaseIdTokenFilter());
        registration.addUrlPatterns("/api/v1/*");
        registration.setOrder(1);
        return registration;
    }
}


