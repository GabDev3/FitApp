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
                  <Fade
                    key={product.id}
                    in={true}
                    timeout={400}
                  >
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
                        onEdit={editProduct}
                        onDelete={deleteProduct}
                      />
                    </div>
                  </Fade>
                ))}
              </Box>
            )}
        </Box>
      </Fade>

      <AddProductDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        product={newProduct}
        onProductChange={setNewProduct}
        onSave={createProduct}
      />
    </>
  );
};

export default ProductSection;