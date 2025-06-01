import { useState, useEffect } from "react";
import { Box, Fade, CircularProgress, Typography } from "@mui/material";

import api from "../../api";
import SectionHeader from "./elements/SectionHeader";
import ExpandableMealRow from "./elements/ExpandableMealRow";
import AddMealDialog from "./elements/AddMealDialog";
import AddToHistoryDialog from "./elements/AddToHistoryDialog";

const MealSection = ({ showSnackbar }) => {
  const [meals, setMeals] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMeals, setShowUserMeals] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [selectedMealForHistory, setSelectedMealForHistory] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/api/product/get_all/");
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const endpoint = showUserMeals ? "/api/meal/get_all_current/" : "/api/meal/get_all/";
      const response = await api.get(endpoint);
      setMeals(response.data || []);
      // Also fetch products to display names
      if (!products.length) {
        await fetchProducts();
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
      showSnackbar("Error fetching meals", "error");
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingMeal) return;

    try {
      if (editingMeal.id) {
        await api.put(`/api/meal/edit/${editingMeal.id}/`, editingMeal);
      } else {
        await api.post("/api/meal/create/", editingMeal);
      }
      await fetchMeals();
      showSnackbar(
        `Meal ${editingMeal.id ? 'updated' : 'created'} successfully!`,
        "success"
      );
      handleDialogClose();
    } catch (error) {
      console.error("Error saving meal:", error);
      showSnackbar(`Error ${editingMeal.id ? 'updating' : 'creating'} meal`, "error");
    }
  };

  const handleEditClick = (meal) => {
    setEditingMeal(meal);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingMeal(null);
  };

  const handleMealChange = (updatedMeal) => {
    setEditingMeal(updatedMeal);
  };

  const handleAddClick = () => {
    setEditingMeal({
      name: '',
      meal_products: []
    });
    setDialogOpen(true);
  };

  const deleteMeal = async (id) => {
    try {
      await api.delete(`/api/meal/remove/${id}/`);
      await fetchMeals();
      showSnackbar("Meal deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting meal:", error);
      showSnackbar("Error deleting meal", "error");
    }
  };

  const handleAddToHistory = (meal) => {
    setSelectedMealForHistory(meal);
    setHistoryDialogOpen(true);
  };

  const handleHistoryDialogClose = () => {
    setHistoryDialogOpen(false);
    setSelectedMealForHistory(null);
  };

  const handleAddToMealHistory = async (date) => {
    if (!selectedMealForHistory) return;

    try {
      // Convert date to datetime format expected by backend
      const consumedAt = new Date(date).toISOString();
      await api.post(`/api/meal_history/add/${selectedMealForHistory.id}/`, {
        consumed_at: consumedAt
      });
      showSnackbar("Meal added to history successfully!", "success");
      handleHistoryDialogClose();
    } catch (error) {
      console.error("Error adding meal to history:", error);
      showSnackbar("Error adding meal to history", "error");
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [showUserMeals]);

  const filteredMeals = meals.filter(meal =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `Produkt ID: ${productId}`;
  };

  const renderMealProducts = (meal) => (
    <>
      {meal.meal_products && meal.meal_products.length > 0 ? (
        meal.meal_products.map((mp, index) => (
          <Typography key={index} sx={{ fontSize: '0.9rem', mb: 0.3 }}>
            • {mp.quantity}g {getProductName(mp.product_id)}
          </Typography>
        ))
      ) : (
        <Typography sx={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'text.secondary' }}>
          Brak produktów
        </Typography>
      )}
    </>
  );

  const renderMealSummary = (meal) => (
    <>
      <Typography sx={{ fontSize: '0.95rem', mb: 0.5 }}>
        Kalorie: <strong>{meal.kcals || 0} kcal</strong>
      </Typography>
      <Typography sx={{ fontSize: '0.95rem', mb: 0.5 }}>
        Liczba produktów: <strong>{meal.meal_products?.length || 0}</strong>
      </Typography>
      <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
        Autor: {meal.author_meal || 'Nieznany'}
      </Typography>
    </>
  );

  return (
    <Fade in={true} timeout={600}>
      <Box>
        <SectionHeader
          title="Posiłki - wartości odżywcze"
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          showUserItems={showUserMeals}
          onToggleUserItems={() => setShowUserMeals(!showUserMeals)}
          onAddClick={handleAddClick}
          userItemsButtonText="Moje posiłki"
          addButtonText="Dodaj posiłek"
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={60} sx={{ color: '#4ECDC4' }} />
          </Box>
        ) : (
          <Box sx={{
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#4ECDC4',
              borderRadius: '4px',
            },
          }}>
            {filteredMeals.map((meal) => (
              <Fade key={meal.id} in={true} timeout={400}>
                <div>
                  <ExpandableMealRow
                    item={meal}
                    titleField="name"
                    subtitleField="kcals"
                    subtitleUnit="kcal"
                    leftColumnTitle="Składniki"
                    rightColumnTitle="Podsumowanie"
                    leftColumnData={renderMealProducts}
                    rightColumnData={renderMealSummary}
                    onEdit={handleEditClick}
                    onDelete={deleteMeal}
                    onAddToHistory={handleAddToHistory}
                  />
                </div>
              </Fade>
            ))}
          </Box>
        )}

        <AddMealDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          meal={editingMeal || {}}
          onMealChange={handleMealChange}
          onSave={handleSave}
          isEditing={Boolean(editingMeal?.id)}
        />

        <AddToHistoryDialog
          open={historyDialogOpen}
          onClose={handleHistoryDialogClose}
          meal={selectedMealForHistory}
          onAddToHistory={handleAddToMealHistory}
        />
      </Box>
    </Fade>
  );
};

export default MealSection;