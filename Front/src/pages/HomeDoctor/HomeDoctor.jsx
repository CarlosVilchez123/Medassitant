import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Avatar, Box, Container, Grid, TextField, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import SendIcon from "@mui/icons-material/Send";

export default function HomeDoctor() {
  const navigate = useNavigate();

  // Eventos simulados para las citas agendadas
  const [events] = useState([
    { title: "Cita con Juan Pérez", start: "2023-12-01T10:00:00", end: "2023-12-01T11:00:00" },
    { title: "Cita con María Gómez", start: "2023-12-02T14:00:00", end: "2023-12-02T15:00:00" },
    { title: "Cita con Carlos Díaz", start: "2023-12-03T09:00:00", end: "2023-12-03T10:30:00" },
  ]);

  // Estado para manejar los mensajes del chat
  const [messages, setMessages] = useState([
    { sender: "patient", text: "Hola doctor, tengo una pregunta sobre mi cita." },
    { sender: "doctor", text: "Claro, dime en qué puedo ayudarte." },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Manejo del envío de mensajes
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    setMessages((prevMessages) => [...prevMessages, { sender: "doctor", text: newMessage }]);
    setNewMessage("");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Barra de Navegación */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "linear-gradient(90deg, #004E92, #3A8FB7, #00C3FF)", // Degradado azul
          color: "white",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", // Sombra para resaltar
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            MedAssistant - Doctor
          </Typography>
          <Avatar
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.3)", // Fondo semi-transparente
              color: "white",
              border: "2px solid white",
            }}
            onClick={() => navigate("/")} // Redirige a la página de inicio al hacer clic en el avatar
          >
            D
          </Avatar>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          {/* Sección de Citas Agendadas */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom textAlign="center">
              Citas Agendadas
            </Typography>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek" // Vista semanal
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={events} // Eventos de citas agendadas
              editable={false} // Desactiva la edición de eventos
              selectable={false} // Desactiva la selección de fechas
              height="70vh"
              eventClick={(info) => alert(`Cita: ${info.event.title}`)} // Muestra detalles de la cita al hacer clic
            />
          </Grid>

          {/* Sección de Chat con Pacientes */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom textAlign="center">
              Chat con Pacientes
            </Typography>
            <Paper
              elevation={3}
              sx={{
                height: "70vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 2,
              }}
            >
              {/* Contenedor de Mensajes */}
              <Box sx={{ overflowY: "auto", mb: 2, flexGrow: 1 }}>
                {messages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: msg.sender === "doctor" ? "flex-end" : "flex-start",
                      mb: 1,
                    }}
                  >
                    <Paper
                      sx={{
                        maxWidth: "75%",
                        padding: 1,
                        backgroundColor: msg.sender === "doctor" ? "#3A8FB7" : "#E0E0E0",
                        color: msg.sender === "doctor" ? "white" : "black",
                      }}
                    >
                      {msg.text}
                    </Paper>
                  </Box>
                ))}
              </Box>

              {/* Campo de Entrada y Botón de Enviar */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  placeholder="Escribe un mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  sx={{ marginRight: 1 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  onClick={handleSendMessage}
                >
                  Enviar
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
