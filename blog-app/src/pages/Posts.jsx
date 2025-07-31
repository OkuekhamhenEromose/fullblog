import { Box } from '@mui/material';
import Navbar from '../components/Common/Navbar';
import PostForm from '../components/Blog/PostForm';
import PostList from '../components/Blog/PostList';
import { useState } from 'react';

const Posts = () => {
  const [refresh, setRefresh] = useState(false);

  const handlePostCreated = () => {
    setRefresh(!refresh);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <PostForm onPostCreated={handlePostCreated} />
        <PostList key={refresh} />
      </Box>
    </>
  );
};

export default Posts;