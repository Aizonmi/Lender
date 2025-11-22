import React, { useState, useEffect } from 'react';
import { loansAPI, membersAPI } from '../services/api';

const BorrowItem = () => {
  const [availableItems, setAvailableItems] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    borrowerMemberId: '',
    dueDate: '',
  });

  useEffect(() => {
    fetchAvailableItems();
    fetchMembers();
    
    // Refresh every 5 seconds
    const interval = setInterval(() => {
      fetchAvailableItems();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchAvailableItems = async () => {
    try {
      setLoading(true);
      const response = await loansAPI.getAvailableItems();
      setAvailableItems(response.data.data || []);
    } catch (err) {
      console.error('Error fetching available items:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to load available items',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await membersAPI.getAll();
      setMembers(response.data.data || []);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const handleBorrow = async (itemId) => {
    if (!formData.borrowerMemberId || !formData.dueDate) {
      setMessage({
        type: 'error',
        text: 'Please select a borrower and enter a due date first',
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    setBorrowing(itemId);
    setMessage({ type: '', text: '' });

    try {
      const response = await loansAPI.borrow({
        itemId,
        borrowerMemberId: formData.borrowerMemberId,
        dueDate: formData.dueDate,
      });

      setMessage({
        type: 'success',
        text: `Item "${response.data.data.itemId.title}" borrowed successfully!`,
      });

      // Refresh available items
      fetchAvailableItems();

      // Reset form
      setFormData({
        borrowerMemberId: '',
        dueDate: '',
      });

      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error?.message || 'Failed to borrow item',
      });
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
    } finally {
      setBorrowing(null);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (loading && availableItems.length === 0) {
    return <div className="loading">Loading available items...</div>;
  }

  return (
    <div>
      {message.text && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Borrower and Due Date Selection */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Borrower Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="borrowerMemberId">Select Borrower *</label>
            <select
              id="borrowerMemberId"
              name="borrowerMemberId"
              value={formData.borrowerMemberId}
              onChange={handleFormChange}
            >
              <option value="">Select a member...</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Due Date *</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleFormChange}
              min={getMinDate()}
              required
            />
          </div>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '10px' }}>
          Select a borrower and due date above, then click "Borrow" on any available item below.
        </p>
      </div>

      {availableItems.length === 0 ? (
        <div className="empty-state">
          <p>No available items found.</p>
          <p>All items are currently borrowed.</p>
        </div>
      ) : (
        <div className="item-grid">
          {availableItems.map((item) => (
            <div key={item._id} className="card">
              <div className="card-header">
                <div className="card-title">{item.title}</div>
                <span style={{ 
                  textTransform: 'capitalize', 
                  color: '#666',
                  fontSize: '0.875rem'
                }}>
                  {item.type}
                </span>
              </div>
              <div className="card-body">
                {item.description && <p>{item.description}</p>}
                <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                  <strong>Owner:</strong> {item.owner?.name || 'Unknown'}
                </p>
                {item.owner?.email && (
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>
                    {item.owner.email}
                  </p>
                )}
              </div>
              <div className="card-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => handleBorrow(item._id)}
                  disabled={borrowing === item._id || !formData.borrowerMemberId || !formData.dueDate}
                >
                  {borrowing === item._id ? 'Borrowing...' : 'Borrow'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BorrowItem;

