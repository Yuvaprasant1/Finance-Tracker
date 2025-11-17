import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { dashboardService } from './dashboard.service';
import { DashboardSummaryDTO } from '../../types';
import { formatDate, formatAmount } from '../../utils/formatters';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Tag } from 'lucide-react';
import Pagination from '../../components/Pagination/Pagination';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { userId } = useUser();
  const [summary, setSummary] = useState<DashboardSummaryDTO>({
    totalIncome: 0,
    totalExpense: 0,
    savings: 0,
    savingsPercentage: undefined,
    previousMonthExpense: 0,
    transactions: [],
    monthWiseTransactions: undefined,
  });
  const [loading, setLoadingLocal] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize] = useState<number>(10);

  useEffect(() => {
    if (userId) {
      loadData(currentPage);
    }
  }, [userId, currentPage]);

  const loadData = async (page: number): Promise<void> => {
    if (!userId) {
      return;
    }
    try {
      setLoadingLocal(true);
      const data = await dashboardService.getSummary(userId, page, pageSize);
      setSummary(data);
    } catch (error) {
      alert('Failed to load dashboard data. Please check your connection.');
    } finally {
      setLoadingLocal(false);
    }
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCurrentMonthName = (): string => {
    return new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  if (!userId) {
    return null;
  }

  const transactions = summary.monthWiseTransactions?.content || [];
  const totalPages = summary.monthWiseTransactions?.totalPages || 0;
  const totalElements = summary.monthWiseTransactions?.totalElements || 0;

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Summary Cards Row */}
        <div className="summary-cards-row">
          <div className="summary-card income-card">
            <div className="summary-icon-wrapper income-icon">
              <TrendingUp className="summary-icon" />
            </div>
            <p className="summary-label">Total Income</p>
            <p className="summary-amount income-amount">
              {loading ? 'Loading...' : formatAmount(summary.totalIncome)}
            </p>
          </div>

          <div className="summary-card expense-card">
            <div className="summary-icon-wrapper expense-icon">
              <TrendingDown className="summary-icon" />
            </div>
            <p className="summary-label">Total Expense</p>
            <p className="summary-amount expense-amount">
              {loading ? 'Loading...' : formatAmount(summary.totalExpense)}
            </p>
          </div>

          <div className="summary-card savings-card">
            <div className="summary-icon-wrapper savings-icon">
              <DollarSign className="summary-icon" />
            </div>
            <p className="summary-label">Savings</p>
            <p className={`summary-amount ${summary.savings >= 0 ? 'savings-positive' : 'savings-negative'}`}>
              {loading ? 'Loading...' : formatAmount(summary.savings)}
            </p>
            {summary.savingsPercentage !== null && summary.savingsPercentage !== undefined && (
              <p className={`savings-percentage ${summary.savingsPercentage >= 0 ? 'percentage-positive' : 'percentage-negative'}`}>
                {summary.savingsPercentage >= 0 ? '↑' : '↓'} {Math.abs(summary.savingsPercentage).toFixed(1)}% vs previous month
              </p>
            )}
          </div>
        </div>

        {/* Month-wise Transactions Section */}
        <div className="transactions-section">
          <h2 className="section-title">
            <Calendar size={24} className="section-title-icon" />
            {getCurrentMonthName()} Transactions
          </h2>
          
          {loading ? (
            <p className="empty-text">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p className="empty-text">No transactions for this month yet.</p>
          ) : (
            <>
              <div className="transaction-list">
                {transactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className={`transaction-item ${(transaction.transactionType || 'EXPENSE') === 'INCOME' ? 'transaction-income' : 'transaction-expense'}`}
                  >
                    <div className="transaction-content">
                      <div className="transaction-header-info">
                        <div className="transaction-description-wrapper">
                          <p className="transaction-description">{transaction.description || 'No description'}</p>
                          {transaction.transactionType && (
                            <span className={`transaction-type-badge ${(transaction.transactionType || 'EXPENSE') === 'INCOME' ? 'income' : 'expense'}`}>
                              {transaction.transactionType === 'INCOME' ? (
                                <TrendingUp size={12} />
                              ) : (
                                <TrendingDown size={12} />
                              )}
                              {transaction.transactionType}
                            </span>
                          )}
                        </div>
                        <p className={`transaction-amount ${(transaction.transactionType || 'EXPENSE') === 'INCOME' ? 'amount-income' : 'amount-expense'}`}>
                          {(transaction.transactionType || 'EXPENSE') === 'INCOME' ? '+' : '-'}
                          {formatAmount(transaction.amount)}
                        </p>
                      </div>
                      <div className="transaction-footer">
                        <span className="transaction-date">
                          <Calendar size={14} />
                          {formatDate(transaction.date)}
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
