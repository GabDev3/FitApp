import { Box, Typography, TextField, Button } from "@mui/material";
import { Add } from "@mui/icons-material";

const SectionHeader = ({
  title,
  searchQuery,
  onSearchChange,
  showUserItems,
  onToggleUserItems,
  onAddClick,
  userItemsButtonText = "Moje produkty",
  addButtonText = "Dodaj"
}) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
    <Typography variant="h4" sx={{
      fontWeight: 700,
      background: 'linear-gradient(45deg, #4ECDC4, #44A08D)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }}>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField
        placeholder="Szukaj..."
        size="small"
        value={searchQuery}
        onChange={onSearchChange}
        sx={{ minWidth: 200 }}
      />
      <Button
        variant={showUserItems ? "contained" : "outlined"}
        onClick={onToggleUserItems}
        sx={{
          background: showUserItems ? 'linear-gradient(45deg, #4ECDC4, #44A08D)' : 'transparent',
          '&:hover': {
            background: showUserItems ? 'linear-gradient(45deg, #44A08D, #4ECDC4)' : 'transparent',
          }
        }}
      >
        {userItemsButtonText}
      </Button>
      <Button
        startIcon={<Add />}
        variant="contained"
        onClick={onAddClick}
        sx={{
          background: 'linear-gradient(45deg, #4ECDC4, #44A08D)',
          '&:hover': {
            background: 'linear-gradient(45deg, #44A08D, #4ECDC4)',
          }
        }}
      >
        {addButtonText}
      </Button>
    </Box>
  </Box>
);

export default SectionHeader;