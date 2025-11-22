import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboardAPI } from '../services/api';

const COLORS = ['#9b59b6', '#3498db', '#e74c3c', '#f39c12', '#1abc9c'];

const StatsCharts = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    const interval = setInterval(fetchStats, 15000);
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

  if (loading) {
    return <div className="loading">Loading charts...</div>;
  }

  if (!stats) {
    return <div className="empty-state">No statistics available for charts</div>;
  }

  // Prepare data for most borrowed items chart
  const mostBorrowedData = stats.mostBorrowedItems.map(item => ({
    name: item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title,
    fullName: item.title,
    borrows: item.borrowCount,
  }));

  // Prepare data for borrow counts by member chart
  const memberBorrowsData = stats.borrowCountsByMember.map(member => ({
    name: member.name.length > 15 ? member.name.substring(0, 15) + '...' : member.name,
    fullName: member.name,
    borrows: member.borrowCount,
  }));

  // Prepare data for loans by type pie chart
  const loansByTypeData = stats.loansByType.map(item => ({
    name: item.type.charAt(0).toUpperCase() + item.type.slice(1),
    value: item.count,
  }));

  return (
    <div>
      {/* Most Borrowed Items Chart */}
      <div className="chart-container">
        <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Top 5 Most Borrowed Items</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mostBorrowedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, 'Borrows']}
              labelFormatter={(label) => {
                const item = mostBorrowedData.find(d => d.name === label);
                return item ? item.fullName : label;
              }}
            />
            <Legend />
            <Bar dataKey="borrows" fill="#9b59b6" name="Total Borrows" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Borrow Counts by Member Chart */}
      <div className="chart-container">
        <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Top 5 Members by Borrow Count</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={memberBorrowsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, 'Borrows']}
              labelFormatter={(label) => {
                const member = memberBorrowsData.find(d => d.name === label);
                return member ? member.fullName : label;
              }}
            />
            <Legend />
            <Bar dataKey="borrows" fill="#3498db" name="Total Borrows" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Loans by Type Pie Chart */}
      <div className="chart-container">
        <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Loans by Item Type</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={loansByTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {loansByTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Statistics */}
      <div className="section">
        <h2>Summary Statistics</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Members</td>
                <td><strong>{stats.overall.totalMembers}</strong></td>
              </tr>
              <tr>
                <td>Total Items</td>
                <td><strong>{stats.overall.totalItems}</strong></td>
              </tr>
              <tr>
                <td>Available Items</td>
                <td><strong>{stats.overall.availableItems}</strong></td>
              </tr>
              <tr>
                <td>Borrowed Items</td>
                <td><strong>{stats.overall.borrowedItems}</strong></td>
              </tr>
              <tr>
                <td>Total Loans</td>
                <td><strong>{stats.overall.totalLoans}</strong></td>
              </tr>
              <tr>
                <td>Active Loans</td>
                <td><strong>{stats.overall.activeLoans}</strong></td>
              </tr>
              <tr>
                <td>Returned Loans</td>
                <td><strong>{stats.overall.returnedLoans}</strong></td>
              </tr>
              <tr>
                <td>Overdue Loans</td>
                <td style={{ color: '#e74c3c', fontWeight: '600' }}>
                  <strong>{stats.overall.overdueLoans}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatsCharts;

