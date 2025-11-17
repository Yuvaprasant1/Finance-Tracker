import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '../../context/UserContext';
import { categoryService } from './category.service';
import { CategoryDTO } from './types';
import { Search, Plus, Edit2, Trash2, X, Loader2, Tag } from 'lucide-react';
import './CategoryDropdown.css';

export interface CategoryDropdownProps {
  value?: string;
  onChange: (categoryName: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

const DEBOUNCE_DELAY = 300;
const DEFAULT_PAGE_SIZE = 10;

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  value,
  onChange,
  placeholder = 'Select or search category',
  required = false,
  disabled = false,
  readOnly = false,
}) => {
  const { userId } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(0); // Reset to first page on new search
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load categories when dropdown opens or search term changes
  useEffect(() => {
    if (isOpen && userId) {
      loadCategories();
    }
  }, [isOpen, debouncedSearchTerm, currentPage, userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowAddInput(false);
        setEditingCategory(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const loadCategories = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await categoryService.getCategories(
        userId,
        currentPage,
        DEFAULT_PAGE_SIZE,
        debouncedSearchTerm || undefined
      );
      setCategories(response.content);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDropdown = () => {
    if (disabled || readOnly) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
      setDebouncedSearchTerm('');
      setCurrentPage(0);
    }
  };

  const handleSelectCategory = (category: CategoryDTO) => {
    onChange(category.name);
    setIsOpen(false);
    setSearchTerm('');
    setShowAddInput(false);
  };

  const handleAddCategory = async () => {
    if (!userId || !newCategoryName.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const newCategory = await categoryService.createCategory(userId, {
        name: newCategoryName.trim(),
      });
      onChange(newCategory.name);
      setNewCategoryName('');
      setShowAddInput(false);
      setIsOpen(false);
      // Reload categories
      await loadCategories();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to create category';
      setError(errorMessage);
      console.error('Error creating category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (category: CategoryDTO) => {
    if (category.isDefault) return; // Can't edit default categories
    setEditingCategory(category.id);
    setEditCategoryName(category.name);
  };

  const handleSaveEdit = async (categoryId: string) => {
    if (!userId || !editCategoryName.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const updatedCategory = await categoryService.updateCategory(categoryId, userId, {
        name: editCategoryName.trim(),
      });
      setEditingCategory(null);
      setEditCategoryName('');
      // Reload categories
      await loadCategories();
      // Update selected value if it was the edited category
      if (value === categories.find(c => c.id === categoryId)?.name) {
        onChange(updatedCategory.name);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to update category';
      setError(errorMessage);
      console.error('Error updating category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditCategoryName('');
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!userId) return;
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await categoryService.deleteCategory(categoryId, userId);
      // Reload categories
      await loadCategories();
      // Clear selection if deleted category was selected
      if (value === categoryName) {
        onChange('');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to delete category';
      setError(errorMessage);
      console.error('Error deleting category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const selectedCategory = categories.find(c => c.name === value);

  return (
    <div className="category-dropdown-wrapper" ref={dropdownRef}>
      <div
        className={`category-dropdown-trigger ${disabled || readOnly ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
        onClick={handleToggleDropdown}
      >
        <div className="category-dropdown-trigger-content">
          <Tag size={18} className="category-icon" />
          <span className="category-selected-text">
            {value || <span className="category-placeholder">{placeholder}</span>}
          </span>
        </div>
        {!readOnly && (
          <div className="category-dropdown-arrow">▼</div>
        )}
      </div>

      {isOpen && !readOnly && (
        <div className="category-dropdown-menu">
          {/* Search Input */}
          <div className="category-search-container">
            <Search size={16} className="category-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="category-search-input"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            {searchTerm && (
              <button
                className="category-search-clear"
                onClick={() => setSearchTerm('')}
                type="button"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Add New Category Input */}
          {showAddInput ? (
            <div className="category-add-container">
              <input
                type="text"
                className="category-add-input"
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCategory();
                  } else if (e.key === 'Escape') {
                    setShowAddInput(false);
                    setNewCategoryName('');
                  }
                }}
                autoFocus
              />
              <div className="category-add-actions">
                <button
                  className="category-add-save"
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim() || loading}
                  type="button"
                >
                  <Plus size={14} />
                </button>
                <button
                  className="category-add-cancel"
                  onClick={() => {
                    setShowAddInput(false);
                    setNewCategoryName('');
                  }}
                  type="button"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <button
              className="category-add-button"
              onClick={() => {
                setShowAddInput(true);
                setEditingCategory(null);
              }}
              type="button"
            >
              <Plus size={16} />
              Add New Category
            </button>
          )}

          {/* Error Message */}
          {error && (
            <div className="category-error">{error}</div>
          )}

          {/* Categories List */}
          <div className="category-list">
            {loading && categories.length === 0 ? (
              <div className="category-loading">
                <Loader2 size={20} className="spinning" />
                <span>Loading categories...</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="category-empty">
                <Tag size={20} />
                <span>No categories found</span>
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className={`category-item ${value === category.name ? 'selected' : ''} ${category.isDefault ? 'default' : ''}`}
                  onClick={() => !editingCategory && handleSelectCategory(category)}
                >
                  {editingCategory === category.id ? (
                    <div className="category-edit-container">
                      <input
                        type="text"
                        className="category-edit-input"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit(category.id);
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                        autoFocus
                      />
                      <div className="category-edit-actions">
                        <button
                          className="category-edit-save"
                          onClick={() => handleSaveEdit(category.id)}
                          disabled={!editCategoryName.trim() || loading}
                          type="button"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="category-edit-cancel"
                          onClick={handleCancelEdit}
                          type="button"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="category-item-content">
                        <Tag size={14} className="category-item-icon" />
                        <span className="category-item-name">{category.name}</span>
                        {category.isDefault && (
                          <span className="category-item-badge">Default</span>
                        )}
                      </div>
                      {!category.isDefault && (
                        <div className="category-item-actions">
                          <button
                            className="category-action-button edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(category);
                            }}
                            type="button"
                            title="Edit category"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="category-action-button delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category.id, category.name);
                            }}
                            type="button"
                            title="Delete category"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="category-pagination">
              <button
                className="category-pagination-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0 || loading}
                type="button"
              >
                Previous
              </button>
              <span className="category-pagination-info">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                className="category-pagination-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1 || loading}
                type="button"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;

