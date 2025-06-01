import { useState, useEffect } from "react";
import { Box, Fade, CircularProgress, Typography, Slide } from "@mui/material";

import api from "../../api";
import SectionHeader from "./elements/SectionHeader";
import ExpandableRow from "./elements/ExpandableRow";
import AddProductDialog from "./elements/AddProductDialog";


const ProductSection = ({ showSnackbar }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserProducts, setShowUserProducts] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    complex_carbs: 0,
    simple_carbs: 0,
    fiber: 0,
    saturated_fat: 0,
    unsaturated_fat: 0,
    protein: 0,
    kcal: 0
  });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

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

    const handleSave = async () => {
      try {
        if (editingProduct.id) {
          const { id, author_product, kcal, carbohydrates, fats, ...updateData } = editingProduct;
          await api.put(`/api/product/edit/${editingProduct.id}/`, updateData);
          await fetchProducts();
          showSnackbar("Product updated successfully!", "success");
        } else {
          await createProduct();
        }
        handleDialogClose();
      } catch (error) {
        console.error('Error saving product:', error);
        showSnackbar("Error saving product", "error");
      }
    };


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const endpoint = showUserProducts ? "/api/product/get_all_user/" : "/api/product/get_all/";
      const response = await api.get(endpoint);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      showSnackbar("Error fetching products", "error");
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async () => {
    try {
      await api.post("/api/product/create/", newProduct);
      setOpenDialog(false);
      setNewProduct({
        name: '',
        complex_carbs: 0,
        simple_carbs: 0,
        fiber: 0,
        saturated_fat: 0,
        unsaturated_fat: 0,
        protein: 0
      });
      fetchProducts();
      showSnackbar("Product created successfully!", "success");
    } catch (error) {
      console.error("Error creating product:", error);
      showSnackbar("Error creating product", "error");
    }
  };

  const editProduct = async (id, productData) => {
    try {
      await api.put(`/api/product/edit/${id}/`, productData);
      fetchProducts();
      showSnackbar("Product updated successfully!", "success");
    } catch (error) {
      console.error("Error updating product:", error);
      showSnackbar("Error updating product", "error");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/api/product/remove/${id}/`);
      fetchProducts();
      showSnackbar("Product deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting product:", error);
      showSnackbar("Error deleting product", "error");
    }
  };

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

  useEffect(() => {
    fetchProducts();
  }, [showUserProducts]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

   return (
    <>
      <Fade in timeout={600}>
        <Box>
          <SectionHeader
            title="Produkty - wartości odżywcze na 100g"
            searchQuery={searchQuery}
            onSearchChange={(e) => setSearchQuery(e.target.value)}
            showUserItems={showUserProducts}
            onToggleUserItems={() => setShowUserProducts(!showUserProducts)}
            onAddClick={() => setOpenDialog(true)}
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
                <AddProductDialog
                  open={dialogOpen}
                  onClose={handleDialogClose}
                  product={editingProduct || {
                    name: '',
                    complex_carbs: 0,
                    simple_carbs: 0,
                    fiber: 0,
                    protein: 0,
                    saturated_fat: 0,
                    unsaturated_fat: 0,
                    kcal: 0
                  }}
                  onProductChange={handleProductChange}
                  onSave={handleSave}
                  isEditing={Boolean(editingProduct)}
                />
              </Box>
            )}
        </Box>
      </Fade>
    </>
  );
};

export default ProductSection;