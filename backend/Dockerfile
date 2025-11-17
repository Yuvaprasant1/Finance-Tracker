FROM eclipse-temurin:17-jdk AS builder

WORKDIR /app

COPY build.gradle settings.gradle ./
COPY gradle ./gradle
COPY gradlew ./
RUN chmod +x ./gradlew

COPY src ./src

RUN echo "=== Starting Gradle Build ===" && \
    ./gradlew clean build -x test --info --stacktrace && \
    echo "=== Gradle Build Complete ===" && \
    ls -lh build/libs/ && \
    echo "=== JAR Files Listed ==="

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

RUN echo "=== Application JAR Ready ===" && \
    ls -lh /app/app.jar && \
    echo "=== Starting Application ==="

ENTRYPOINT ["java", "-jar", "/app/app.jar"]

