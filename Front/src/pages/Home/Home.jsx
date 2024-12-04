import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Box, Avatar, Menu, MenuItem, Container, Grid, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import imgBackground from "../../assets/img_background.jpeg";
import { useUser } from "../../userContext";

export default function Home() {
    const { user } = useUser(); // Accede al usuario desde el contexto
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null); // Control del menú desplegable

    const services = [
        { label: "Preguntas Frecuentes", path: "/preguntasfrecuentes", description: "Encuentra respuestas a las preguntas más comunes sobre el servicio." },
        { label: "Recomendaciones de Vida", path: "/recomendacionesdevida", description: "Recibe consejos personalizados para mejorar tu estilo de vida y salud." },
        { label: "Programar Citas", path: "/agendarcita", description: "Agenda citas médicas con nuestros profesionales de salud." },
    ];

    const [hoveredService, setHoveredService] = useState(null);

    // Manejar el clic y cierre del menú desplegable
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        // Aquí podrías implementar la lógica de cerrar sesión
        console.log("Cerrar sesión");
        navigate("/"); // Redirige a la página de inicio de sesión
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Barra de Navegación */}
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    background: "linear-gradient(90deg, #004E92, #3A8FB7, #00C3FF)",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                        MedAssistant
                    </Typography>
                    <Avatar
                        sx={{
                            bgcolor: "rgba(255, 255, 255, 0.3)",
                            color: "white",
                            border: "2px solid white",
                            cursor: "pointer",
                        }}
                        onMouseEnter={handleMenuOpen}
                    >
                        {user?.nombre?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        onMouseLeave={handleMenuClose}
                        PaperProps={{
                            style: {
                                marginTop: "10px",
                            },
                        }}
                    >
                        <MenuItem disabled>Hola, {user?.nombre || "Usuario"}</MenuItem>
                        <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Sección de Bienvenida */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "70vh",
                    backgroundImage: `url(${imgBackground})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    position: "relative",
                    color: "white",
                    textAlign: "center",
                }}
            >
                {/* Capa de Superposición */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0, 0, 0, 0.4)",
                        backdropFilter: "blur(5px)",
                    }}
                />

                {/* Contenedor del Texto */}
                <Container
                    maxWidth="sm"
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(8px)",
                        padding: 4,
                        borderRadius: 3,
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                >
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            fontWeight: "bold",
                            fontSize: "3rem",
                            color: "#00C3FF",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                            animation: "fadeIn 2s ease-in-out",
                            "@keyframes fadeIn": {
                                from: { opacity: 0 },
                                to: { opacity: 1 },
                            },
                        }}
                    >
                        ¿Qué es <span style={{ color: "#004E92" }}>MedAssistant</span>?
                    </Typography>
                    <Typography
                        variant="body1"
                        mt={2}
                        sx={{
                            color: "#E0F7FA",
                            fontSize: "1.3rem",
                            lineHeight: 1.6,
                            animation: "slideIn 1.5s ease-in-out",
                            "@keyframes slideIn": {
                                from: { transform: "translateY(20px)", opacity: 0 },
                                to: { transform: "translateY(0)", opacity: 1 },
                            },
                        }}
                    >
                        Es una aplicación diseñada para facilitar el acceso remoto a la información médica confiable y personalizada,
                        permitiendo a los usuarios gestionar su salud de manera proactiva.
                    </Typography>
                </Container>
            </Box>

            {/* Sección de Servicios */}
            <Box sx={{ padding: 4, backgroundColor: "#F5F5F5" }}>
                <Container maxWidth="md">
                    <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}>
                        Servicios
                    </Typography>

                    <Grid container spacing={4}>
                        {services.map((item, index) => (
                            <Grid
                                item
                                xs={12}
                                key={item.label}
                                sx={{
                                    display: "flex",
                                    justifyContent: index % 2 === 0 ? "flex-start" : "flex-end",
                                }}
                            >
                                <Link to={item.path} style={{ textDecoration: "none", width: "100%", maxWidth: "500px" }}>
                                    <Paper
                                        elevation={4}
                                        onMouseEnter={() => setHoveredService(item.label)}
                                        onMouseLeave={() => setHoveredService(null)}
                                        sx={{
                                            height: 150,
                                            padding: 4,
                                            textAlign: "center",
                                            backgroundColor: "#004E92",
                                            color: "white",
                                            borderRadius: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexDirection: "column",
                                            ml: index % 2 === 0 ? 2 : 0,
                                            mr: index % 2 !== 0 ? 2 : 0,
                                            "&:hover": {
                                                backgroundColor: "#3A8FB7",
                                                transform: "scale(1.05)",
                                                transition: "all 0.3s ease",
                                            },
                                        }}
                                    >
                                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                            {item.label}
                                        </Typography>
                                        {hoveredService === item.label && (
                                            <Typography variant="body2" sx={{ mt: 1, color: "#ffffff", fontSize: "1rem" }}>
                                                {item.description}
                                            </Typography>
                                        )}
                                    </Paper>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}
