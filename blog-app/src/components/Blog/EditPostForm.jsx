import { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCategories, updatePost, deletePost } from '../../api/posts';

const EditPostForm = ({ post, onUpdate, onDelete, onClose }) => {
  // Initialize all form fields with proper defaults to prevent uncontrolled/controlled warnings
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    category: post?.category?.id || '',
    tags: post?.tags || 'general'
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        setCategoriesLoading(false);
      } catch (err) {
        console.error('Failed to load categories:', err);
        setError('Failed to load categories. Please refresh the page.');
        setCategoriesLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Update form data when post prop changes
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        category: post.category?.id || '',
        tags: post.tags || 'general'
      });
    }
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: Number(formData.category),
        tags: formData.tags
      };

      const updatedPost = await updatePost(post.id, payload);
      onUpdate(updatedPost);
      if (onClose) onClose(); // Safely call onClose if provided
    } catch (err) {
      console.error('Post update error:', err);
      setError(err.message || 'Failed to update post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deletePost(post.id);
      if (onDelete) onDelete(post.id);
      if (onClose) onClose();
    } catch (err) {
      console.error('Post deletion error:', err);
      setError(err.message || 'Failed to delete post. Please try again.');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" gutterBottom>
            Edit Post
          </Typography>
          <IconButton 
            color="error" 
            onClick={() => setDeleteConfirmOpen(true)}
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={24} /> : <DeleteIcon />}
          </IconButton>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          multiline
          rows={6}
          margin="normal"
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            label="Category"
            disabled={categoriesLoading}
          >
            {categoriesLoading ? (
              <MenuItem disabled>Loading categories...</MenuItem>
            ) : (
              categories.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
              </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ mr: 2 }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || categoriesLoading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update'}
          </Button>
        </Box>
      </Box>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditPostForm;