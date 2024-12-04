import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link as MuiLink } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../userContext"
import Image from "../../assets/login_img.jpeg"; 

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(""); // Limpiar errores previos

    try {
      const response = await fetch("http://192.168.18.20:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario, contrasena }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Inicio de sesión exitoso:", data);
        setUser(data.user); // Guardar el usuario en el contexto
        navigate("/home"); // Redirigir tras inicio exitoso
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={Image} 
          alt="Medical Icon"
          sx={{
            width: 400,
            height:"100%",
            objectFit: "cover",
          }}
        />

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
            width: 300,
          }}
          onSubmit={(e) => {
            e.preventDefault(); // Evitar el comportamiento predeterminado del formulario
            handleLogin();
          }}
        >
          <Typography variant="h5" mb={2}>
            Login
          </Typography>

          {error && (
            <Typography color="error" variant="body2" mb={2}>
              {error}
            </Typography>
          )}

          <TextField
            label="Usuario"
            variant="standard"
            margin="normal"
            fullWidth
            required
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <TextField
            label="Contraseña"
            type="password"
            variant="standard"
            margin="normal"
            fullWidth
            required
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, backgroundColor: "#3B82F6", borderRadius: "12px" }}
            type="submit"
          >
            Entrar
          </Button>

          <Typography variant="body2" mt={2}>
            ¿No tienes cuenta?{" "}
            <Link to="/register" style={{ color: "#3B82F6", textDecoration: "none" }}>
              registrarse
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
