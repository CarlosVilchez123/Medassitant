import app from "./App.js";

const PORT = 3000;

app.listen(PORT, '192.168.18.20',() => {
    console.log(`Servidor corriendo en http://192.168.18.20:${PORT}`);
});
