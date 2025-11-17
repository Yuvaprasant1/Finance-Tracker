package com.finance.tracker.category.mapper;

import com.finance.tracker.category.dto.CategoryDTO;
import com.finance.tracker.category.entity.DefaultCategory;
import com.finance.tracker.category.entity.UserCategory;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CategoryMapper {
    
    public CategoryDTO toDTO(DefaultCategory defaultCategory) {
        if (defaultCategory == null) {
            return null;
        }
        
        CategoryDTO dto = new CategoryDTO();
        dto.setId(defaultCategory.getId());
        dto.setName(defaultCategory.getName());
        dto.setIsDefault(true);
        dto.setIsActive(defaultCategory.getIsActive());
        
        return dto;
    }
    
    public CategoryDTO toDTO(UserCategory userCategory) {
        if (userCategory == null) {
            return null;
        }
        
        CategoryDTO dto = new CategoryDTO();
        dto.setId(userCategory.getId());
        dto.setName(userCategory.getName());
        dto.setIsDefault(false);
        dto.setIsActive(userCategory.getIsActive());
        
        return dto;
    }
    
    public List<CategoryDTO> toDTOListFromDefault(List<DefaultCategory> defaultCategories) {
        if (defaultCategories == null) {
            return null;
        }
        return defaultCategories.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<CategoryDTO> toDTOListFromUser(List<UserCategory> userCategories) {
        if (userCategories == null) {
            return null;
        }
        return userCategories.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}

