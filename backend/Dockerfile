# -------------------------------
# 1. BUILD STAGE (Gradle + JDK)
# -------------------------------
    FROM gradle:8.7-jdk17 AS builder
    WORKDIR /app
    
    # Copy everything
    COPY . .
    
    # Build without tests
    RUN gradle build -x test
    
    
    # -------------------------------
    # 2. RUNTIME STAGE (Small JDK image)
    # -------------------------------
    FROM eclipse-temurin:17-jdk
    WORKDIR /app
    
    # Copy ONLY the final JAR from builder image
    COPY --from=builder /app/build/libs/*.jar app.jar
    
    EXPOSE 8080
    
    ENTRYPOINT ["java", "-jar", "app.jar"]
        