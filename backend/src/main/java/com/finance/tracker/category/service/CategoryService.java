package com.finance.tracker.category.service;

import com.finance.tracker.category.dto.CategoryDTO;
import com.finance.tracker.category.dto.CreateCategoryRequestDTO;
import com.finance.tracker.category.dto.UpdateCategoryRequestDTO;
import com.finance.tracker.category.entity.DefaultCategory;
import com.finance.tracker.category.entity.UserCategory;
import com.finance.tracker.category.exception.CategoryNotFoundException;
import com.finance.tracker.category.exception.CategoryValidationException;
import com.finance.tracker.category.mapper.CategoryMapper;
import com.finance.tracker.category.repository.DefaultCategoryRepository;
import com.finance.tracker.category.repository.UserCategoryRepository;
import com.finance.tracker.common.dto.PaginatedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    
    private final DefaultCategoryRepository defaultCategoryRepository;
    private final UserCategoryRepository userCategoryRepository;
    private final CategoryMapper categoryMapper;
    
    /**
     * Get paginated categories combining default and user categories
     * Filters by search term if provided
     */
    public PaginatedResponse<CategoryDTO> getCategoriesPaginated(
            String userId, int page, int size, String searchTerm) {
        
        List<CategoryDTO> allCategories = new ArrayList<>();
        
        // Get default categories
        List<DefaultCategory> defaultCategories;
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            defaultCategories = defaultCategoryRepository
                    .findByNameContainingIgnoreCaseAndIsActiveTrue(searchTerm.trim());
        } else {
            defaultCategories = defaultCategoryRepository.findByIsActiveTrue();
        }
        allCategories.addAll(categoryMapper.toDTOListFromDefault(defaultCategories));
        
        // Get user categories
        List<UserCategory> userCategories;
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            userCategories = userCategoryRepository
                    .findByUserIdAndNameContainingIgnoreCaseAndIsActiveTrue(userId, searchTerm.trim());
        } else {
            userCategories = userCategoryRepository.findByUserIdAndIsActiveTrue(userId);
        }
        allCategories.addAll(categoryMapper.toDTOListFromUser(userCategories));
        
        // Sort by name (case-insensitive)
        allCategories.sort((a, b) -> a.getName().compareToIgnoreCase(b.getName()));
        
        // Manual pagination
        int start = page * size;
        int end = Math.min(start + size, allCategories.size());
        List<CategoryDTO> paginatedContent = allCategories.subList(
                Math.min(start, allCategories.size()),
                end
        );
        
        int totalPages = (int) Math.ceil((double) allCategories.size() / size);
        
        PaginatedResponse<CategoryDTO> response = new PaginatedResponse<>(
                paginatedContent,
                page,
                size,
                allCategories.size()
        );
        response.setTotalPages(totalPages);
        response.setFirst(page == 0);
        response.setLast(page >= totalPages - 1);
        
        return response;
    }
    
    /**
     * Create a new user category
     * Validates name format and checks for duplicates (case-insensitive)
     */
    @Transactional
    public CategoryDTO createUserCategory(String userId, CreateCategoryRequestDTO requestDTO) {
        String name = requestDTO.getName().trim();
        
        // Validate name format (already validated at DTO level, but double-check)
        if (!name.matches("^[a-zA-Z0-9\\s]+$")) {
            throw CategoryValidationException.invalidCharacters();
        }
        
        // Check for duplicate in user categories (case-insensitive)
        if (userCategoryRepository.findByUserIdAndNameIgnoreCaseAndIsActiveTrue(userId, name).isPresent()) {
            throw CategoryValidationException.duplicateName(name);
        }
        
        // Check if a default category with same name exists (case-insensitive)
        if (defaultCategoryRepository.findByNameIgnoreCase(name).isPresent()) {
            throw CategoryValidationException.duplicateName(name);
        }
        
        UserCategory userCategory = new UserCategory(userId, name);
        UserCategory savedCategory = userCategoryRepository.save(userCategory);
        return categoryMapper.toDTO(savedCategory);
    }
    
    /**
     * Update an existing user category
     * Validates name format and checks for duplicates (case-insensitive)
     */
    @Transactional
    public CategoryDTO updateUserCategory(String categoryId, String userId, UpdateCategoryRequestDTO requestDTO) {
        UserCategory userCategory = userCategoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> CategoryNotFoundException.byId(categoryId));
        
        String newName = requestDTO.getName().trim();
        
        // Validate name format
        if (!newName.matches("^[a-zA-Z0-9\\s]+$")) {
            throw CategoryValidationException.invalidCharacters();
        }
        
        // Check for duplicate in user categories (case-insensitive, excluding current category)
        userCategoryRepository.findByUserIdAndNameIgnoreCaseAndIsActiveTrue(userId, newName)
                .ifPresent(existing -> {
                    if (!existing.getId().equals(categoryId)) {
                        throw CategoryValidationException.duplicateName(newName);
                    }
                });
        
        // Check if a default category with same name exists (case-insensitive)
        if (defaultCategoryRepository.findByNameIgnoreCase(newName).isPresent()) {
            throw CategoryValidationException.duplicateName(newName);
        }
        
        userCategory.setName(newName);
        UserCategory savedCategory = userCategoryRepository.save(userCategory);
        return categoryMapper.toDTO(savedCategory);
    }
    
    /**
     * Delete a user category (hard delete)
     */
    @Transactional
    public void deleteUserCategory(String categoryId, String userId) {
        UserCategory userCategory = userCategoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> CategoryNotFoundException.byId(categoryId));
        
        userCategoryRepository.delete(userCategory);
    }
}

