import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await API.get('notifications/');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationMessage = (type) => {
    switch (type) {
      case 'Like':
        return 'liked your post';
      case 'Comment':
        return 'commented on your post';
      case 'Bookmark':
        return 'bookmarked your post';
      default:
        return 'interacted with your post';
    }
  };

  if (loading) return <div className="loading">Loading notifications...</div>;

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications yet</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((notification) => (
            <li key={notification.id} className={`notification-item ${!notification.seen ? 'unread' : ''}`}>
              <div className="notification-content">
                <span className="notification-type">{notification.type}</span>
                <p>
                  {notification.sender || 'Someone'} {getNotificationMessage(notification.type)}
                </p>
                <small>{new Date(notification.date).toLocaleString()}</small>
              </div>
              {notification.post && (
                <Link to={`/posts/${notification.post.id}`} className="post-link">
                  View Post
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;