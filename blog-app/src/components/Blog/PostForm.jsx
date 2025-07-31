import { useState, useEffect } from 'react';
import { createPost, getCategories, updatePost } from '../../api/posts';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl,
  CircularProgress
} from '@mui/material';

const PostForm = ({ post = null, onPostCreated, onPostUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    category: post?.category?.id || '',
    tags: post?.tags || 'general'
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        if (data.length > 0 && !post) {
          setFormData(prev => ({...prev, category: String(data[0].id)}));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
        setError('Failed to load categories. Please refresh the page.');
      } finally {
        setCategoriesLoading(false);
      }
    };
    
    fetchCategories();
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
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

      if (post) {
        const response = await updatePost(post.id, payload);
        onPostUpdated(response);
      } else {
        const response = await createPost(payload);
        onPostCreated(response);
        setFormData({
          title: '',
          content: '',
          category: formData.category,
          tags: 'general'
        });
      }
    } catch (err) {
      console.error('Post operation error:', err);
      setError(err.message || `Failed to ${post ? 'update' : 'create'} post. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {post ? 'Edit Post' : 'Create New Post'}
      </Typography>

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
            <MenuItem disabled>
              <CircularProgress size={24} />
            </MenuItem>
          ) : (
            categories.map(category => (
              <MenuItem key={category.id} value={String(category.id)}>
                {category.name}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      <Box display="flex" justifyContent="flex-end" mt={3}>
        {post && (
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{ mr: 2 }}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={loading || categoriesLoading || !formData.category}
        >
          {loading ? <CircularProgress size={24} /> : (post ? 'Update' : 'Post')}
        </Button>
      </Box>
    </Box>
  );
};

export default PostForm;