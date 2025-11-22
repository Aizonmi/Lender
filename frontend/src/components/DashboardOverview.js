import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

const DashboardOverview = ({ notifications }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overdueItems, setOverdueItems] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchOverdue();
    
    const interval = setInterval(() => {
      fetchStats();
      fetchOverdue();
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverdue = async () => {
    try {
      const response = await dashboardAPI.getOverdue();
      setOverdueItems(response.data.data || []);
    } catch (err) {
      console.error('Error fetching overdue items:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="empty-state">No statistics available</div>;
  }

  return (
    <div>
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h3>Total Members</h3>
          <div className="value">{stats.overall.totalMembers}</div>
          <div className="label">Registered users</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
          <h3>Total Items</h3>
          <div className="value">{stats.overall.totalItems}</div>
          <div className="label">{stats.overall.availableItems} available</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
          <h3>Active Loans</h3>
          <div className="value">{stats.overall.activeLoans}</div>
          <div className="label">{stats.overall.overdueLoans} overdue</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
          <h3>Total Loans</h3>
          <div className="value">{stats.overall.totalLoans}</div>
          <div className="label">{stats.overall.returnedLoans} returned</div>
        </div>
      </div>

      {/* Overdue Items Alert */}
      {overdueItems.length > 0 && (
        <div className="section">
          <h2 style={{ color: '#e74c3c' }}>⚠️ Overdue Items ({overdueItems.length})</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Item Title</th>
                  <th>Borrower</th>
                  <th>Due Date</th>
                  <th>Days Overdue</th>
                </tr>
              </thead>
              <tbody>
                {overdueItems.map((loan) => {
                  const daysOverdue = Math.floor((new Date() - new Date(loan.dueDate)) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={loan._id} style={{ backgroundColor: '#fff3cd' }}>
                      <td><strong>{loan.itemId?.title || 'Unknown'}</strong></td>
                      <td>
                        {loan.borrowerMemberId?.name || 'Unknown'}
                        {loan.borrowerMemberId?.email && (
                          <div style={{ fontSize: '0.85rem', color: '#666' }}>
                            {loan.borrowerMemberId.email}
                          </div>
                        )}
                      </td>
                      <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                      <td style={{ color: '#e74c3c', fontWeight: '600' }}>
                        {daysOverdue} day{daysOverdue !== 1 ? 's' : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top 5 Most Borrowed Items */}
      <div className="section">
        <h2>Top 5 Most Borrowed Items</h2>
        {stats.mostBorrowedItems.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Item Title</th>
                  <th>Type</th>
                  <th>Total Borrows</th>
                  <th>Currently Borrowed</th>
                </tr>
              </thead>
              <tbody>
                {stats.mostBorrowedItems.map((item, index) => (
                  <tr key={item.itemId}>
                    <td><strong>#{index + 1}</strong></td>
                    <td><strong>{item.title}</strong></td>
                    <td style={{ textTransform: 'capitalize' }}>{item.type}</td>
                    <td>{item.borrowCount}</td>
                    <td>{item.activeBorrows}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">No borrowing data available</div>
        )}
      </div>

      {/* Top 5 Members by Borrow Count */}
      <div className="section">
        <h2>Top 5 Members by Borrow Count</h2>
        {stats.borrowCountsByMember.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Member Name</th>
                  <th>Email</th>
                  <th>Total Borrows</th>
                  <th>Active Loans</th>
                  <th>Returned</th>
                </tr>
              </thead>
              <tbody>
                {stats.borrowCountsByMember.map((member, index) => (
                  <tr key={member.memberId}>
                    <td><strong>#{index + 1}</strong></td>
                    <td><strong>{member.name}</strong></td>
                    <td>{member.email}</td>
                    <td>{member.borrowCount}</td>
                    <td>{member.activeBorrows}</td>
                    <td>{member.returnedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">No member data available</div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;

