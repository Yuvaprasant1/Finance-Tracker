package com.finance.tracker.config;

import io.mongock.runner.springboot.EnableMongock;
import org.springframework.context.annotation.Configuration;

/**
 * Mongock Configuration for database migrations.
 * 
 * Configuration properties (in application.properties):
 * - mongock.runner.enabled: Enable/disable Mongock (default: true)
 * - mongock.migration-scan-package: Package to scan for changelogs
 * 
 * Note: Mongock uses the MongoDB connection configured in application properties.
 * Connection retry and timeout are handled by MongoDB driver settings:
 * - spring.data.mongodb.option.connect-timeout-ms: Connection timeout (60000ms in prod)
 * - spring.data.mongodb.option.socket-timeout-ms: Socket timeout (60000ms in prod)
 * - spring.data.mongodb.option.server-selection-timeout-ms: Server selection timeout (30000ms in prod)
 * 
 * If Mongock fails to connect, verify:
 * 1. MongoDB Atlas Network Access is configured (whitelist IP addresses)
 * 2. MongoDB connection string is correct and includes SSL parameters
 * 3. Database user credentials are correct
 */
@Configuration
@EnableMongock
public class MongockConfig {
    // Mongock is enabled
    // Changelogs will be scanned from com.finance.tracker.currency.changelog package
    // Configuration is done via application.properties
    // 
    // Connection retry and timeout are handled by MongoDB driver configuration
    // See application-prod.properties for MongoDB connection pool settings
}

