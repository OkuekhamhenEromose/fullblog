import { useState, useEffect } from 'react';
import { getDashboard, updateProfile } from '../../api/auth';
import { TextField, Button, Box, Typography } from '@mui/material';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    fullname: '',
    bio: '',
    avatar: null,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getDashboard();
        setProfileData({
          fullname: data.Message.split(' ')[1] || '', // Adjust based on your API response
          bio: '',
        });
      } catch (err) {
        setError('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setProfileData({
      ...profileData,
      avatar: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const formData = new FormData();
      formData.append('fullname', profileData.fullname);
      formData.append('bio', profileData.bio);
      if (profileData.avatar) {
        formData.append('avatar', profileData.avatar);
      }

      await updateProfile(formData);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Profile Settings
      </Typography>
      {message && (
        <Typography color="success" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Full Name"
          name="fullname"
          value={profileData.fullname}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Bio"
          name="bio"
          value={profileData.bio}
          onChange={handleChange}
          multiline
          rows={4}
          margin="normal"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'block', margin: '16px 0' }}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Update Profile
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;