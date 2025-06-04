import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { Person, Edit, Delete } from '@mui/icons-material';
import api from '../../../api';

const ProfileDialog = ({ open, onClose, user, onUserUpdate, showSnackbar }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    height: '',
    weight: '',
    activity_level: '',
    goal: '',
    dailyIntake: '',
    age: ''
  });
  const [errors, setErrors] = useState({});

  // Activity level options (numeric values)
  const activityLevels = [
    { value: 1.2, label: 'Sedentary (1.2) - little or no exercise' },
    { value: 1.375, label: 'Lightly Active (1.375) - light exercise 1-3 days/week' },
    { value: 1.55, label: 'Moderately Active (1.55) - moderate exercise 3-5 days/week' },
    { value: 1.725, label: 'Very Active (1.725) - hard exercise 6-7 days/week' },
    { value: 1.9, label: 'Extra Active (1.9) - very hard exercise & physical job' }
  ];

  // Goal options (target calorie intake values)
  const goalOptions = [
    { value: 1200, label: 'Low Calorie (1200 kcal/day)' },
    { value: 1500, label: 'Moderate Low (1500 kcal/day)' },
    { value: 1800, label: 'Moderate (1800 kcal/day)' },
    { value: 2000, label: 'Standard (2000 kcal/day)' },
    { value: 2200, label: 'Active (2200 kcal/day)' },
    { value: 2500, label: 'High Active (2500 kcal/day)' },
    { value: 3000, label: 'Very Active (3000 kcal/day)' }
  ];

  useEffect(() => {
    if (user && open) {
      setFormData({
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        height: user.height || '',
        weight: user.weight || '',
        activity_level: user.activity_level || '',
        goal: user.goal || '',
        dailyIntake: user.dailyIntake || '',
        age: user.age || ''
      });
      setEditing(false);
      setErrors({});
    }
  }, [user, open]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';

    if (formData.age && (isNaN(formData.age) || formData.age < 1 || formData.age > 120)) {
      newErrors.age = 'Age must be between 1 and 120';
    }

    if (formData.height && (isNaN(formData.height) || formData.height < 50 || formData.height > 300)) {
      newErrors.height = 'Height must be between 50 and 300 cm';
    }

    if (formData.weight && (isNaN(formData.weight) || formData.weight < 20 || formData.weight > 500)) {
      newErrors.weight = 'Weight must be between 20 and 500 kg';
    }

    if (formData.dailyIntake && (isNaN(formData.dailyIntake) || formData.dailyIntake < 800 || formData.dailyIntake > 5000)) {
      newErrors.dailyIntake = 'Daily intake must be between 800 and 5000 calories';
    }

    if (formData.activity_level && (isNaN(formData.activity_level) || formData.activity_level < 1.0 || formData.activity_level > 2.0)) {
      newErrors.activity_level = 'Activity level must be a valid multiplier';
    }

    if (formData.goal && (isNaN(formData.goal) || formData.goal < 800 || formData.goal > 5000)) {
      newErrors.goal = 'Goal must be between 800 and 5000 calories';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/api/user/edit/current/', formData);
      onUserUpdate(response.data);
      showSnackbar('Profile updated successfully!', 'success');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar('Failed to update profile. Please try again.', 'error');

      // Handle validation errors from backend
      if (error.response?.data) {
        const backendErrors = {};
        Object.keys(error.response.data).forEach(field => {
          backendErrors[field] = Array.isArray(error.response.data[field])
            ? error.response.data[field].join(', ')
            : error.response.data[field];
        });
        setErrors(backendErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setLoading(true);
      try {
        await api.delete('/api/user/delete/current/');
        showSnackbar('Account deleted successfully.', 'info');
        onClose();
        // Redirect to login or handle logout
        window.location.href = '/login';
      } catch (error) {
        console.error('Error deleting account:', error);
        showSnackbar('Failed to delete account. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setErrors({});
    // Reset form data
    if (user) {
      setFormData({
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        height: user.height || '',
        weight: user.weight || '',
        activity_level: user.activity_level || '',
        goal: user.goal || '',
        dailyIntake: user.dailyIntake || '',
        age: user.age || ''
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <Person color="primary" />
        <Typography variant="h6" component="span">
          User Profile
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={handleInputChange('email')}
              disabled={!editing}
              error={!!errors.email}
              helperText={errors.email}
              type="email"
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.first_name}
              onChange={handleInputChange('first_name')}
              disabled={!editing}
              error={!!errors.first_name}
              helperText={errors.first_name}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.last_name}
              onChange={handleInputChange('last_name')}
              disabled={!editing}
              error={!!errors.last_name}
              helperText={errors.last_name}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Age"
              value={formData.age}
              onChange={handleInputChange('age')}
              disabled={!editing}
              error={!!errors.age}
              helperText={errors.age}
              type="number"
              inputProps={{ min: 1, max: 120 }}
            />
          </Grid>

          {/* Physical Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
              Physical Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Height (cm)"
              value={formData.height}
              onChange={handleInputChange('height')}
              disabled={!editing}
              error={!!errors.height}
              helperText={errors.height}
              type="number"
              inputProps={{ min: 50, max: 300 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Weight (kg)"
              value={formData.weight}
              onChange={handleInputChange('weight')}
              disabled={!editing}
              error={!!errors.weight}
              helperText={errors.weight}
              type="number"
              inputProps={{ min: 20, max: 500, step: 0.1 }}
            />
          </Grid>

          {/* Fitness Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
              Fitness Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={!editing} error={!!errors.activity_level}>
              <InputLabel>Activity Level</InputLabel>
              <Select
                value={formData.activity_level || ''}
                onChange={handleInputChange('activity_level')}
                label="Activity Level"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {activityLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={!editing} error={!!errors.goal}>
              <InputLabel>Calorie Goal</InputLabel>
              <Select
                value={formData.goal || ''}
                onChange={handleInputChange('goal')}
                label="Calorie Goal"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {goalOptions.map((goal) => (
                  <MenuItem key={goal.value} value={goal.value}>
                    {goal.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Alternative: Custom numeric inputs */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Custom Activity Level (1.0-2.0)"
              value={formData.activity_level || ''}
              onChange={handleInputChange('activity_level')}
              disabled={!editing}
              error={!!errors.activity_level}
              helperText={errors.activity_level || "BMR multiplier (e.g., 1.2 for sedentary)"}
              type="number"
              inputProps={{ min: 1.0, max: 2.0, step: 0.01 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Custom Calorie Goal (kcal/day)"
              value={formData.goal || ''}
              onChange={handleInputChange('goal')}
              disabled={!editing}
              error={!!errors.goal}
              helperText={errors.goal || "Target daily calories (800-5000)"}
              type="number"
              inputProps={{ min: 800, max: 5000 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Daily Calorie Intake"
              value={formData.dailyIntake}
              onChange={handleInputChange('dailyIntake')}
              disabled={!editing}
              error={!!errors.dailyIntake}
              helperText={errors.dailyIntake}
              type="number"
              inputProps={{ min: 800, max: 5000 }}
            />
          </Grid>

          {/* User Info (Read-only) */}
          {user && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                  Account Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="User ID"
                  value={user.id || ''}
                  disabled
                  InputProps={{
                    style: { backgroundColor: '#f5f5f5' }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Role"
                  value={user.role || 'user'}
                  disabled
                  InputProps={{
                    style: { backgroundColor: '#f5f5f5' }
                  }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 1 }}>
        {!editing ? (
          <>
            <Button
              onClick={onClose}
              variant="outlined"
            >
              Close
            </Button>
            <Button
              onClick={() => setEditing(true)}
              variant="contained"
              startIcon={<Edit />}
            >
              Edit Profile
            </Button>
            <Button
              onClick={handleDelete}
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              disabled={loading}
            >
              Delete Account
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleCancel}
              variant="outlined"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog;