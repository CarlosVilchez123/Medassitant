import React, { useState, useEffect } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Avatar,
    Box,
    Container,
    Grid,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

export default function AgendarCita() {
    const navigate = useNavigate();

    const specialties = [
        { id: "Medicina General", name: "Medicina General" },
        { id: "Cardiología", name: "Cardiología" },
        { id: "Odontología", name: "Odontología" },
    ];

    const [doctors, setDoctors] = useState([]); // Lista de doctores desde la BD
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [events, setEvents] = useState([]);
    const [occupiedEvents, setOccupiedEvents] = useState([]);

    // Obtener la lista de doctores desde el backend
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch("http://192.168.18.20:3000/api/doc");
                const data = await response.json();
                setDoctors(data);
                console.log("Doctores cargados:", data); // Verificar la estructura de datos
            } catch (error) {
                console.error("Error al cargar doctores:", error);
            }
        };

        fetchDoctors();
    }, []);

    // Filtrar doctores por especialidad seleccionada
    const filteredDoctors = doctors.filter((doc) => doc.Especialidad === selectedSpecialty);

    // Cargar horarios ocupados cuando se selecciona un doctor
    useEffect(() => {
        const fetchOccupiedSlots = async () => {
            if (selectedDoctor) {
                try {
                    const response = await fetch(`http://192.168.18.20:3000/api/horarios-ocupados/${selectedDoctor}`);
                    const data = await response.json();
    
                    console.log("Horarios ocupados recibidos desde la API:", data);
    
                    const mappedEvents = data.map((event) => ({
                        title: "Ocupado",
                        start: event.start,
                        end: event.end || new Date(new Date(event.start).getTime() + 30 * 60000).toISOString(),
                        allDay: false,
                    }));
    
                    console.log("Eventos mapeados para FullCalendar:", mappedEvents);
    
                    setOccupiedEvents(mappedEvents);
                    console.log(occupiedEvents)
                } catch (error) {
                    console.error("Error al cargar horarios ocupados:", error);
                }
            }
        };
    
        fetchOccupiedSlots();
    }, [selectedDoctor]);
    
    

    // Agendar cita
    const handleDateSelect = async (selectInfo) => {
        if (!selectedSpecialty || !selectedDoctor) {
            alert("Por favor, seleccione una especialidad y un doctor antes de agendar una cita.");
            return;
        }

        const motivo = prompt("Ingrese el motivo de la cita:");
        if (!motivo) return;

        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();

        try {
            const response = await fetch("http://192.168.18.20:3000/api/agendar-cita", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    doctorId: selectedDoctor,
                    pacienteId: 1, // Reemplaza con el ID del paciente
                    fechaHora: selectInfo.startStr,
                    motivo,
                }),
            });

            if (response.ok) {
                setEvents([
                    ...events,
                    {
                        id: String(events.length + 1),
                        title: `${motivo} - ${selectedDoctor}`,
                        start: selectInfo.startStr,
                        end: selectInfo.endStr,
                        allDay: selectInfo.allDay,
                    },
                ]);
                alert("Cita agendada exitosamente.");
            } else {
                alert("Error al agendar la cita.");
            }
        } catch (error) {
            console.error("Error al guardar la cita:", error);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            {/* Barra de Navegación */}
            <AppBar position="static" sx={{ background: "linear-gradient(90deg, #004E92, #3A8FB7, #00C3FF)", color: "white" }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        MedAssistant - Agendar cita
                    </Typography>
                    <Avatar
                        sx={{ bgcolor: "rgba(255, 255, 255, 0.3)", color: "white", border: "2px solid white", cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        U
                    </Avatar>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Paper
                            elevation={3}
                            sx={{ padding: 3, borderRadius: 3, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: "#ffffff" }}
                        >
                            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#004E92" }}>
                                Seleccione especialidad y doctor
                            </Typography>

                            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Especialidad</InputLabel>
                                    <Select
                                        value={selectedSpecialty}
                                        onChange={(e) => {
                                            setSelectedSpecialty(e.target.value);
                                            setSelectedDoctor("");
                                        }}
                                    >
                                        {specialties.map((specialty) => (
                                            <MenuItem key={specialty.id} value={specialty.id}>
                                                {specialty.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth disabled={!selectedSpecialty}>
                                    <InputLabel>Doctor</InputLabel>
                                    <Select
                                        value={selectedDoctor}
                                        onChange={(e) => setSelectedDoctor(e.target.value)}
                                    >
                                        {filteredDoctors.map((doctor) => (
                                            <MenuItem key={doctor.ID} value={doctor.ID}>
                                                {doctor.Nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Typography variant="h5" sx={{ mb: 2, textAlign: "center", color: "#004E92" }}>
                                Calendario de citas
                            </Typography>

                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="timeGridWeek"
                                locales={[esLocale]}
                                locale="es"
                                headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
                                slotMinTime="08:00:00"
                                slotMaxTime="18:00:00"
                                slotDuration="00:30:00"                            
                                events={[...occupiedEvents, ...events]}
                                selectable={true}
                                selectMirror={true}
                                select={handleDateSelect}
                                editable={false}
                                height="65vh"
                                eventClick={(info) => alert(`Cita: ${info.event.title}`)}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
