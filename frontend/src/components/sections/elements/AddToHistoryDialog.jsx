import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box
} from '@mui/material';

const AddToHistoryDialog = ({ open, onClose, meal, onAddToHistory }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to today's date in YYYY-MM-DD format
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const handleAddToHistory = () => {
    onAddToHistory(selectedDate);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{
        color: '#44A08D',
        borderBottom: '2px solid #4ECDC4'
      }}>
        Dodaj do historii posiłków
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#44A08D' }}>
            {meal?.name}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {meal?.kcals} kcal | Produktów: {meal?.meal_products?.length || 0}
          </Typography>
          <TextField
            fullWidth
            label="Data spożycia"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Anuluj</Button>
        <Button
          onClick={handleAddToHistory}
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #4ECDC4, #44A08D)',
            '&:hover': {
              background: 'linear-gradient(45deg, #44A08D, #4ECDC4)',
            }
          }}
        >
          Dodaj do historii
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddToHistoryDialog;