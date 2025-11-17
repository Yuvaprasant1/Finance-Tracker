package com.finance.tracker.category.entity;

import com.finance.tracker.common.entity.BaseEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user_categories")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class UserCategory extends BaseEntity {

    @Id
    private String id;

    @NotBlank(message = "User ID is required")
    @Indexed
    private String userId;

    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name must not exceed 100 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\\s]+$", message = "Category name must contain only alphanumeric characters and spaces")
    @Indexed
    private String name;
    
    private Boolean isActive = true;
    
    public UserCategory(String userId, String name) {
        this.userId = userId;
        this.name = name;
        this.isActive = true;
    }
}

