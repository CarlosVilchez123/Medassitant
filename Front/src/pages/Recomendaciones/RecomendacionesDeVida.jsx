import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
    Grid,
    AppBar,
    Toolbar,
    Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import { useNavigate } from "react-router-dom";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function Recomendaciones() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { sender: "bot", text: "¡Hola! Soy tu asistente de estilo de vida. ¿En qué puedo ayudarte hoy?" },
    ]);
    const [userMessage, setUserMessage] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Para manejar el estado de carga
    const chatRef = useRef(null); // Referencia para el contenedor del chat

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = false;

    // Función para manejar el envío del mensaje
    const handleSendMessage = async (message) => {
        const textToSend = message || userMessage; // Usa el mensaje proporcionado o el estado actual

        if (textToSend.trim() === "") return;

        // Añade el mensaje del usuario a la conversación
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "user", text: textToSend },
        ]);

        setUserMessage(""); // Limpia el campo de entrada

        // Mostrar el mensaje de "Pensando..."
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", text: "Pensando..." },
        ]);

        // Llamar a la API del backend para obtener la respuesta
        try {
            setIsLoading(true);

            // Esperar 2 segundos antes de mostrar la respuesta
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const response = await fetch("http://192.168.18.20:3000/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userInput: textToSend,
                    apiKey: "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", // Clave de API
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Reemplazar el mensaje "Pensando..." con la respuesta real
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];
                    updatedMessages.pop(); // Eliminar el último mensaje ("Pensando...")
                    return [
                        ...updatedMessages,
                        { sender: "bot", text: data.response },
                    ];
                });
            } else {
                // Reemplazar "Pensando..." con un mensaje de error
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];
                    updatedMessages.pop();
                    return [
                        ...updatedMessages,
                        { sender: "bot", text: "Lo siento, no puedo responder en este momento." },
                    ];
                });
                console.error("Error en la API:", data.error);
            }
        } catch (error) {
            console.error("Error al conectarse con la API:", error.message);
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                updatedMessages.pop();
                return [
                    ...updatedMessages,
                    { sender: "bot", text: "Hubo un error al procesar tu solicitud." },
                ];
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartRecording = () => {
        setIsRecording(true);
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setUserMessage(transcript); // Actualiza el mensaje del usuario
            handleSendMessage(transcript); // Envía automáticamente el mensaje capturado
        };

        recognition.onerror = (event) => {
            console.error("Error en el reconocimiento:", event.error);
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };
    };

    const handleStopRecording = () => {
        recognition.stop();
        setIsRecording(false);
    };

    // Mover la barra de desplazamiento hacia abajo cuando haya nuevos mensajes
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <Box sx={{ flexGrow: 1 }}>
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
                        MedAssistant - Recomendaciones de Vida
                    </Typography>
                    <Avatar
                        sx={{
                            bgcolor: "rgba(255, 255, 255, 0.3)",
                            color: "white",
                            border: "2px solid white",
                        }}
                        onClick={() => navigate("/")}
                    >
                        U
                    </Avatar>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 5 }}>
                <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                    Chat de Estilo de Vida
                </Typography>

                <Paper
                    ref={chatRef} // Asignar referencia al contenedor del chat
                    elevation={3}
                    sx={{
                        padding: 3,
                        height: "60vh",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mb: 3,
                        bgcolor: "#f5f5f5",
                    }}
                >
                    {messages.map((msg, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                            }}
                        >
                            <Box
                                sx={{
                                    maxWidth: "75%",
                                    padding: 2,
                                    color: msg.sender === "user" ? "white" : "black",
                                    backgroundColor: msg.sender === "user" ? "#3A8FB7" : "#e0e0e0",
                                    borderRadius: 2,
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                    fontSize: "1rem",
                                    fontFamily: "Roboto, sans-serif",
                                    lineHeight: 1.5,
                                    whiteSpace: "pre-line",
                                    textAlign: "left",
                                }}
                            >
                                {msg.text}
                            </Box>
                        </Box>
                    ))}
                </Paper>

                <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={10} sm={8}>
                        <TextField
                            label="Escribe tu mensaje"
                            variant="outlined"
                            fullWidth
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            sx={{
                                backgroundColor: "#ffffff",
                                borderRadius: "24px",
                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "24px",
                                    paddingRight: "60px",
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={2} sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                            variant="contained"
                            color={isRecording ? "secondary" : "primary"}
                            onClick={() => {
                                if (userMessage.trim()) {
                                    handleSendMessage();
                                } else if (!isRecording) {
                                    handleStartRecording();
                                } else {
                                    handleStopRecording();
                                }
                            }}
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: 0,
                                padding: 0,
                                marginLeft: "-60px",
                                boxShadow: isRecording
                                    ? "0 0 15px rgba(255, 0, 0, 0.7)"
                                    : "none",
                            }}
                        >
                            {userMessage.trim() ? (
                                <SendIcon
                                    sx={{
                                        fontSize: 30,
                                        color: "white",
                                    }}
                                />
                            ) : (
                                <MicIcon
                                    sx={{
                                        fontSize: 30,
                                        color: "white",
                                    }}
                                />
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
