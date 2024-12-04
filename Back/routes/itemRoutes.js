import { Router } from "express";
import { loginUser, getItems, getItemById, createPaciente, deleteItem,

    agendarCita, getHorariosOcupados, getDoctors
 } from "../controllers/itemController.js";
import { getChatResponse } from "../chatcontrollers/chatController.js";


const router = Router();

router.get("/allpacientes", getItems);
router.get("/doc", getDoctors);
router.get("/horarios-ocupados/:id", getHorariosOcupados);

router.get("/:id", getItemById);
router.post("/register", createPaciente);
router.post("/login", loginUser);
router.delete("/:id", deleteItem);
router.post("/chat", getChatResponse)
 // Obtener horarios ocupados para un doctor
router.post("/agendar-cita", agendarCita); // Agendar una cita

export default router;
