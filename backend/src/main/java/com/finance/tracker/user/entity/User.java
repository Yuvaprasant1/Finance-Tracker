package com.finance.tracker.user.entity;

import com.finance.tracker.common.entity.BaseEntity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity {

    @Id
    private String id;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phoneNumber;
    
    private Boolean isActive = true;
    
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;
    
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    @Indexed(unique = true)
    private String email;

    private Boolean emailVerified = false;
    
    @Size(max = 50, message = "Currency code must not exceed 50 characters")
    private String currency;
    
    @Size(max = 200, message = "Address must not exceed 200 characters")
    private String address;
    
    public User(String email) {
        this.email = email;
        this.isActive = true;
        this.currency = "INR"; // Default currency
    }
}

