import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

const CurrentBorrows = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchCurrentBorrows();
    
    const interval = setInterval(fetchCurrentBorrows, 10000);
    return () => clearInterval(interval);
  }, [filters]);

  const fetchCurrentBorrows = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      
      const response = await dashboardAPI.getCurrentBorrows(params);
      setBorrows(response.data.data || []);
    } catch (err) {
      console.error('Error fetching current borrows:', err);
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
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'returned') return false;
    return new Date(dueDate) < new Date();
  };

  if (loading && borrows.length === 0) {
    return <div className="loading">Loading current borrows...</div>;
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
        <button onClick={clearFilters}>Clear Filters</button>
      </div>

      {borrows.length === 0 ? (
        <div className="empty-state">
          <p>No active borrows found.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Item Title</th>
                <th>Type</th>
                <th>Owner</th>
                <th>Borrower</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((loan) => {
                const overdue = isOverdue(loan.dueDate, loan.status);
                return (
                  <tr key={loan._id} style={overdue ? { backgroundColor: '#fff3cd' } : {}}>
                    <td><strong>{loan.itemId?.title || 'Unknown'}</strong></td>
                    <td style={{ textTransform: 'capitalize' }}>
                      {loan.itemId?.type || '-'}
                    </td>
                    <td>
                      {loan.itemId?.owner?.name || 'Unknown'}
                      {loan.itemId?.owner?.email && (
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                          {loan.itemId.owner.email}
                        </div>
                      )}
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
                    <td style={overdue ? { color: '#e74c3c', fontWeight: '600' } : {}}>
                      {formatDate(loan.dueDate)}
                    </td>
                    <td>
                      <span className={`badge badge-${overdue ? 'overdue' : loan.status}`}>
                        {overdue ? 'Overdue' : loan.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CurrentBorrows;

