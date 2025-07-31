import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Box,
  MenuItem
} from '@mui/material';

const Register = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    fullname: '',
    phone: '',
    gender: 'M'
  });
  const [error, setError] = useState(null); // Properly initialize error state
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await register(userData);
      
      if (!result.success) {
        // Handle API validation errors
        if (result.error?.errors) {
          // Format Django validation errors for display
          const errorMessages = Object.entries(result.error.errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('\n');
          setError(errorMessages);
        } else {
          setError(result.error?.message || 'Registration failed');
        }
      } else {
        // Registration successful
        navigate('/login', {
          state: { 
            registrationSuccess: true,
            email: userData.email
          }
        });
      }
    } catch (err) {
      // Handle unexpected errors
      console.error('Registration error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        
        {error && (
          <Typography 
            color="error" 
            sx={{ 
              mt: 2,
              whiteSpace: 'pre-line' // Preserve newlines in error messages
            }}
          >
            {error}
          </Typography>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ mt: 1, width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={userData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password (min 8 characters)"
            type="password"
            value={userData.password}
            onChange={handleChange}
            inputProps={{ minLength: 8 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="fullname"
            label="Full Name"
            value={userData.fullname}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="phone"
            label="Phone Number"
            value={userData.phone}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            select
            name="gender"
            label="Gender"
            value={userData.gender}
            onChange={handleChange}
            sx={{ textAlign: 'left' }}
          >
            <MenuItem value="M">Male</MenuItem>
            <MenuItem value="F">Female</MenuItem>
          </TextField>
          
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
          
          <Typography align="center">
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;