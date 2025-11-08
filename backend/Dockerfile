# Multi-stage Dockerfile for Spring Boot Application
# Stage 1: Build the application
FROM gradle:7.6.3-jdk17 AS build

# Set working directory
WORKDIR /app

# Copy build configuration files
COPY build.gradle .
COPY settings.gradle .

# Copy source code
COPY src/ src/

# Build the application using Gradle directly (skip tests for faster build)
# Using gradle command directly since we're in a Gradle image
RUN gradle bootJar --no-daemon -x test

# Find and rename the executable JAR (exclude -plain.jar)
RUN find /app/build/libs -name "finance-tracker-*.jar" ! -name "*-plain.jar" -exec mv {} /app/app.jar \;

# Stage 2: Create runtime image
FROM eclipse-temurin:17-jre-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Add metadata labels
LABEL maintainer="Finance Tracker"
LABEL description="Finance Tracker Spring Boot Application"

# Create app user for security (non-root)
RUN addgroup -S spring && adduser -S spring -G spring

# Set working directory
WORKDIR /app

# Copy the JAR from build stage
COPY --from=build /app/app.jar app.jar

# Change ownership to spring user
RUN chown spring:spring app.jar

# Switch to non-root user
USER spring:spring

# Expose port (Render will set PORT environment variable)
EXPOSE 8080

# Health check using curl
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8080}/finance-tracker/actuator/health || exit 1

# Run the application
# Render sets PORT environment variable, Spring Boot uses server.port
# Application properties already handle PORT/SERVER_PORT fallback
ENTRYPOINT ["sh", "-c", "java -jar app.jar"]

