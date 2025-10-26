import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import { getTicketStats } from '../utils/tickets';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Dashboard() {
  const user = getCurrentUser();
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0
  });
  
  useEffect(() => {
    // Load ticket statistics
    const ticketStats = getTicketStats();
    setStats(ticketStats);
  }, []);
  
  return (
    <div className="page">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="container">
          {/* Dashboard Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="dashboard-description">
                Here's an overview of your ticket management system
              </p>
            </div>
            <Link to="/tickets" className="btn btn-primary">
              Manage Tickets
            </Link>
          </div>
          
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon stat-icon-primary">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="stat-content">
                <h3 className="stat-label">Total Tickets</h3>
                <p className="stat-value">{stats.total}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon stat-icon-success">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-content">
                <h3 className="stat-label">Open Tickets</h3>
                <p className="stat-value">{stats.open}</p>
                <span className="stat-badge stat-badge-success">Active</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon stat-icon-warning">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-content">
                <h3 className="stat-label">In Progress</h3>
                <p className="stat-value">{stats.inProgress}</p>
                <span className="stat-badge stat-badge-warning">Working</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon stat-icon-gray">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="stat-content">
                <h3 className="stat-label">Closed Tickets</h3>
                <p className="stat-value">{stats.closed}</p>
                <span className="stat-badge stat-badge-gray">Resolved</span>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="quick-actions">
            <h2 className="section-title">Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/tickets" className="action-card">
                <div className="action-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="action-title">Create New Ticket</h3>
                <p className="action-description">
                  Add a new ticket to track an issue or task
                </p>
              </Link>
              
              <Link to="/tickets" className="action-card">
                <div className="action-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <h3 className="action-title">View All Tickets</h3>
                <p className="action-description">
                  Browse and manage all existing tickets
                </p>
              </Link>
              
              <div className="action-card action-card-disabled">
                <div className="action-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="action-title">View Reports</h3>
                <p className="action-description">
                  Coming soon...
                </p>
              </div>
            </div>
          </div>
          
          {/* Info Section */}
          <div className="dashboard-info">
            <div className="info-card">
              <h3 className="info-title">Getting Started</h3>
              <ul className="info-list">
                <li>Create your first ticket to track issues</li>
                <li>Use status tags to organize tickets (Open, In Progress, Closed)</li>
                <li>Edit tickets to update their status or details</li>
                <li>Delete tickets when they're no longer needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}