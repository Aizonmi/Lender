import React, { useState, useEffect } from 'react';
import { loansAPI, membersAPI } from '../services/api';

const BorrowedItems = () => {
  const [borrowedLoans, setBorrowedLoans] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (selectedMember) {
      fetchBorrowedItems();
      
      // Refresh every 5 seconds
      const interval = setInterval(fetchBorrowedItems, 5000);
      return () => clearInterval(interval);
    } else {
      fetchAllActiveLoans();
      
      // Refresh every 5 seconds
      const interval = setInterval(fetchAllActiveLoans, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedMember]);

  const fetchMembers = async () => {
    try {
      const response = await membersAPI.getAll();
      setMembers(response.data.data || []);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const fetchAllActiveLoans = async () => {
    try {
      setLoading(true);
      const response = await loansAPI.getAll({ status: 'active' });
      const activeLoans = response.data.data || [];
      
      // Also get overdue loans
      const overdueResponse = await loansAPI.getAll({ status: 'overdue' });
      const overdueLoans = overdueResponse.data.data || [];
      
      setBorrowedLoans([...activeLoans, ...overdueLoans]);
    } catch (err) {
      console.error('Error fetching borrowed items:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to load borrowed items',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBorrowedItems = async () => {
    try {
      setLoading(true);
      const response = await loansAPI.getBorrowedByMember(selectedMember);
      setBorrowedLoans(response.data.data || []);
    } catch (err) {
      console.error('Error fetching borrowed items:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to load borrowed items',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId, itemTitle) => {
    if (!window.confirm(`Are you sure you want to return "${itemTitle}"?`)) {
      return;
    }

    setReturning(loanId);
    setMessage({ type: '', text: '' });

    try {
      await loansAPI.return(loanId);
      
      setMessage({
        type: 'success',
        text: `Item "${itemTitle}" returned successfully!`,
      });

      // Refresh borrowed items
      if (selectedMember) {
        fetchBorrowedItems();
      } else {
        fetchAllActiveLoans();
      }

      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error?.message || 'Failed to return item',
      });
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
    } finally {
      setReturning(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'returned') return false;
    return new Date(dueDate) < new Date();
  };

  if (loading && borrowedLoans.length === 0) {
    return <div className="loading">Loading borrowed items...</div>;
  }

  return (
    <div>
      {message.text && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="memberFilter" style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
          Filter by Member (Optional):
        </label>
        <select
          id="memberFilter"
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
          style={{ 
            width: '100%', 
            maxWidth: '400px', 
            padding: '10px', 
            border: '1px solid #ddd', 
            borderRadius: '4px' 
          }}
        >
          <option value="">All Members</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name} ({member.email})
            </option>
          ))}
        </select>
      </div>

      {borrowedLoans.length === 0 ? (
        <div className="empty-state">
          <p>No borrowed items found.</p>
          {selectedMember && (
            <p>This member has no active loans.</p>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Item Title</th>
                <th>Item Type</th>
                <th>Borrower</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrowedLoans.map((loan) => {
                const overdue = isOverdue(loan.dueDate, loan.status);
                return (
                  <tr key={loan._id} style={overdue ? { backgroundColor: '#fff3cd' } : {}}>
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
                    <td style={overdue ? { color: '#e74c3c', fontWeight: '600' } : {}}>
                      {formatDate(loan.dueDate)}
                    </td>
                    <td>
                      <span className={`badge badge-${loan.status}`}>
                        {loan.status === 'active' && overdue ? 'Overdue' : loan.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleReturn(loan._id, loan.itemId?.title)}
                        disabled={returning === loan._id || loan.status === 'returned'}
                      >
                        {returning === loan._id ? 'Returning...' : 'Return'}
                      </button>
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

export default BorrowedItems;

