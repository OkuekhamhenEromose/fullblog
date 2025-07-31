import { Card, CardContent, Typography, Button, CardActions, Avatar, Box } from '@mui/material';
import { Favorite, Bookmark, Comment } from '@mui/icons-material';
import { likePost, bookmarkPost } from '../../api/posts';
import { useAuth } from '../../context/AuthContext';

const PostItem = ({ post }) => {
  const { isAuthenticated } = useAuth();

  const handleLike = async () => {
    if (!isAuthenticated) return;
    try {
      await likePost(post.id);
      // You might want to update the UI or refetch posts
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) return;
    try {
      await bookmarkPost(post.id);
      // You might want to update the UI or refetch posts
    } catch (error) {
      console.error('Error bookmarking post:', error);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar src={post.user?.avatar} alt={post.user?.username} />
          <Typography variant="subtitle1" ml={2}>
            {post.user?.username}
          </Typography>
        </Box>
        <Typography variant="h5" component="div">
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {post.content}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={<Favorite />}
          onClick={handleLike}
          disabled={!isAuthenticated}
        >
          {post.likes_count} Likes
        </Button>
        <Button
          size="small"
          startIcon={<Bookmark />}
          onClick={handleBookmark}
          disabled={!isAuthenticated}
        >
          Bookmark
        </Button>
        <Button size="small" startIcon={<Comment />} disabled={!isAuthenticated}>
          {post.comments_count} Comments
        </Button>
      </CardActions>
    </Card>
  );
};

export default PostItem;