import { getPacientes, getPacienteById, createPaciente, updatePaciente, deletePaciente } from "./Paciente.js";

export const chatbotHandler = async (message) => {
    const lowerMessage = message.toLowerCase().trim();

    try {
        if (lowerMessage.includes("lista de pacientes")) {
            // Devuelve todos los pacientes
            const pacientes = await getPacientes();
            if (pacientes.length === 0) {
                return "No hay pacientes registrados.";
            }
            return `Lista de pacientes: ${pacientes
                .map((p) => `${p.Nombre} ${p.Apellidos}`)
                .join(", ")}`;
        } else if (lowerMessage.startsWith("detalles de paciente")) {
            // Detalles de un paciente por ID
            const id = parseInt(lowerMessage.split("detalles de paciente")[1].trim());
            if (isNaN(id)) {
                return "Por favor proporciona un ID válido.";
            }
            const paciente = await getPacienteById(id);
            if (!paciente) {
                return `No se encontró un paciente con el ID ${id}.`;
            }
            return `Detalles del paciente:\nNombre: ${paciente.Nombre}\nApellidos: ${paciente.Apellidos}\nCorreo: ${paciente.CorreoElectronico}\nPeso: ${paciente.Peso} kg\nAltura: ${paciente.Altura} m`;
        } else if (lowerMessage.startsWith("crear paciente")) {
            // Crear un paciente (requiere datos en el mensaje)
            const datos = lowerMessage.split("crear paciente")[1].trim();
            const pacienteData = JSON.parse(datos); // Asegúrate de enviar un JSON válido
            await createPaciente(pacienteData);
            return "Paciente creado exitosamente.";
        } else if (lowerMessage.startsWith("actualizar paciente")) {
            // Actualizar un paciente por ID
            const datos = lowerMessage.split("actualizar paciente")[1].trim();
            const { id, ...pacienteData } = JSON.parse(datos); // Extrae ID y datos
            await updatePaciente(id, pacienteData);
            return `Paciente con ID ${id} actualizado exitosamente.`;
        } else if (lowerMessage.startsWith("eliminar paciente")) {
            // Eliminar un paciente por ID
            const id = parseInt(lowerMessage.split("eliminar paciente")[1].trim());
            if (isNaN(id)) {
                return "Por favor proporciona un ID válido.";
            }
            await deletePaciente(id);
            return `Paciente con ID ${id} eliminado exitosamente.`;
        } else if (lowerMessage.startsWith("recomienda paciente")) {
            // Leer el historial médico y recomendar funciones
            const id = parseInt(lowerMessage.split("recomienda paciente")[1].trim());
            if (isNaN(id)) {
                return "Por favor proporciona un ID válido.";
            }
            const paciente = await getPacienteById(id);
            if (!paciente) {
                return `No se encontró un paciente con el ID ${id}.`;
            }

            // Análisis básico del historial médico
            const historial = paciente.HistorialMedico?.toString() || "Sin historial registrado.";
            let recomendaciones = "";

            if (historial.toLowerCase().includes("diabetes")) {
                recomendaciones += "- Monitorear niveles de azúcar regularmente.\n";
                recomendaciones += "- Evitar alimentos altos en azúcar y carbohidratos.\n";
            }
            if (historial.toLowerCase().includes("hipertension")) {
                recomendaciones += "- Reducir el consumo de sal.\n";
                recomendaciones += "- Realizar ejercicio moderado regularmente.\n";
            }
            if (historial.toLowerCase().includes("asma")) {
                recomendaciones += "- Evitar ambientes polvorientos o con alérgenos.\n";
                recomendaciones += "- Llevar siempre un inhalador de emergencia.\n";
            }

            if (recomendaciones === "") {
                recomendaciones = "No se encontraron condiciones específicas en el historial médico.";
            }

            return `Recomendaciones para el paciente ${paciente.Nombre} ${paciente.Apellidos}:\n${recomendaciones}`;
        } else {
            return "No entiendo tu solicitud. Prueba con: 'lista de pacientes', 'detalles de paciente [ID]', 'crear paciente', 'actualizar paciente', 'eliminar paciente' o 'recomienda paciente [ID]'.";
        }
    } catch (error) {
        console.error(error);
        return "Ocurrió un error al procesar tu solicitud. Inténtalo de nuevo.";
    }
};
