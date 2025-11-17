package com.finance.tracker.category.controller;

import com.finance.tracker.category.dto.CategoryDTO;
import com.finance.tracker.category.dto.CreateCategoryRequestDTO;
import com.finance.tracker.category.dto.UpdateCategoryRequestDTO;
import com.finance.tracker.category.service.CategoryService;
import com.finance.tracker.common.dto.ApiResponse;
import com.finance.tracker.common.dto.PaginatedResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<PaginatedResponse<CategoryDTO>>> getCategories(
            @RequestParam String userId,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            @RequestParam(required = false) String searchTerm) {
        
        PaginatedResponse<CategoryDTO> paginatedResponse = 
                categoryService.getCategoriesPaginated(userId, page, size, searchTerm);
        return ResponseEntity.ok(ApiResponse.success(paginatedResponse));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(
            @RequestParam String userId,
            @Valid @RequestBody CreateCategoryRequestDTO requestDTO) {
        
        CategoryDTO createdCategory = categoryService.createUserCategory(userId, requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdCategory, HttpStatus.CREATED));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> updateCategory(
            @PathVariable String id,
            @RequestParam String userId,
            @Valid @RequestBody UpdateCategoryRequestDTO requestDTO) {
        
        CategoryDTO updatedCategory = categoryService.updateUserCategory(id, userId, requestDTO);
        return ResponseEntity.ok(ApiResponse.success(updatedCategory));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @PathVariable String id,
            @RequestParam String userId) {
        
        categoryService.deleteUserCategory(id, userId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}

