import React, { useState } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(""); // "patient" o "doctor"
  const [openDialog, setOpenDialog] = useState(false); // Estado para controlar el modal
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    specialty: "", // Solo para doctor
    weight: "",
    height: "",
    medicalHistory: null,
    allergies: "",
    medications: "",
    dietaryHabits: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const steps = ["Escoge tu Rol", "Información Personal", "Información Adicional"];
  const API_URL = "http://192.168.18.20:3000/api/register"; // Cambia según la configuración de tu API

  const handleNext = () => setStep((prevStep) => prevStep + 1);
  const handleBack = () => setStep((prevStep) => prevStep - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    console.log("Datos del formulario actualizados:", updatedFormData)
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, medicalHistory: e.target.files[0] });
  };

  const handleRoleSelect = (e) => {
    setRole(e.target.value);
    setStep(1); // Avanza al siguiente paso automáticamente
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
  
    try {
      // Construir los parámetros de consulta en la URL
      const queryParams = new URLSearchParams();
  
      queryParams.append("role", role);
      queryParams.append("nombre", formData.firstName || "");
      queryParams.append("apellidos", formData.lastName || "");
      queryParams.append("fechaNacimiento", formData.birthDate || "");
      queryParams.append("genero", formData.gender || "");
      queryParams.append("correoElectronico", formData.email || "");
      queryParams.append("numeroTelefonico", formData.phone || "");
      queryParams.append("contrasena", formData.password || "");
  
      if (role === "doctor") {
        queryParams.append("specialty", formData.specialty || "");
      } else if (role === "patient") {
        queryParams.append("peso", formData.weight || "");
        queryParams.append("altura", formData.height || "");
        queryParams.append("alergias", formData.allergies || "");
        queryParams.append("medicamentosQueToma", formData.medications || "");
        queryParams.append("habitosAlimenticios", formData.dietaryHabits || "");
      }
  
      if (formData.medicalHistory) {
        queryParams.append("historialMedico", formData.medicalHistory);
      }
  
      // Crear la URL completa con parámetros
      const requestUrl = `${API_URL}?${queryParams.toString()}`;
  
      // Depurar la URL generada
      console.log("URL generada:", requestUrl);
  
      // Enviar los datos usando fetch
      const response = await fetch(requestUrl, {
        method: "POST",
      });
  
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
  
      if (response.status === 201 || response.status === 200) {
        setOpenDialog(true);
      } else {
        alert("Hubo un problema con el registro.");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud con fetch:", error);
      alert("Error al registrar. Inténtalo nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate("/"); // Redirige al login después de cerrar el modal
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: 3,
          p: 4,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            textAlign: "center",
            mb: 3,
          }}
        >
          ¡Bienvenido! Regístrate ahora
        </Typography>

        <Stepper activeStep={step} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  style: {
                    color: index <= step ? "#1976d2" : "#cfcfcf",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 3 }}>
          {step === 0 && (
            <FormControl fullWidth>
              <InputLabel>Selecciona tu rol</InputLabel>
              <Select value={role} onChange={handleRoleSelect}>
                <MenuItem value="patient">Paciente</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
              </Select>
            </FormControl>
          )}

          {step === 1 && (
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Nombre"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <TextField
                label="Apellidos"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <TextField
                label="Fecha de Nacimiento"
                name="birthDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
              <FormControl>
                <InputLabel>Género</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="male">Masculino</MenuItem>
                  <MenuItem value="female">Femenino</MenuItem>
                  <MenuItem value="other">Otro</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Correo Electrónico"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!isValidEmail(formData.email)}
                helperText={
                  !isValidEmail(formData.email) && "Introduce un correo válido"
                }
                required
              />
              <TextField
                label="Número Telefónico"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <TextField
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {role === "doctor" && (
                <TextField
                  label="Especialidad"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                />
              )}
            </Box>
          )}

          {step === 2 && role === "patient" && (
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Peso (kg)"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
              />
              <TextField
                label="Altura (cm)"
                name="height"
                value={formData.height}
                onChange={handleChange}
                required
              />
              <Button variant="contained" component="label">
                Adjuntar Historial Médico
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              <TextField
                label="Alergias"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                multiline
                rows={2}
              />
              <TextField
                label="Medicamentos que toma"
                name="medications"
                value={formData.medications}
                onChange={handleChange}
                multiline
                rows={2}
              />
              <TextField
                label="Hábitos Alimenticios"
                name="dietaryHabits"
                value={formData.dietaryHabits}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            {step > 0 && <Button onClick={handleBack}>Atrás</Button>}
            {step < steps.length - 1 && role === "patient" && (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={step === 0 && !role}
              >
                Siguiente
              </Button>
            )}
            {((step === steps.length - 1 && role === "patient") ||
              (step === 1 && role === "doctor")) && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Registrar"}
              </Button>
            )}
          </Box>
        </Box>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CheckCircleIcon color="success" />
              Registro Exitoso
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¡Tu registro se ha completado con éxito! Ahora puedes iniciar
              sesión en tu cuenta.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              color="primary"
              variant="contained"
            >
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
