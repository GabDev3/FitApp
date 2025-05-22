import { useState, useEffect } from "react";
import {
  Box, Typography, Button, Grid, Card, CardContent,
  Chip, Fade, Slide, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Divider, Tabs, Tab
} from "@mui/material";
import {
  Edit, LocalFireDepartment, TrendingUp, Grain, Water,
  FitnessCenter, ShowChart, Restaurant, Straighten
} from "@mui/icons-material";
import api from "../api";
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

const GoalsSection = ({ user, showSnackbar }) => {
  const [goals, setGoals] = useState({
    calories: 2300,
    protein: 150,
    carbs: 250,
    fat: 80,
    water: 2000,
    fiber: 30
  });
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editableGoals, setEditableGoals] = useState({});

  const fetchGoals = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      // const response = await api.get("/api/goals/");
      // setGoals(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching goals:", error);
      showSnackbar("Error fetching goals", "error");
      setLoading(false);
    }
  };

  const saveGoals = async () => {
    try {
      // Replace with your actual API endpoint
      // await api.post("/api/goals/update/", editableGoals);
      setGoals(editableGoals);
      setOpenDialog(false);
      showSnackbar("Goals updated successfully!", "success");
    } catch (error) {
      console.error("Error saving goals:", error);
      showSnackbar("Error saving goals", "error");
    }
  };

  const handleEditClick = () => {
    setEditableGoals(goals);
    setOpenDialog(true);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <>
      <Fade in timeout={600}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #96CEB4, #FFAD60)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🎯 Nutrition Goals
            </Typography>
            <Button
              startIcon={<Edit />}
              variant="contained"
              size="large"
              onClick={handleEditClick}
              sx={{
                background: 'linear-gradient(45deg, #96CEB4, #FFAD60)',
                borderRadius: 3,
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(45deg, #FFAD60, #96CEB4)',
                  transform: 'scale(1.05)',
                }
              }}
            >
              Edit Goals
            </Button>
          </Box>

          <NutrientCard color="#96CEB4" sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#96CEB4' }}>
              Daily Nutrition Targets
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <LocalFireDepartment sx={{ fontSize: 40, color: '#FF6B6B', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">Calories</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF6B6B' }}>
                    {goals.calories}
                  </Typography>
                  <Typography variant="caption">kcal</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <TrendingUp sx={{ fontSize: 40, color: '#4ECDC4', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">Protein</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#4ECDC4' }}>
                    {goals.protein}
                  </Typography>
                  <Typography variant="caption">grams</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Grain sx={{ fontSize: 40, color: '#45B7D1', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">Carbs</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#45B7D1' }}>
                    {goals.carbs}
                  </Typography>
                  <Typography variant="caption">grams</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Water sx={{ fontSize: 40, color: '#96CEB4', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">Fat</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#96CEB4' }}>
                    {goals.fat}
                  </Typography>
                  <Typography variant="caption">grams</Typography>
                </Box>
              </Grid>
            </Grid>
          </NutrientCard>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <NutrientCard color="#FFAD60" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#FFAD60' }}>
                  <ShowChart sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Weekly Progress
                </Typography>
                <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">Progress charts will appear here</Typography>
                </Box>
              </NutrientCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <NutrientCard color="#FF6B6B" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#FF6B6B' }}>
                  <Restaurant sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Meal Targets
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Breakfast</Typography>
                    <Typography variant="h6">500 kcal</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Lunch</Typography>
                    <Typography variant="h6">800 kcal</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Dinner</Typography>
                    <Typography variant="h6">700 kcal</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Snacks</Typography>
                    <Typography variant="h6">300 kcal</Typography>
                  </Grid>
                </Grid>
              </NutrientCard>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      {/* Goals Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(150, 206, 180, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%)'
          }
        }}
      >
        <DialogTitle sx={{
          fontWeight: 700,
          background: 'linear-gradient(45deg, #96CEB4, #FFAD60)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🎯 Edit Nutrition Goals
        </DialogTitle>
        <DialogContent>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="Macros" icon={<FitnessCenter />} />
            <Tab label="Other" icon={<Straighten />} />
          </Tabs>

          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Calories (kcal)"
                  type="number"
                  value={editableGoals.calories}
                  onChange={(e) => setEditableGoals({...editableGoals, calories: e.target.value})}
                  InputProps={{ endAdornment: 'kcal' }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Protein (g)"
                  type="number"
                  value={editableGoals.protein}
                  onChange={(e) => setEditableGoals({...editableGoals, protein: e.target.value})}
                  InputProps={{ endAdornment: 'g' }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Carbohydrates (g)"
                  type="number"
                  value={editableGoals.carbs}
                  onChange={(e) => setEditableGoals({...editableGoals, carbs: e.target.value})}
                  InputProps={{ endAdornment: 'g' }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fat (g)"
                  type="number"
                  value={editableGoals.fat}
                  onChange={(e) => setEditableGoals({...editableGoals, fat: e.target.value})}
                  InputProps={{ endAdornment: 'g' }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Water (ml)"
                  type="number"
                  value={editableGoals.water}
                  onChange={(e) => setEditableGoals({...editableGoals, water: e.target.value})}
                  InputProps={{ endAdornment: 'ml' }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fiber (g)"
                  type="number"
                  value={editableGoals.fiber}
                  onChange={(e) => setEditableGoals({...editableGoals, fiber: e.target.value})}
                  InputProps={{ endAdornment: 'g' }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={saveGoals}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #96CEB4, #FFAD60)',
              borderRadius: 2,
              px: 3,
              '&:hover': {
                background: 'linear-gradient(45deg, #FFAD60, #96CEB4)',
              }
            }}
          >
            Save Goals
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GoalsSection;