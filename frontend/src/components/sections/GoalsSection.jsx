import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Stack,
  TextField
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../../api';

const renderMealProducts = (meal) => (
  <>
    {meal.meal_products?.map((mp) => (
      <Typography key={mp.product_id} sx={{ fontSize: '0.9rem' }}>
        • {mp.quantity}g {mp.product?.name || 'Unknown product'}
      </Typography>
    ))}
  </>
);

const renderMealSummary = (meal) => (
  <>
    <Typography sx={{ fontSize: '0.95rem', mb: 0.5 }}>
      Kalorie: <strong>{meal.kcals} kcal</strong>
    </Typography>
    <Typography sx={{ fontSize: '0.95rem', mb: 0.5 }}>
      Białko: <strong>{meal.protein?.toFixed(1)}g</strong>
    </Typography>
    <Typography sx={{ fontSize: '0.95rem', mb: 0.5 }}>
      Węglowodany: <strong>{meal.carbs?.toFixed(1)}g</strong>
    </Typography>
    <Typography sx={{ fontSize: '0.95rem', mb: 0.5 }}>
      Tłuszcz: <strong>{meal.fat?.toFixed(1)}g</strong>
    </Typography>
    <Typography sx={{ fontSize: '0.95rem', mb: 0.5 }}>
      Liczba produktów: <strong>{meal.meal_products?.length || 0}</strong>
    </Typography>
    <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
      Autor: {meal.author_meal || 'Nieznany'}
    </Typography>
  </>
);


const GoalsSection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState([]);
  const [userGoal, setUserGoal] = useState(0);
  const [dailySummary, setDailySummary] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [availableMeals, setAvailableMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState('');

useEffect(() => {
  const fetchData = async () => {
    try {
      // Clear meals immediately when date changes
      setMeals([]);
      setDailySummary({ calories: 0, protein: 0, carbs: 0, fat: 0 });

      const [userResponse, mealsHistoryResponse, allMealsResponse, allProductsResponse] = await Promise.all([
        api.get('/api/user/info/current/'),
        api.get('/api/meal_history/get/'),
        api.get('/api/meal/get_all/'),
        api.get('/api/product/get_all/')
      ]);

      const products = allProductsResponse.data;

const mealsWithDetails = await Promise.all(
  mealsHistoryResponse.data.map(async (historyItem) => {
    const meal = allMealsResponse.data.find(m => m.id === historyItem.meal_id);
    if (!meal) return null;

    const mealNutrients = meal.meal_products.reduce((acc, mp) => {
      const product = products.find(p => p.id === mp.product_id);
      if (product) {
        return {
          protein: acc.protein + (mp.quantity * product.protein) / 100,
          carbs: acc.carbs + (mp.quantity * product.carbohydrates) / 100,
          fat: acc.fat + (mp.quantity * product.fats) / 100
        };
      }
      return acc;
    }, { protein: 0, carbs: 0, fat: 0 });

    return {
      id: historyItem.id, // This is the UserMeal id
      meal_id: historyItem.meal_id, // This is the Meal id
      consumed_at: historyItem.consumed_at,
      meal: {
        ...meal,
        protein: Number(mealNutrients.protein.toFixed(1)),
        carbs: Number(mealNutrients.carbs.toFixed(1)),
        fat: Number(mealNutrients.fat.toFixed(1))
      }
    };
  })
);

      const filteredMeals = mealsWithDetails
        .filter(meal => meal !== null)
        .filter(meal => {
          const mealDate = new Date(meal.consumed_at).toISOString().split('T')[0];
          return mealDate === selectedDate;
        });

      setUserGoal(userResponse.data.goal);
      setMeals(filteredMeals);
      setAvailableMeals(allMealsResponse.data);
      calculateDailySummary(filteredMeals);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMeals([]);
      setDailySummary({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    }
  };

  fetchData();
}, [selectedDate]);

const calculateDailySummary = (mealsList) => {
  const summary = mealsList.reduce((acc, historyItem) => ({
    calories: acc.calories + (historyItem.meal?.kcals || 0),
    protein: acc.protein + (historyItem.meal?.protein || 0),
    carbs: acc.carbs + (historyItem.meal?.carbs || 0),
    fat: acc.fat + (historyItem.meal?.fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  setDailySummary(summary);
};

const handleRemoveMeal = async (mealId) => {
  try {
    // Log the mealId to verify it's correct
    console.log('Deleting meal with id:', mealId);

    await api.delete(`/api/meal_history/remove/${mealId}/`);

    // Update the meals state by removing the deleted meal
    const updatedMeals = meals.filter(meal => meal.id !== mealId);
    setMeals(updatedMeals);
    calculateDailySummary(updatedMeals);
  } catch (error) {
    console.error('Error removing meal:', error);
  }
};

  const handleAddMeal = async () => {
    if (!selectedMeal) return;

    try {
        await api.post(`/api/meal_history/add/${selectedMeal}/`, {
          date: selectedDate
        });
        const response = await api.get('/api/meal_history/get/', {
          params: { date: selectedDate }
        });
      setMeals(response.data);
      calculateDailySummary(response.data);
      setOpenAddDialog(false);
      setSelectedMeal('');
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          sx={{ width: 220 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
        >
          Add Meal
        </Button>
      </Stack>

      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          Daily Progress: {dailySummary.calories} / {userGoal} kcal
        </Typography>
        <LinearProgress
          variant="determinate"
          value={userGoal ? (dailySummary.calories / userGoal) * 100 : 0}
          sx={{ height: 10, borderRadius: 5 }}
        />

        <Grid container spacing={2} mt={2}>
          <Grid item xs={4}>
            <Typography>Protein: {dailySummary.protein}g</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Carbs: {dailySummary.carbs}g</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Fat: {dailySummary.fat}g</Typography>
          </Grid>
        </Grid>
      </Box>

<Box sx={{ maxHeight: 400, overflow: 'auto' }}>
  {meals && meals.length > 0 ? (
    meals.map((historyItem) => (
      <Accordion key={historyItem.id}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            '& .MuiAccordionSummary-content': {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flex: 1
            }
          }}
        >
          <Typography>
            {historyItem.meal?.name || 'Unknown'} - {historyItem.meal?.kcals || 0} kcal
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              // Add console.log to verify the ID
              console.log('Removing meal with id:', historyItem.id);
              handleRemoveMeal(historyItem.id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Składniki
              </Typography>
              {renderMealProducts(historyItem.meal)}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Podsumowanie
              </Typography>
              {renderMealSummary(historyItem.meal)}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    ))
  ) : (
    <Typography>No meals found for this date</Typography>
  )}
</Box>
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add Meal to History</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Select Meal"
            value={selectedMeal}
            onChange={(e) => setSelectedMeal(e.target.value)}
            SelectProps={{
              native: true
            }}
            sx={{ mt: 2 }}
          >
            <option value="">Select a meal</option>
            {availableMeals.map((meal) => (
              <option key={meal.id} value={meal.id}>
                {meal.name}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddMeal} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GoalsSection;