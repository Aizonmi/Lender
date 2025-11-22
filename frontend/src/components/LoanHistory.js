import React, { useState, useEffect } from 'react';
import { loanHistoryAPI } from '../services/api';

const LoanHistory = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
  });

  useEffect(() => {
    fetchLoanHistory();
    
    const interval = setInterval(fetchLoanHistory, 10000);
    return () => clearInterval(interval);
  }, [filters]);

  const fetchLoanHistory = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.status) params.status = filters.status;
      
      const response = await loanHistoryAPI.getHistory(params);
      setLoans(response.data.data || []);
    } catch (err) {
      console.error('Error fetching loan history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      status: '',
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && loans.length === 0) {
    return <div className="loading">Loading loan history...</div>;
  }

  return (
    <div>
      <div className="filter-controls">
        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          Status:
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
          </select>
        </label>
        <button onClick={clearFilters}>Clear Filters</button>
      </div>

      {loans.length === 0 ? (
        <div className="empty-state">
          <p>No loan history found.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Item Title</th>
                <th>Type</th>
                <th>Borrower</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan._id}>
                  <td><strong>{loan.itemId?.title || 'Unknown'}</strong></td>
                  <td style={{ textTransform: 'capitalize' }}>
                    {loan.itemId?.type || '-'}
                  </td>
                  <td>
                    {loan.borrowerMemberId?.name || 'Unknown'}
                    {loan.borrowerMemberId?.email && (
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        {loan.borrowerMemberId.email}
                      </div>
                    )}
                  </td>
                  <td>{formatDate(loan.borrowDate)}</td>
                  <td>{formatDate(loan.dueDate)}</td>
                  <td>{formatDate(loan.returnDate)}</td>
                  <td>
                    <span className={`badge badge-${loan.status}`}>
                      {loan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoanHistory;

