import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";

import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";

function ProductCreateForm() {
  const [formData, setFormData] = useState({
    name: "",
    complex_carbs: "",
    simple_carbs: "",
    fiber: "",
    saturated_fat: "",
    unsaturated_fat: "",
    protein: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const name = "Create Product";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      await api.post("api/product/create/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/"); // or navigate to product list page
    } catch (error) {
      alert("Failed to create product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Name", type: "text" },
    { name: "complex_carbs", label: "Complex Carbs", type: "number" },
    { name: "simple_carbs", label: "Simple Carbs", type: "number" },
    { name: "fiber", label: "Fiber", type: "number" },
    { name: "saturated_fat", label: "Saturated Fat", type: "number" },
    { name: "unsaturated_fat", label: "Unsaturated Fat", type: "number" },
    { name: "protein", label: "Protein", type: "number" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #3a7bd5, #00d2ff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 5,
          borderRadius: 3,
          width: "100%",
          maxWidth: 600,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <Typography variant="h4" align="center" fontWeight="bold">
            {name}
          </Typography>

          {fields.map(({ name, label, type }) => (
            <TextField
              key={name}
              name={name}
              label={label}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              inputProps={type === "number" ? { step: "any" } : {}}
            />
          ))}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ fontWeight: 600 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : name}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default ProductCreateForm;
