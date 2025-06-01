import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  IconButton,
  Autocomplete,
  Chip
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import api from '../../../api';

const AddMealDialog = ({ open, onClose, meal, onMealChange, onSave, isEditing }) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await api.get('/api/product/get_all/');
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleNameChange = (e) => {
    onMealChange({
      ...meal,
      name: e.target.value
    });
  };

  const handleAddProduct = () => {
    const newMealProducts = [...(meal.meal_products || []), { product_id: '', quantity: 1 }];
    onMealChange({
      ...meal,
      meal_products: newMealProducts
    });
  };

  const handleRemoveProduct = (index) => {
    const newMealProducts = (meal.meal_products || []).filter((_, i) => i !== index);
    onMealChange({
      ...meal,
      meal_products: newMealProducts
    });
  };

  const handleProductChange = (index, field, value) => {
    const newMealProducts = [...(meal.meal_products || [])];
    newMealProducts[index] = {
      ...newMealProducts[index],
      [field]: value
    };
    onMealChange({
      ...meal,
      meal_products: newMealProducts
    });
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Nieznany produkt';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{
        color: '#44A08D',
        borderBottom: '2px solid #4ECDC4'
      }}>
        {isEditing ? "Edytuj posiłek" : "Dodaj nowy posiłek"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nazwa posiłku"
              value={meal.name || ''}
              onChange={handleNameChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#44A08D' }}>
                Produkty w posiłku
              </Typography>
              <Button
                startIcon={<Add />}
                onClick={handleAddProduct}
                variant="outlined"
                size="small"
                sx={{
                  color: '#4ECDC4',
                  borderColor: '#4ECDC4',
                  '&:hover': {
                    backgroundColor: 'rgba(78, 205, 196, 0.1)',
                    borderColor: '#44A08D',
                  }
                }}
              >
                Dodaj produkt
              </Button>
            </Box>

            {meal.meal_products && meal.meal_products.length > 0 ? (
              meal.meal_products.map((mealProduct, index) => (
                <Box key={index} sx={{
                  border: '1px solid rgba(78, 205, 196, 0.3)',
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                  position: 'relative'
                }}>
                  <IconButton
                    onClick={() => handleRemoveProduct(index)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: 'error.main'
                    }}
                    size="small"
                  >
                    <Delete />
                  </IconButton>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Autocomplete
                        options={products}
                        getOptionLabel={(option) => option.name}
                        value={products.find(p => p.id === mealProduct.product_id) || null}
                        onChange={(event, newValue) => {
                          handleProductChange(index, 'product_id', newValue ? newValue.id : '');
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Wybierz produkt"
                            fullWidth
                            required
                          />
                        )}
                        loading={loadingProducts}
                        loadingText="Ładowanie produktów..."
                        noOptionsText="Brak produktów"
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            <Box>
                              <Typography variant="body2">{option.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {option.kcal} kcal/100g
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Ilość (g)"
                        type="number"
                        value={mealProduct.quantity || 1}
                        onChange={(e) => handleProductChange(index, 'quantity', parseFloat(e.target.value) || 1)}
                        inputProps={{ min: 0.1, step: 0.1 }}
                        required
                      />
                    </Grid>
                  </Grid>

                  {mealProduct.product_id && (
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={`${getProductName(mealProduct.product_id)} - ${mealProduct.quantity}g`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(78, 205, 196, 0.1)',
                          color: '#44A08D'
                        }}
                      />
                    </Box>
                  )}
                </Box>
              ))
            ) : (
              <Box sx={{
                textAlign: 'center',
                py: 4,
                color: 'text.secondary',
                border: '2px dashed rgba(78, 205, 196, 0.3)',
                borderRadius: 2
              }}>
                <Typography>
                  Brak produktów w posiłku. Kliknij "Dodaj produkt" aby rozpocząć.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Anuluj</Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!meal.name || !meal.meal_products || meal.meal_products.length === 0}
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

export default AddMealDialog;