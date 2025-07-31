import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import Navbar from '../components/Common/Navbar';
import { useEffect, useState } from 'react';
import { getNotifications } from '../api/notifications';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ p: 3 }}>Loading notifications...</Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Notifications
        </Typography>
        <List>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <ListItem key={notification.id}>
                <ListItemText
                  primary={notification.message}
                  secondary={new Date(notification.date).toLocaleString()}
                />
              </ListItem>
            ))
          ) : (
            <Typography>No notifications</Typography>
          )}
        </List>
      </Box>
    </>
  );
};

export default Notifications;