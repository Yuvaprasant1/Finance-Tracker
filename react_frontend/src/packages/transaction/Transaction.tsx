import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { transactionService } from './transaction.service';
import { TransactionDTO, TransactionType } from './types';
import { formatDateWithTime, formatAmount } from '../../utils/formatters';
import { Receipt, RefreshCw, Trash2, Calendar, Tag, ArrowLeft, Plus, Edit, TrendingUp, TrendingDown } from 'lucide-react';
import Pagination from '../../components/Pagination/Pagination';
import Modal from '../../components/Modal/Modal';
import TransactionDetails, { TransactionDetailsMode } from '../trasnaction-detail/TransactionDetails';
import './Transaction.css';

const Transaction: React.FC = () => {
  const { userId } = useUser();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [loading, setLoadingLocal] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDTO | null>(null);
  const [modalMode, setModalMode] = useState<TransactionDetailsMode>(TransactionDetailsMode.VIEW);

  useEffect(() => {
    if (userId) {
      loadTransactions(currentPage);
    }
  }, [userId, currentPage]);

  const loadTransactions = async (page: number): Promise<void> => {
    if (!userId) return;

    try {
      setLoadingLocal(true);
      // Loading state is automatically managed by ApiService interceptors with default "Loading..." message
      const paginatedResponse = await transactionService.getAllTransactions(userId, page, pageSize);
      setTransactions(paginatedResponse.content as TransactionDTO[]);
      setTotalPages(paginatedResponse.totalPages);
      setTotalElements(paginatedResponse.totalElements);
    } catch (error) {
      alert('Failed to load transactions. Please check your connection.');
    } finally {
      setLoadingLocal(false);
      setRefreshing(false);
    }
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onRefresh = (): void => {
    setRefreshing(true);
    loadTransactions(currentPage);
  };

  const handleView = (transaction: TransactionDTO): void => {
    setSelectedTransaction(transaction);
    setModalMode(TransactionDetailsMode.VIEW);
    setViewModalOpen(true);
  };

  const handleDoubleClick = (transaction: TransactionDTO): void => {
    setSelectedTransaction(transaction);
    setModalMode(TransactionDetailsMode.VIEW);
    setViewModalOpen(true);
  };

  const handleEditInModal = (): void => {
    setModalMode(TransactionDetailsMode.EDIT);
  };

  const handleDeleteInModal = async (): Promise<void> => {
    if (!userId || !selectedTransaction) return;
    
    const descriptionText = selectedTransaction.description || 'this expense';
    if (window.confirm(`Are you sure you want to delete "${descriptionText}"?`)) {
      try {
        // Loading state is automatically managed by ApiService interceptors with default "Loading..." message
        await transactionService.deleteTransaction(selectedTransaction.id, userId);
        // Close modal
        handleCloseViewModal();
        // Reload current page, or go to previous page if current page becomes empty
        const newPage = transactions.length === 1 && currentPage > 0 
          ? currentPage - 1 
          : currentPage;
        setCurrentPage(newPage);
        loadTransactions(newPage);
      } catch (error) {
        alert('Failed to delete transaction. Please try again.');
      }
    }
  };

  const handleCloseViewModal = (): void => {
    setViewModalOpen(false);
    setSelectedTransaction(null);
    setModalMode(TransactionDetailsMode.VIEW);
  };

  const handleSaveSuccess = (updatedTransaction?: TransactionDTO): void => {
    // Reload transactions after successful save
    loadTransactions(currentPage);
    // Update selected transaction if provided
    if (updatedTransaction) {
      setSelectedTransaction(updatedTransaction);
    }
    // Switch back to view mode
    setModalMode(TransactionDetailsMode.VIEW);
  };

  const handleCancelEdit = (): void => {
    // Switch back to view mode
    setModalMode(TransactionDetailsMode.VIEW);
  };

  const handleAddExpense = (): void => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = (): void => {
    setCreateModalOpen(false);
  };

  const handleCreateSuccess = (): void => {
    // Reload transactions after successful create
    loadTransactions(currentPage);
    // Close the create modal
    setCreateModalOpen(false);
  };

  if (!userId) {
    return null;
  }

  if (loading && transactions.length === 0) {
    return (
      <div className="transaction-container">
        <div className="transaction-header">
          <h1>
            <Receipt size={20} className="header-icon" />
            All Transactions
          </h1>
          <button onClick={() => navigate('/dashboard')} className="back-button">
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>
        <p className="loading-text">Loading transactions...</p>
      </div>
    );
  }

  return (
      <div className="transaction-container">
        <div className="transaction-header">
          <h1>
            <Receipt size={20} className="header-icon" />
            All Transactions
          </h1>
          <div className="header-actions">
            <button 
              onClick={handleAddExpense} 
              className="refresh-button-icon" 
              title="Add expense"
            >
              <Plus size={18} />
            </button>
            <button 
              onClick={onRefresh} 
              className="refresh-button-icon" 
              disabled={refreshing}
              title="Refresh transactions"
            >
              <RefreshCw size={18} className={refreshing ? 'spinning' : ''} />
            </button>
          </div>
        </div>

      {transactions.length === 0 ? (
        <div className="empty-container">
          <Receipt size={48} className="empty-icon" />
          <p className="empty-text">No transactions found</p>
          <button
            className="add-button"
            onClick={handleAddExpense}
          >
            <Plus size={20} />
            Add Your First Transaction
          </button>
        </div>
      ) : (
        <>
          <div className="transaction-list">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className={`transaction-item ${((transaction.transactionType ?? TransactionType.EXPENSE) === TransactionType.INCOME) ? 'transaction-income' : 'transaction-expense'}`}
                onClick={() => handleView(transaction)}
                onDoubleClick={() => handleDoubleClick(transaction)}
                style={{ cursor: 'pointer' }}
              >
                <div className="transaction-content">
                  <div className="transaction-header-info">
                    <div className="transaction-description-wrapper">
                      <p className="transaction-description">{transaction.description || 'No description'}</p>
                      {(transaction.transactionType ?? TransactionType.EXPENSE) && (
                        <span className={`transaction-type-badge ${((transaction.transactionType ?? TransactionType.EXPENSE) === TransactionType.INCOME) ? 'income' : 'expense'}`}>
                          {(transaction.transactionType ?? TransactionType.EXPENSE) === TransactionType.INCOME ? (
                            <TrendingUp size={12} />
                          ) : (
                            <TrendingDown size={12} />
                          )}
                          {transaction.transactionType ?? TransactionType.EXPENSE}
                        </span>
                      )}
                    </div>
                    <p className={`transaction-amount ${((transaction.transactionType ?? TransactionType.EXPENSE) === TransactionType.INCOME) ? 'amount-income' : 'amount-expense'}`}>
                      {((transaction.transactionType ?? TransactionType.EXPENSE) === TransactionType.INCOME) ? '+' : '-'}
                      {formatAmount(transaction.amount)}
                    </p>
                  </div>
                  <div className="transaction-footer">
                    <span className="transaction-date">
                      <Calendar size={14} />
                      {formatDateWithTime(transaction.date)}
                    </span>
                    {transaction.category && (
                      <span className="transaction-category">
                        <Tag size={14} />
                        {transaction.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={pageSize}
              totalElements={totalElements}
            />
          )}
        </>
      )}

      {/* Transaction Modal with View/Edit/Delete */}
      <Modal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        title={modalMode === TransactionDetailsMode.EDIT ? "Edit Transaction Details" : "View Transaction Details"}
        size="medium"
        headerActions={
          modalMode === TransactionDetailsMode.VIEW && selectedTransaction ? (
            <>
              <button
                className="modal-header-action-button primary"
                onClick={handleEditInModal}
                title="Edit transaction"
                aria-label="Edit transaction"
              >
                <Edit size={18} />
              </button>
              <button
                className="modal-header-action-button danger"
                onClick={handleDeleteInModal}
                title="Delete transaction"
                aria-label="Delete transaction"
              >
                <Trash2 size={18} />
              </button>
            </>
          ) : undefined
        }
      >
        {selectedTransaction && (
          <TransactionDetails
            mode={modalMode}
            expense={selectedTransaction}
            onClose={handleCloseViewModal}
            isModal={true}
            onSaveSuccess={handleSaveSuccess}
            onCancelEdit={handleCancelEdit}
          />
        )}
      </Modal>

      {/* Create Transaction Details Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={handleCloseCreateModal}
        title="Add Transaction Details"
        size="medium"
      >
        <TransactionDetails
          mode={TransactionDetailsMode.CREATE}
          onClose={handleCloseCreateModal}
          isModal={true}
          onSaveSuccess={handleCreateSuccess}
        />
      </Modal>
    </div>
  );
};

export default Transaction;

