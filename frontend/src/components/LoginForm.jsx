import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    Paper,
    Divider
} from "@mui/material";

import { keyframes } from '@mui/system';

function LoginForm({ route, method }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const wiggle = keyframes`
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(3deg); }
        50% { transform: rotate(-3deg); }
        75% { transform: rotate(1deg); }
    `;
    
    const float = keyframes`
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    `;
    
    const name = "Login";
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const res = await api.post(route, { email, password });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            }
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Container 
            component="main" 
            maxWidth="sm"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 4
            }}
        >
            <Paper
                elevation={24}
                sx={{
                    p: 5,
                    borderRadius: 4,
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    width: '100%',
                    maxWidth: 450,
                    animation: `${float} 6s ease-in-out infinite`
                }}
            >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography 
                        variant="h3" 
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1,
                            animation: `${wiggle} 2s ease-in-out infinite`
                        }}
                    >
                        Welcome Back
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: 'text.secondary',
                            fontWeight: 500
                        }}
                    >
                        Sign in to your account
                    </Typography>
                </Box>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }
                            }
                        }}
                    />
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }
                            }
                        }}
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                            mt: 2,
                            mb: 3,
                            py: 1.5,
                            borderRadius: 2,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                                background: 'linear-gradient(45deg, #5a6fd8, #6a4190)'
                            },
                            '&:disabled': {
                                background: 'linear-gradient(45deg, #ccc, #999)'
                            }
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{ color: 'white' }} />
                        ) : (
                            name
                        )}
                    </Button>
                    
                    <Divider sx={{ my: 2, opacity: 0.6 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            OR
                        </Typography>
                    </Divider>
                    
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => navigate("/register")}
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontSize: '1rem',
                            fontWeight: 500,
                            borderColor: '#667eea',
                            color: '#667eea',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                borderColor: '#764ba2',
                                color: '#764ba2',
                                backgroundColor: 'rgba(102, 126, 234, 0.05)',
                                transform: 'translateY(-1px)'
                            }
                        }}
                    >
                        Don't have an account? Register
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default LoginForm;