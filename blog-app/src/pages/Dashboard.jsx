import { Box } from '@mui/material';
import Navbar from '../components/Common/Navbar';
import Profile from '../components/Dashboard/Profile';

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Profile />
      </Box>
    </>
  );
};

export default Dashboard;