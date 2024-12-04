import express from "express";
import cors from "cors";
import itemRoutes from "./routes/itemRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Middleware para manejar JSON
app.use(express.urlencoded({ extended: true })); // Middleware para manejar datos URL encoded

// Rutas
app.use("/api/", itemRoutes);

export default app;