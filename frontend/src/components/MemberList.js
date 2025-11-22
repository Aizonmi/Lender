import React, { useState, useEffect } from 'react';
import { membersAPI } from '../services/api';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await membersAPI.getAll();
      setMembers(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to fetch members');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    
    // Refresh list every 5 seconds
    const interval = setInterval(fetchMembers, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="loading">Loading members...</div>;
  }

  if (error) {
    return (
      <div className="message message-error">
        {error}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="empty-state">
        <p>No members found.</p>
        <p>Add a new member using the form above.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Member ID</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member._id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.phone || '-'}</td>
              <td>
                <code style={{ fontSize: '0.85rem' }}>{member._id}</code>
              </td>
              <td>{new Date(member.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberList;

