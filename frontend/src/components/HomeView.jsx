import { useState, useEffect } from "react";
import {
  Box, Container, AppBar, Toolbar, IconButton, Avatar,
  Menu, MenuItem, Badge, Button, Paper, Divider, Typography
} from "@mui/material";
import {
  Dashboard, Fastfood, Restaurant, FitnessCenter,
  Notifications, Search, Menu as MenuIcon
} from "@mui/icons-material";
import ProductSection from "./sections/ProductSection";
import MealSection from "./sections/MealSection";
import GoalsSection from "./sections/GoalsSection";
import ProfileDialog from "./sections/elements/ProfileDialog"; // Add this import
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";

const HomeView = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [meals, setMeals] = useState([]);
  const [notificationCount] = useState(3);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false); // Add this state

  const sections = [
    { id: "products", name: "Products", icon: <Fastfood /> },
    { id: "meals", name: "Meals", icon: <Restaurant /> },
    { id: "goals", name: "Goals", icon: <FitnessCenter /> }
  ];

  const fetchUserData = async () => {
    try {
      const userData = await api.get("/api/user/info/current/");
      setUser(userData.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchMeals = async () => {
    try {
      const response = await api.get("/api/meal/get_all/");
      setMeals(response.data);
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchMeals();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    navigate('/logout');
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  // Add these handlers
  const handleProfileClick = () => {
    setProfileDialogOpen(true);
    handleUserMenuClose();
  };

  const handleProfileDialogClose = () => {
    setProfileDialogOpen(false);
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const showSnackbar = (message, severity) => {
    // Implement your snackbar/notification system here
    console.log(`${severity}: ${message}`);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "products":
        return <ProductSection showSnackbar={showSnackbar} />;
      case "meals":
        return <MealSection showSnackbar={showSnackbar} />;
      case "goals":
        return <GoalsSection user={user} showSnackbar={showSnackbar} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Desktop Sidebar */}
      <Paper sx={{
        width: 280,
        p: 2,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        gap: 1,
        borderRadius: 0,
        borderRight: '1px solid rgba(0, 0, 0, 0.12)'
      }}>
        <Typography variant="h6" sx={{ p: 2, fontWeight: 700, color: '#4ECDC4' }}>
          Fit App
        </Typography>
        <Divider sx={{ my: 1 }} />

        {sections.map((section) => (
          <Button
            key={section.id}
            startIcon={section.icon}
            onClick={() => setActiveSection(section.id)}
            sx={{
              justifyContent: 'flex-start',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: activeSection === section.id ? 600 : 400,
              color: activeSection === section.id ? '#4ECDC4' : 'text.primary',
              backgroundColor: activeSection === section.id ? 'rgba(78, 205, 196, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(78, 205, 196, 0.05)'
              }
            }}
          >
            {section.name}
          </Button>
        ))}
      </Paper>

      {/* Mobile Drawer (simplified) */}
      <AppBar
        position="fixed"
        sx={{
          display: { xs: 'flex', md: 'none' },
          backgroundColor: 'white',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {sections.find(s => s.id === activeSection)?.name || 'Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* App Bar */}
        <AppBar
          position="static"
          color="inherit"
          elevation={0}
          sx={{
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            backgroundColor: 'white'
          }}
        >
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            <IconButton onClick={handleUserMenuClick}>
              <Avatar sx={{ width: 36, height: 36 }}>
                {user?.first_name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleUserMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

        {/* Content */}
        <Box sx={{ flex: 1, p: 3, pt: { xs: 10, md: 3 } }}>
          <Container maxWidth="xl" sx={{ p: 0 }}>
            {renderSection()}
          </Container>
        </Box>
      </Box>

      {/* Profile Dialog */}
      <ProfileDialog
        open={profileDialogOpen}
        onClose={handleProfileDialogClose}
        user={user}
        onUserUpdate={handleUserUpdate}
        showSnackbar={showSnackbar}
      />
    </Box>
  );
};

export default HomeView;