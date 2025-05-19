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
    Paper
} from "@mui/material";

function LoginForm({ route, method }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(to right, #3a7bd5, #00d2ff)", // blue gradient
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: 5,
                    borderRadius: 3,
                    width: "100%",
                    maxWidth: 500,
                    backgroundColor: "rgba(255, 255, 255, 0.3)", // semi-transparent white
                    backdropFilter: "blur(10px)", // optional: glass effect
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    display="flex"
                    flexDirection="column"
                    gap={3}
                >
                    <Typography variant="h4" align="center" fontWeight="bold">
                        {name}
                    </Typography>

                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

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

export default LoginForm;
