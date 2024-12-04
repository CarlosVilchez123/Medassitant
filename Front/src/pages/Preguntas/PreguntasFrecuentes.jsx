import React, { useState } from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  AppBar,
  Toolbar,
  Avatar,
  TextField,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

export default function PreguntasFrecuentes() {
  const navigate = useNavigate();

  // Preguntas frecuentes iniciales
  const faqData = [
    {
      question: "¿Cómo puedo agendar una consulta médica?",
      answer: "Para agendar una consulta, ve al apartado de 'Agendar Cita', selecciona el doctor y la especialidad de tu preferencia y elige la fecha y hora disponible.",
    },
    {
      question: "¿Qué tipo de consultas están disponibles?",
      answer: "Ofrecemos consultas en diversas especialidades, como Medicina General, Cardiología, Odontología, y más. Revisa el listado en el apartado de especialidades para conocer todas nuestras opciones.",
    },
    {
      question: "¿Puedo cancelar o reprogramar mi cita?",
      answer: "Sí, puedes cancelar o reprogramar tu cita desde tu perfil. Solo asegúrate de hacerlo con al menos 24 horas de anticipación para evitar penalizaciones.",
    },
    {
      question: "¿Qué necesito llevar para mi consulta?",
      answer: "Por favor lleva tu identificación y, si es necesario, cualquier informe médico o estudios previos. Esto ayudará al doctor a ofrecerte una mejor atención.",
    },
    {
      question: "¿Cómo puedo contactar al soporte en caso de problemas?",
      answer: "Si tienes problemas con la plataforma, puedes contactar a soporte mediante el chat de ayuda en la esquina inferior derecha de la aplicación.",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState(faqData);

  // Función para manejar la búsqueda
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    // Filtra las preguntas frecuentes que incluyen el término de búsqueda
    const filtered = faqData.filter(
        (faq) => faq.question.toLowerCase().includes(value) || faq.answer.toLowerCase().includes(value)
    );
    setFilteredFaqs(filtered);
  };

  return (
      <Box sx={{ flexGrow: 1, backgroundColor: "#f9f9f9", minHeight: "100vh", pb: 4 }}>
        {/* Barra de Navegación */}
        <AppBar
            position="static"
            elevation={2}
            sx={{
              background: "linear-gradient(90deg, #004E92, #3A8FB7, #00C3FF)", // Degradado azul
              color: "white",
            }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
              MedAssistant - Preguntas Frecuentes
            </Typography>
            <Avatar
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.3)",
                  color: "white",
                  border: "2px solid white",
                  cursor: "pointer",
                  "&:hover": { transform: "scale(1.1)", transition: "0.2s" },
                }}
                onClick={() => navigate("/")}
            >
              U
            </Avatar>
          </Toolbar>
        </AppBar>

        {/* Sección de Preguntas Frecuentes */}
        <Container maxWidth="md" sx={{ mt: 5 }}>
          <Typography
              variant="h4"
              component="h1"
              gutterBottom
              textAlign="center"
              sx={{ fontWeight: "bold", color: "#004E92" }}
          >
            Preguntas Frecuentes
          </Typography>

          {/* Campo de Búsqueda */}
          <TextField
              label="Buscar en preguntas frecuentes"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                ),
              }}
              sx={{
                mb: 4,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
          />

          {/* Acordeón de Preguntas Filtradas */}
          {filteredFaqs.map((faq, index) => (
              <Accordion
                  key={index}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    "&:before": { display: "none" }, // Quita la línea superior predeterminada
                  }}
              >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                    sx={{
                      backgroundColor: "#e3f2fd",
                      borderBottom: "1px solid #90caf9",
                    }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004E92" }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: "#ffffff", padding: 2 }}>
                  <Typography variant="body1" sx={{ color: "#555" }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
          ))}

          {/* Mensaje si no hay resultados */}
          {filteredFaqs.length === 0 && (
              <Typography
                  variant="body1"
                  sx={{ color: "#555", textAlign: "center", mt: 4, fontStyle: "italic" }}
              >
                No se encontraron resultados para "{searchTerm}"
              </Typography>
          )}
        </Container>
      </Box>
  );
}
