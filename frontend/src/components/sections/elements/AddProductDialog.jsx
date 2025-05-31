import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid
} from '@mui/material';

const AddProductDialog = ({ open, onClose, product, onProductChange, onSave, isEditing }) => {
  const handleChange = (field) => (e) => {
    onProductChange({
      ...product,
      [field]: field === 'name' ? e.target.value : (parseFloat(e.target.value) || 0)
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{
        color: '#44A08D',
        borderBottom: '2px solid #4ECDC4'
      }}>
        {isEditing ? "Edytuj produkt" : "Dodaj nowy produkt"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nazwa produktu"
              value={product.name}
              onChange={handleChange('name')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Węglowodany złożone (g)"
              type="number"
              value={product.complex_carbs}
              onChange={handleChange('complex_carbs')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Węglowodany proste (g)"
              type="number"
              value={product.simple_carbs}
              onChange={handleChange('simple_carbs')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Błonnik (g)"
              type="number"
              value={product.fiber}
              onChange={handleChange('fiber')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Białko (g)"
              type="number"
              value={product.protein}
              onChange={handleChange('protein')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tłuszcze nasycone (g)"
              type="number"
              value={product.saturated_fat}
              onChange={handleChange('saturated_fat')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tłuszcze nienasycone (g)"
              type="number"
              value={product.unsaturated_fat}
              onChange={handleChange('unsaturated_fat')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Kalorie (kcal)"
              type="number"
              value={product.kcal}
              onChange={handleChange('kcal')}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Anuluj</Button>
        <Button
          onClick={onSave}
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #4ECDC4, #44A08D)',
            '&:hover': {
              background: 'linear-gradient(45deg, #44A08D, #4ECDC4)',
            }
          }}
        >
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;