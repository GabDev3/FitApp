import { useState, useEffect } from "react";
import {
  Box, Typography, Grid, Card, CardContent, Chip, Fade, Slide, LinearProgress
} from "@mui/material";
import {
  LocalFireDepartment,
  TrendingUp,
  Grain,
  Water
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const NutrientCard = styled(Card)(({ theme, color }) => ({
  background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
  border: `2px solid ${color}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 8px 25px ${color}33`,
  }
}));

const VibrantCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
  }
}));

const DashboardSection = ({ user, meals }) => {
  const calculateProgress = (current, goal) => (current / goal) * 100;

  const todayStats = {
    calories: { current: 1850, goal: user?.dailyIntake || 2300 },
    protein: { current: 128, goal: 150 },
    carbs: { current: 210, goal: 250 },
    fat: { current: 65, goal: 80 }
  };

  return (
    <Fade in timeout={600}>
      <Box>
        <Typography variant="h4" gutterBottom sx={{
          fontWeight: 700,
          mb: 4,
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Welcome back, {user?.first_name || 'User'}! 🌟
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <NutrientCard color="#FF6B6B" sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalFireDepartment sx={{ color: '#FF6B6B', mr: 1 }} />
                <Typography color="text.secondary" variant="h6">Calories</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF6B6B' }}>
                {todayStats.calories.current}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {todayStats.calories.goal} goal
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateProgress(todayStats.calories.current, todayStats.calories.goal)}
                sx={{ mt: 2, height: 8, borderRadius: 4, backgroundColor: '#FF6B6B22' }}
              />
            </NutrientCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <NutrientCard color="#4ECDC4" sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ color: '#4ECDC4', mr: 1 }} />
                <Typography color="text.secondary" variant="h6">Protein</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4ECDC4' }}>
                {todayStats.protein.current}g
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {todayStats.protein.goal}g goal
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateProgress(todayStats.protein.current, todayStats.protein.goal)}
                sx={{ mt: 2, height: 8, borderRadius: 4, backgroundColor: '#4ECDC422' }}
              />
            </NutrientCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <NutrientCard color="#45B7D1" sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Grain sx={{ color: '#45B7D1', mr: 1 }} />
                <Typography color="text.secondary" variant="h6">Carbs</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#45B7D1' }}>
                {todayStats.carbs.current}g
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {todayStats.carbs.goal}g goal
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateProgress(todayStats.carbs.current, todayStats.carbs.goal)}
                sx={{ mt: 2, height: 8, borderRadius: 4, backgroundColor: '#45B7D122' }}
              />
            </NutrientCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <NutrientCard color="#96CEB4" sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Water sx={{ color: '#96CEB4', mr: 1 }} />
                <Typography color="text.secondary" variant="h6">Fat</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#96CEB4' }}>
                {todayStats.fat.current}g
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {todayStats.fat.goal}g goal
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateProgress(todayStats.fat.current, todayStats.fat.goal)}
                sx={{ mt: 2, height: 8, borderRadius: 4, backgroundColor: '#96CEB422' }}
              />
            </NutrientCard>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
          🍽️ Recent Meals
        </Typography>
        <Grid container spacing={2}>
          {meals.slice(0, 3).map((meal, index) => (
            <Grid item xs={12} key={meal.id}>
              <Slide direction="up" in timeout={300 + index * 100}>
                <VibrantCard>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {meal.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Chip
                        label={`${meal.total_calories} kcal`}
                        size="small"
                        sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                      />
                      <Chip
                        label={`${meal.products?.length || 0} items`}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: 'white', color: 'white' }}
                      />
                    </Box>
                  </CardContent>
                </VibrantCard>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Fade>
  );
};

export default DashboardSection;