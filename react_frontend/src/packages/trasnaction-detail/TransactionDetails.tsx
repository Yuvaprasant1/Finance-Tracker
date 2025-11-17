import React, { useState, FormEvent, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { transactionDetailsService } from './transactionDetails.service';
import { TransactionDTO, TransactionType } from '../transaction/types';
import CustomDatePicker from '../../components/DatePicker/DatePicker';
import CategoryDropdown from '../category/CategoryDropdown';
import { getCurrentDate, formatDateToISO } from '../../utils/dateUtils';
import { PlusCircle, DollarSign, FileText, Tag, Calendar, Save, X, IndianRupee, Edit, Receipt, ArrowUpDown } from 'lucide-react';
import './TransactionDetails.css';

/**
 * Component Mode Enum
 * Defines the operational mode of the Transaction Details component
 */
export enum TransactionDetailsMode {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  VIEW = 'VIEW'
}

/**
 * Transaction Details Component Props
 */
export interface TransactionDetailsProps {
  mode?: TransactionDetailsMode;
  expense?: TransactionDTO;
  onClose?: () => void;
  isModal?: boolean;
  onSaveSuccess?: (updatedTransaction?: TransactionDTO) => void;
  onCancelEdit?: () => void;
}

/**
 * Transaction Details Component
 * Handles creating, editing, and viewing transaction details with clear mode separation
 */
const TransactionDetails: React.FC<TransactionDetailsProps> = ({ mode: propMode, expense: propExpense, onClose, isModal = false, onSaveSuccess, onCancelEdit }) => {
  const { userId } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // ========== Mode Detection ==========
  // If props are provided, use them; otherwise, detect from location state
  const editData = location.state as { expense: TransactionDTO; isEdit: boolean } | null;
  const mode: TransactionDetailsMode = useMemo(() => {
    if (propMode) return propMode;
    if (editData?.isEdit && editData?.expense) return TransactionDetailsMode.EDIT;
    return TransactionDetailsMode.CREATE;
  }, [propMode, editData]);
  
  const transactionToEdit = propExpense || editData?.expense;

  // ========== Form State ==========
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<Date | null>(getCurrentDate());
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [loading, setLoadingLocal] = useState<boolean>(false);

  // ========== Initialize Form Based on Mode ==========
  useEffect(() => {
    if ((mode === TransactionDetailsMode.EDIT || mode === TransactionDetailsMode.VIEW) && transactionToEdit) {
      initializeEditMode(transactionToEdit);
    } else if (mode === TransactionDetailsMode.CREATE) {
      initializeCreateMode();
    }
  }, [mode, transactionToEdit]);

  /**
   * Initialize form fields for CREATE mode
   */
  const initializeCreateMode = (): void => {
    setAmount('');
    setDescription('');
    setCategory('');
    setDate(getCurrentDate());
    setTransactionType(TransactionType.EXPENSE);
  };

  /**
   * Initialize form fields for EDIT mode
   */
  const initializeEditMode = (transaction: TransactionDTO): void => {
    const formattedAmount = transaction.amount 
      ? parseFloat(transaction.amount.toString()).toFixed(2)
      : '';
    setAmount(formattedAmount);
    setDescription(transaction.description || '');
    setCategory(transaction.category || '');
    // Parse date - backend returns LocalDate (YYYY-MM-DD format)
    if (transaction.date) {
      const dateStr = typeof transaction.date === 'string' ? transaction.date : String(transaction.date);
      // Handle both YYYY-MM-DD format and ISO datetime format
      if (dateStr.includes('T')) {
        setDate(new Date(dateStr));
      } else {
        // Parse YYYY-MM-DD format
        const [year, month, day] = dateStr.split('-').map(Number);
        setDate(new Date(year, month - 1, day));
      }
    } else {
      setDate(getCurrentDate());
    }
    setTransactionType(transaction.transactionType ?? TransactionType.EXPENSE);
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
   * Handle CREATE transaction submission
   */
  const handleCreateTransaction = async (transactionData: {
    userId: string;
    amount: number;
    description?: string;
    category: string;
    date: string;
    transactionType: TransactionType;
  }): Promise<void> => {
    await transactionDetailsService.createTransaction(transactionData);
    alert('Transaction added successfully');
  };

  /**
   * Handle EDIT transaction submission
   */
  const handleUpdateTransaction = async (transactionData: {
    userId: string;
    amount: number;
    description?: string;
    category: string;
    date: string;
    transactionType: TransactionType;
  }): Promise<TransactionDTO> => {
    if (!transactionToEdit?.id) {
      throw new Error('Transaction ID is required for update');
    }
    const updatedTransaction = await transactionDetailsService.updateTransaction(transactionToEdit.id, userId!, transactionData);
    alert('Transaction updated successfully');
    return updatedTransaction;
  };

  /**
   * Main form submit handler - routes to appropriate handler based on mode
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // Prevent submission in VIEW mode
    if (mode === TransactionDetailsMode.VIEW) return;
    if (!validateForm() || !userId) return;

    setLoadingLocal(true);
    try {
      // Parse and round amount to 2 decimal places
      const parsedAmount = parseFloat(amount);
      const roundedAmount = Math.round(parsedAmount * 100) / 100;

      // Format date as YYYY-MM-DD (date only, no time) in IST
      const dateStr = formatDateToISO(date!);
      
      const transactionData = {
        userId,
        amount: roundedAmount,
        description: description.trim() || undefined,
        category: category.trim(),
        date: dateStr,
        transactionType: transactionType,
      };

      // Route to appropriate handler based on mode
      let updatedTransaction: TransactionDTO | undefined;
      if (mode === TransactionDetailsMode.EDIT) {
        updatedTransaction = await handleUpdateTransaction(transactionData);
      } else {
        await handleCreateTransaction(transactionData);
      }

      // If in modal mode, call onSaveSuccess callback instead of navigating
      if (isModal && onSaveSuccess) {
        onSaveSuccess(updatedTransaction);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      alert('Failed to save transaction. Please try again.');
    } finally {
      setLoadingLocal(false);
    }
  };

  // ========== Component Configuration Based on Mode ==========
  const modeConfig = useMemo(() => {
    if (mode === TransactionDetailsMode.VIEW) {
      return {
        title: 'View Transaction Details',
        icon: <Receipt size={28} className="header-icon" />,
        submitButtonText: '',
        submitButtonLoadingText: '',
        isReadOnly: true,
      };
    }
    if (mode === TransactionDetailsMode.EDIT) {
      return {
        title: 'Edit Transaction Details',
        icon: <Edit size={28} className="header-icon" />,
        submitButtonText: loading ? 'Updating...' : 'Update Transaction',
        submitButtonLoadingText: 'Updating...',
        isReadOnly: false,
      };
    }
    return {
      title: 'Add Transaction Details',
      icon: <PlusCircle size={28} className="header-icon" />,
      submitButtonText: loading ? 'Adding...' : 'Add Transaction',
      submitButtonLoadingText: 'Adding...',
      isReadOnly: false,
    };
  }, [mode, loading]);

  // ========== Render ==========
  // In VIEW mode (modal), userId is not required
  if (!userId && mode !== TransactionDetailsMode.VIEW) {
    return null;
  }

  return (
    <div className={`transaction-details-container ${isModal ? 'transaction-details-container-modal' : ''}`}>
      {!isModal && (
        <div className="transaction-details-header">
          <h1>
            {modeConfig.icon}
            {modeConfig.title}
          </h1>
        </div>
      )}

      <div className="transaction-details-content">
        <form onSubmit={handleSubmit} className="transaction-details-form">
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
              <Tag size={18} className="label-icon" />
              Category *
            </label>
            <CategoryDropdown
              value={category}
              onChange={(categoryName) => {
                if (!modeConfig.isReadOnly) setCategory(categoryName);
              }}
              placeholder="Select or search category"
              required={true}
              disabled={modeConfig.isReadOnly}
              readOnly={modeConfig.isReadOnly}
            />
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
              <Calendar size={18} className="label-icon" />
              Date *
            </label>
            <CustomDatePicker
              selected={date}
              onChange={(selectedDate) => {
                if (!modeConfig.isReadOnly) setDate(selectedDate);
              }}
              placeholder="Select transaction date"
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
              <label className={`transaction-type-option ${transactionType === TransactionType.EXPENSE ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="transactionType"
                  value="EXPENSE"
                  checked={transactionType === TransactionType.EXPENSE}
                  onChange={(e) => {
                    if (!modeConfig.isReadOnly) setTransactionType(TransactionType.EXPENSE);
                  }}
                  disabled={modeConfig.isReadOnly}
                />
                <span>Expense</span>
              </label>
              <label className={`transaction-type-option ${transactionType === TransactionType.INCOME ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="transactionType"
                  value="INCOME"
                  checked={transactionType === TransactionType.INCOME}
                  onChange={(e) => {
                    if (!modeConfig.isReadOnly) setTransactionType(TransactionType.INCOME);
                  }}
                  disabled={modeConfig.isReadOnly}
                />
                <span>Income</span>
              </label>
            </div>
            {modeConfig.isReadOnly && (
              <div className="transaction-type-display">
                <span className={`transaction-type-badge ${transactionType === TransactionType.INCOME ? 'income' : 'expense'}`}>
                  {transactionType ?? TransactionType.EXPENSE}
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
                      if (mode === TransactionDetailsMode.EDIT && onCancelEdit) {
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

export default TransactionDetails;

