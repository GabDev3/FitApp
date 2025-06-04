import { useState, useEffect } from "react";
import { Box, Fade, CircularProgress, Typography } from "@mui/material";

import api from "../../api";
import SectionHeader from "./elements/SectionHeader";
import ExpandableRow from "./elements/ExpandableRow";
import AddProductDialog from "./elements/AddProductDialog";

const ProductSection = ({ showSnackbar }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserProducts, setShowUserProducts] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const endpoint = showUserProducts ? "/api/product/get_all_user/" : "/api/product/get_all/";
      const response = await api.get(endpoint);
      setProducts(response.data || []); // Ensure we always set an array
    } catch (error) {
      console.error("Error fetching products:", error);
      showSnackbar("Error fetching products", "error");
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    try {
      if (editingProduct.id) {
        const { id, kcal, carbohydrates, fats, ...updateData } = editingProduct;
        await api.put(`/api/product/edit/${id}/`, updateData);
      } else {
        const { id, kcal, carbohydrates, fats, ...createData } = editingProduct;
        await api.post("/api/product/create/", createData);
      }
      await fetchProducts();
      showSnackbar(
        `Product ${editingProduct.id ? 'updated' : 'created'} successfully!`,
        "success"
      );
      handleDialogClose();
    } catch (error) {
      console.error("Error saving product:", error);
      showSnackbar(`Error ${editingProduct.id ? 'updating' : 'creating'} product`, "error");
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  const handleProductChange = (updatedProduct) => {
    setEditingProduct(updatedProduct);
  };

  const handleAddClick = () => {
    setEditingProduct({
      name: '',
      complex_carbs: 0,
      simple_carbs: 0,
      fiber: 0,
      protein: 0,
      saturated_fat: 0,
      unsaturated_fat: 0
    });
    setDialogOpen(true);
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/api/product/remove/${id}/`);
      await fetchProducts();
      showSnackbar("Product deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting product:", error);
      showSnackbar("Error deleting product", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [showUserProducts]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCarbs = (product) => (
    <>
      <Typography sx={{ fontSize: '0.95rem', mb: 0.5 }}>
        Złożone: <strong>{product.complex_carbs}g</strong>
      </Typography>
      <Typography sx={{ fontSize: '0.95rem', mb: 0.5 }}>
        Proste: <strong>{product.simple_carbs}g</strong>
      </Typography>
      <Typography sx={{ fontSize: '0.95rem' }}>
        Błonnik: <strong>{product.fiber}g</strong>
      </Typography>
    </>
  );

  const renderProteinsAndFats = (product) => (
    <>
      <Typography sx={{ fontSize: '0.95rem', mb: 0.5 }}>
        Białko: <strong>{product.protein}g</strong>
      </Typography>
      <Typography sx={{ fontSize: '0.95rem', mb: 0.5 }}>
        Tłuszcze nasycone: <strong>{product.saturated_fat}g</strong>
      </Typography>
      <Typography sx={{ fontSize: '0.95rem' }}>
        Tłuszcze nienasycone: <strong>{product.unsaturated_fat}g</strong>
      </Typography>
    </>
  );

  return (
    <Fade in={true} timeout={600}>
      <Box>
        <SectionHeader
          title="Produkty - wartości odżywcze na 100g"
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          showUserItems={showUserProducts}
          onToggleUserItems={() => setShowUserProducts(!showUserProducts)}
          onAddClick={handleAddClick}
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
            {filteredProducts.map((product) => (
              <Fade key={product.id} in={true} timeout={400}>
                <div>
                  <ExpandableRow
                    item={product}
                    titleField="name"
                    subtitleField="kcal"
                    subtitleUnit="kcal"
                    leftColumnTitle="Węglowodany"
                    rightColumnTitle="Białko i Tłuszcze"
                    leftColumnData={renderCarbs}
                    rightColumnData={renderProteinsAndFats}
                    onEdit={handleEditClick}
                    onDelete={deleteProduct}
                  />
                </div>
              </Fade>
            ))}
          </Box>
        )}

        <AddProductDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          product={editingProduct || {}}
          onProductChange={handleProductChange}
          onSave={handleSave}
          isEditing={Boolean(editingProduct?.id)}
        />
      </Box>
    </Fade>
  );
};

export default ProductSection;