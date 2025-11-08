package com.finance.tracker.config;

import io.mongock.runner.springboot.EnableMongock;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableMongock
public class MongockConfig {
    // Mongock is enabled
    // Changelogs will be scanned from com.finance.tracker.currency.changelog package
    // Configuration is done via application.properties
}

