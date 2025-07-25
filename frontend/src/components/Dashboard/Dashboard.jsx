import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="user-profile">
          <div className="avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <h3>{user?.username}</h3>
        </div>
        
        <nav className="dashboard-nav">
          <ul>
            <li>
              <Link to="/dashboard">Overview</Link>
            </li>
            <li>
              <Link to="/dashboard/profile">Profile</Link>
            </li>
            <li>
              <Link to="/dashboard/notifications">Notifications</Link>
            </li>
            <li>
              <Link to="/dashboard/posts">My Posts</Link>
            </li>
            <li>
              <Link to="/dashboard/bookmarks">Bookmarks</Link>
            </li>
          </ul>
        </nav>
      </aside>
      
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;