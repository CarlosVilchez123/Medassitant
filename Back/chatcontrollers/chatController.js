import axios from "axios";

const API_KEY = "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"; // Reemplaza con tu clave de API
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"; // URL del endpoint de Groq AI

export const getChatResponse = async (req, res) => {
    console.log("Iniciando el controlador del chatbot...");

    const { userInput, apiKey } = req.body;

    // Validar la clave de API
    if (apiKey !== API_KEY) {
        console.error("Clave de API inválida:", apiKey);
        return res.status(403).json({ error: "Clave de API no válida" });
    }

    // Validar entrada del usuario
    if (!userInput || userInput.trim().length === 0) {
        console.error("Input del usuario vacío o inválido.");
        return res.status(400).json({ error: "El input del usuario es obligatorio" });
    }

    console.log("Entrada del usuario:", userInput);

    try {
        // Solicitud a Groq API
        const response = await axios.post(
            GROQ_API_URL,
            {
                model: "llama3-8b-8192", // Modelo que deseas usar
                messages: [
                    { role: "system", content: "Eres un asistente útil. Responde de manera breve, clara y completa." }, // Instrucción al chatbot
                    { role: "user", content: userInput },
                ],
                max_tokens: 5000, // Aumentar ligeramente para respuestas completas
                temperature: 0.5, // Reducir creatividad para precisión
                top_p: 1, // Priorizar respuestas con alta probabilidad
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                },
            }
        );

        const botResponse = response.data.choices[0]?.message?.content || "Lo siento, no puedo responder en este momento.";
        console.log("Respuesta de Groq API:", botResponse);

        // Respuesta al cliente
        return res.status(200).json({
            question: userInput,
            response: botResponse,
        });
    } catch (error) {
        console.error("Error en la solicitud a Groq API:", error.response?.data || error.message);
        return res.status(500).json({ error: "Error interno en el servidor" });
    }
};

