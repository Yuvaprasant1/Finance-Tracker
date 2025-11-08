import React, { useState, FormEvent, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { expenseService } from './expense.service';
import { TransactionDTO } from '../../types';
import CustomDatePicker from '../../components/DatePicker/DatePicker';
import { getCurrentDate } from '../../utils/dateUtils';
import { PlusCircle, DollarSign, FileText, Tag, Calendar, Save, X, IndianRupee, Edit, Receipt, ArrowUpDown } from 'lucide-react';
import './Expense.css';

/**
 * Component Mode Enum
 * Defines the operational mode of the Expense component
 */
export enum ExpenseMode {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  VIEW = 'VIEW'
}

/**
 * Expense Component Props
 */
export interface ExpenseProps {
  mode?: ExpenseMode;
  expense?: TransactionDTO;
  onClose?: () => void;
  isModal?: boolean;
  onSaveSuccess?: (updatedExpense?: TransactionDTO) => void;
  onCancelEdit?: () => void;
}

/**
 * Expense Component
 * Handles creating, editing, and viewing expenses with clear mode separation
 */
const Expense: React.FC<ExpenseProps> = ({ mode: propMode, expense: propExpense, onClose, isModal = false, onSaveSuccess, onCancelEdit }) => {
  const { userId } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // ========== Mode Detection ==========
  // If props are provided, use them; otherwise, detect from location state
  const editData = location.state as { expense: TransactionDTO; isEdit: boolean } | null;
  const mode: ExpenseMode = useMemo(() => {
    if (propMode) return propMode;
    if (editData?.isEdit && editData?.expense) return ExpenseMode.EDIT;
    return ExpenseMode.CREATE;
  }, [propMode, editData]);
  
  const expenseToEdit = propExpense || editData?.expense;

  // ========== Form State ==========
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<Date | null>(getCurrentDate());
  const [transactionType, setTransactionType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [loading, setLoadingLocal] = useState<boolean>(false);

  // ========== Initialize Form Based on Mode ==========
  useEffect(() => {
    if ((mode === ExpenseMode.EDIT || mode === ExpenseMode.VIEW) && expenseToEdit) {
      initializeEditMode(expenseToEdit);
    } else if (mode === ExpenseMode.CREATE) {
      initializeCreateMode();
    }
  }, [mode, expenseToEdit]);

  /**
   * Initialize form fields for CREATE mode
   */
  const initializeCreateMode = (): void => {
    setAmount('');
    setDescription('');
    setCategory('');
    setDate(getCurrentDate());
    setTransactionType('EXPENSE');
  };

  /**
   * Initialize form fields for EDIT mode
   */
  const initializeEditMode = (expense: TransactionDTO): void => {
    const formattedAmount = expense.amount 
      ? parseFloat(expense.amount.toString()).toFixed(2)
      : '';
    setAmount(formattedAmount);
    setDescription(expense.description || '');
    setCategory(expense.category || '');
    setDate(expense.date ? new Date(expense.date) : getCurrentDate());
    setTransactionType(expense.transactionType || 'EXPENSE');
  };

  // ========== Form Validation ==========
  const validateForm = (): boolean => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return false;
    }
    if (!category || category.trim() === '') {
      alert('Please enter a category');
      return false;
    }
    if (!date) {
      alert('Please select a date');
      return false;
    }
    return true;
  };

  // ========== Submit Handlers ==========
  /**
   * Handle CREATE expense submission
   */
  const handleCreateExpense = async (expenseData: {
    userId: string;
    amount: number;
    description?: string;
    category: string;
    date: string;
    transactionType: 'INCOME' | 'EXPENSE';
  }): Promise<void> => {
    await expenseService.createExpense(expenseData);
    alert('Expense added successfully');
  };

  /**
   * Handle EDIT expense submission
   */
  const handleUpdateExpense = async (expenseData: {
    userId: string;
    amount: number;
    description?: string;
    category: string;
    date: string;
    transactionType: 'INCOME' | 'EXPENSE';
  }): Promise<TransactionDTO> => {
    if (!expenseToEdit?.id) {
      throw new Error('Expense ID is required for update');
    }
    const updatedExpense = await expenseService.updateExpense(expenseToEdit.id, userId!, expenseData);
    alert('Expense updated successfully');
    return updatedExpense;
  };

  /**
   * Main form submit handler - routes to appropriate handler based on mode
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // Prevent submission in VIEW mode
    if (mode === ExpenseMode.VIEW) return;
    if (!validateForm() || !userId) return;

    setLoadingLocal(true);
    try {
      // Parse and round amount to 2 decimal places
      const parsedAmount = parseFloat(amount);
      const roundedAmount = Math.round(parsedAmount * 100) / 100;

      const expenseData = {
        userId,
        amount: roundedAmount,
        description: description.trim() || undefined,
        category: category.trim(),
        date: date!.toISOString(),
        transactionType: transactionType,
      };

      // Route to appropriate handler based on mode
      let updatedExpense: TransactionDTO | undefined;
      if (mode === ExpenseMode.EDIT) {
        updatedExpense = await handleUpdateExpense(expenseData);
      } else {
        await handleCreateExpense(expenseData);
      }

      // If in modal mode, call onSaveSuccess callback instead of navigating
      if (isModal && onSaveSuccess) {
        onSaveSuccess(updatedExpense);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      alert('Failed to save expense. Please try again.');
    } finally {
      setLoadingLocal(false);
    }
  };

  // ========== Component Configuration Based on Mode ==========
  const modeConfig = useMemo(() => {
    if (mode === ExpenseMode.VIEW) {
      return {
        title: 'View Expense',
        icon: <Receipt size={28} className="header-icon" />,
        submitButtonText: '',
        submitButtonLoadingText: '',
        isReadOnly: true,
      };
    }
    if (mode === ExpenseMode.EDIT) {
      return {
        title: 'Edit Expense',
        icon: <Edit size={28} className="header-icon" />,
        submitButtonText: loading ? 'Updating...' : 'Update Expense',
        submitButtonLoadingText: 'Updating...',
        isReadOnly: false,
      };
    }
    return {
      title: 'Add Expense',
      icon: <PlusCircle size={28} className="header-icon" />,
      submitButtonText: loading ? 'Adding...' : 'Add Expense',
      submitButtonLoadingText: 'Adding...',
      isReadOnly: false,
    };
  }, [mode, loading]);

  // ========== Render ==========
  // In VIEW mode (modal), userId is not required
  if (!userId && mode !== ExpenseMode.VIEW) {
    return null;
  }

  return (
    <div className={`expense-container ${isModal ? 'expense-container-modal' : ''}`}>
      {!isModal && (
        <div className="expense-header">
          <h1>
            {modeConfig.icon}
            {modeConfig.title}
          </h1>
        </div>
      )}

      <div className="expense-content">
        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-group">
            <label className="form-label">
              <DollarSign size={18} className="label-icon" />
              Amount *
            </label>
            <div className="input-with-icon">
              <IndianRupee size={20} className="input-icon" />
              <input
                type="number"
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  if (modeConfig.isReadOnly) return;
                  // Allow free typing - don't format during input
                  setAmount(e.target.value);
                }}
                onBlur={(e) => {
                  if (modeConfig.isReadOnly) return;
                  // Format to 2 decimal places on blur
                  const value = e.target.value;
                  if (value && !isNaN(parseFloat(value))) {
                    const numValue = parseFloat(value);
                    if (numValue > 0) {
                      setAmount(numValue.toFixed(2));
                    }
                  }
                }}
                step="0.01"
                min="0.01"
                required
                readOnly={modeConfig.isReadOnly}
                disabled={modeConfig.isReadOnly}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FileText size={18} className="label-icon" />
              Description
            </label>
            <textarea
              className="form-input form-textarea"
              placeholder="Enter description (optional)"
              value={description}
              onChange={(e) => {
                if (!modeConfig.isReadOnly) setDescription(e.target.value);
              }}
              rows={3}
              readOnly={modeConfig.isReadOnly}
              disabled={modeConfig.isReadOnly}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Tag size={18} className="label-icon" />
              Category *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter category"
              value={category}
              onChange={(e) => {
                if (!modeConfig.isReadOnly) setCategory(e.target.value);
              }}
              required
              readOnly={modeConfig.isReadOnly}
              disabled={modeConfig.isReadOnly}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Calendar size={18} className="label-icon" />
              Date *
            </label>
            <CustomDatePicker
              selected={date}
              onChange={(selectedDate) => {
                if (!modeConfig.isReadOnly) setDate(selectedDate);
              }}
              placeholder="Select expense date"
              required
              maxDate={getCurrentDate()}
              disabled={modeConfig.isReadOnly}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <ArrowUpDown size={18} className="label-icon" />
              Transaction Type *
            </label>
            <div className="transaction-type-options">
              <label className={`transaction-type-option ${transactionType === 'EXPENSE' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="transactionType"
                  value="EXPENSE"
                  checked={transactionType === 'EXPENSE'}
                  onChange={(e) => {
                    if (!modeConfig.isReadOnly) setTransactionType(e.target.value as 'INCOME' | 'EXPENSE');
                  }}
                  disabled={modeConfig.isReadOnly}
                />
                <span>Expense</span>
              </label>
              <label className={`transaction-type-option ${transactionType === 'INCOME' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="transactionType"
                  value="INCOME"
                  checked={transactionType === 'INCOME'}
                  onChange={(e) => {
                    if (!modeConfig.isReadOnly) setTransactionType(e.target.value as 'INCOME' | 'EXPENSE');
                  }}
                  disabled={modeConfig.isReadOnly}
                />
                <span>Income</span>
              </label>
            </div>
            {modeConfig.isReadOnly && (
              <div className="transaction-type-display">
                <span className={`transaction-type-badge ${transactionType === 'INCOME' ? 'income' : 'expense'}`}>
                  {transactionType || 'EXPENSE'}
                </span>
              </div>
            )}
          </div>

          {!modeConfig.isReadOnly && (
            <div className="form-actions">
              {isModal ? (
                <>
                  <button
                    type="submit"
                    className="submit-button-icon"
                    disabled={loading}
                    title={loading ? modeConfig.submitButtonLoadingText : modeConfig.submitButtonText}
                    aria-label={modeConfig.submitButtonText}
                  >
                    <Save size={20} />
                  </button>
                  <button
                    type="button"
                    className="cancel-button-icon"
                    onClick={() => {
                      if (mode === ExpenseMode.EDIT && onCancelEdit) {
                        onCancelEdit();
                      } else if (onClose) {
                        onClose();
                      }
                    }}
                    title="Cancel"
                    aria-label="Cancel"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={loading}
                  >
                    <Save size={20} />
                    {modeConfig.submitButtonText}
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => navigate('/dashboard')}
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
          {modeConfig.isReadOnly && (
            <div className="form-actions">
              {isModal ? (
                <button
                  type="button"
                  className="cancel-button-icon"
                  onClick={() => {
                    if (onClose) {
                      onClose();
                    }
                  }}
                  title="Close"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              ) : (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => navigate('/dashboard')}
                >
                  <X size={20} />
                  Close
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Expense;

