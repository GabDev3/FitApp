import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";

function ProductInfoComp({ product, loading, error }) {
  if (loading)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #3a7bd5, #00d2ff)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          m: 0,
          overflow: "hidden",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );

  if (error)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #3a7bd5, #00d2ff)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          m: 0,
          overflow: "hidden",
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #3a7bd5, #00d2ff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        m: 0,
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: { xs: "90%", sm: 600, md: 700 },
          bgcolor: "rgba(255, 255, 255, 0.4)",
          borderRadius: 4,
          p: 4,
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={4}
          textAlign="center"
          sx={{ color: "text.primary" }}
        >
          {product.name}
        </Typography>

        <TableContainer>
          <Table
            aria-label="product details"
            sx={{
              "& td, & th": {
                border: 0,
                paddingY: 1,
              },
              "& tr:nth-of-type(even)": {
                bgcolor: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <TableBody>
              {[
                ["Name", product.name],
                ["Carbohydrates", product.carbohydrates],
                ["Complex Carbs", product.complex_carbs],
                ["Simple Carbs", product.simple_carbs],
                ["Fiber", product.fiber],
                ["Fats", product.fats],
                ["Unsaturated Fats", product.unsaturated_fat],
                ["Saturated Fats", product.saturated_fat],
                ["Protein", product.protein],
                ["Calories", product.kcal],
              ].map(([label, value]) => (
                <TableRow key={label}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ fontWeight: "bold", width: "50%" }}
                  >
                    {label}
                  </TableCell>
                  <TableCell align="right">{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default ProductInfoComp;
