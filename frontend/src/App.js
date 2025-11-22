import React, { useState, useEffect } from 'react';
import './App.css';

// Member A Components
import MemberForm from './components/MemberForm';
import MemberList from './components/MemberList';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';

// Member B Components
import BorrowItem from './components/BorrowItem';
import BorrowedItems from './components/BorrowedItems';

// Member C Components
import DashboardOverview from './components/DashboardOverview';
import CurrentBorrows from './components/CurrentBorrows';
import StatsCharts from './components/StatsCharts';
import LoanHistory from './components/LoanHistory';

import { dashboardAPI } from './services/api';

function App() {
  const [activeSystem, setActiveSystem] = useState('catalog'); // catalog, lending, dashboard
  const [activeTab, setActiveTab] = useState('members'); // For catalog: members/items
  const [notifications, setNotifications] = useState([]);
  const [hasOverdue, setHasOverdue] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await dashboardAPI.getNotifications();
      setNotifications(response.data.data || []);
      setHasOverdue(response.data.hasOverdue || false);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>Lendify - Integrated Lending Platform</h1>
          <p>Complete System Integration - All Sub-Systems Combined</p>
        </div>

        {/* Global Overdue Alert */}
        {hasOverdue && notifications.length > 0 && (
          <div className="alert alert-danger">
            <strong>⚠️ Overdue Items Alert!</strong>
            <span>{notifications.length} item(s) are overdue.</span>
          </div>
        )}

        {/* Main System Navigation */}
        <div className="tabs" style={{ borderBottom: '3px solid #667eea', paddingBottom: '5px' }}>
          <button
            className={`tab ${activeSystem === 'catalog' ? 'active' : ''}`}
            onClick={() => {
              setActiveSystem('catalog');
              setActiveTab('members');
            }}
          >
            📚 Catalog & Members
          </button>
          <button
            className={`tab ${activeSystem === 'lending' ? 'active' : ''}`}
            onClick={() => {
              setActiveSystem('lending');
              setActiveTab('borrow');
            }}
          >
            🔄 Lending & Returns
          </button>
          <button
            className={`tab ${activeSystem === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              setActiveSystem('dashboard');
              setActiveTab('overview');
            }}
          >
            📊 Dashboard & Reports
          </button>
        </div>

        {/* Member A - Catalog & Member Profiles */}
        {activeSystem === 'catalog' && (
          <>
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'members' ? 'active' : ''}`}
                onClick={() => setActiveTab('members')}
              >
                Members
              </button>
              <button
                className={`tab ${activeTab === 'items' ? 'active' : ''}`}
                onClick={() => setActiveTab('items')}
              >
                Items
              </button>
            </div>

            {activeTab === 'members' && (
              <>
                <div className="section">
                  <h2>Add New Member</h2>
                  <MemberForm />
                </div>
                <div className="section">
                  <h2>All Members</h2>
                  <MemberList />
                </div>
              </>
            )}

            {activeTab === 'items' && (
              <>
                <div className="section">
                  <h2>Add New Item</h2>
                  <ItemForm />
                </div>
                <div className="section">
                  <h2>All Items</h2>
                  <ItemList />
                </div>
              </>
            )}
          </>
        )}

        {/* Member B - Lending & Return Logic */}
        {activeSystem === 'lending' && (
          <>
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'borrow' ? 'active' : ''}`}
                onClick={() => setActiveTab('borrow')}
              >
                Borrow Item
              </button>
              <button
                className={`tab ${activeTab === 'return' ? 'active' : ''}`}
                onClick={() => setActiveTab('return')}
              >
                Return Item
              </button>
            </div>

            {activeTab === 'borrow' && (
              <div className="section">
                <h2>Available Items for Borrowing</h2>
                <BorrowItem />
              </div>
            )}

            {activeTab === 'return' && (
              <div className="section">
                <h2>Currently Borrowed Items</h2>
                <BorrowedItems />
              </div>
            )}
          </>
        )}

        {/* Member C - Dashboard & Reporting */}
        {activeSystem === 'dashboard' && (
          <>
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview & Stats
              </button>
              <button
                className={`tab ${activeTab === 'current' ? 'active' : ''}`}
                onClick={() => setActiveTab('current')}
              >
                Current Borrows
              </button>
              <button
                className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                Loan History
              </button>
              <button
                className={`tab ${activeTab === 'charts' ? 'active' : ''}`}
                onClick={() => setActiveTab('charts')}
              >
                Analytics & Charts
              </button>
            </div>

            {activeTab === 'overview' && (
              <DashboardOverview notifications={notifications} />
            )}

            {activeTab === 'current' && (
              <CurrentBorrows />
            )}

            {activeTab === 'history' && (
              <LoanHistory />
            )}

            {activeTab === 'charts' && (
              <StatsCharts />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;

