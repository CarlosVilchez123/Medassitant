import { getConection, mssql } from "../database/conectionSQLserver.js";
import { queries } from "../models/itemModel.js";

export const getItems = async (req, res) => {
    try {
        const pool = await getConection();
        const result = await pool.request().query(queries.getAllItems);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(`Error al obtener los datos: ${error.message}`);
    }
};

export const getItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConection();
        const result = await pool.request()
            .input("Id", mssql.Int, id)
            .query(queries.getItemById);
        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).send(`Error al obtener el registro: ${error.message}`);
    }
};

export const createPaciente = async (req, res) => {
    console.log("End point de creación de paciente funcionando")
    const {
        nombre,
        apellidos,
        fechaNacimiento,
        genero,
        correoElectronico,
        numeroTelefonico,
        contrasena,
        peso,
        altura,
        historialMedico,
        alergias,
        medicamentosQueToma,
        habitosAlimenticios,
    } = req.query;

    console.log(        nombre,
        apellidos,
        fechaNacimiento,
        genero,
        correoElectronico,
        numeroTelefonico,
        contrasena,
        peso,
        altura,
        historialMedico,
        alergias,
        medicamentosQueToma,
        habitosAlimenticios,)

    // Validar que los parámetros requeridos existan y sean válidos
    if (!nombre || !apellidos || !fechaNacimiento || !correoElectronico) {
        return res.status(400).json({ error: "Faltan parámetros obligatorios" });
    }

    try {
        const pesoNumerico = peso ? parseFloat(peso) : null;
        const alturaNumerica = altura ? parseFloat(altura) : null;

        const pool = await getConection();
        await pool.request()
            .input("Nombre", mssql.VarChar, nombre)
            .input("Apellidos", mssql.VarChar, apellidos)
            .input("FechaNacimiento", mssql.Date, fechaNacimiento)
            .input("Genero", mssql.VarChar, genero)
            .input("CorreoElectronico", mssql.VarChar, correoElectronico)
            .input("NumeroTelefonico", mssql.VarChar, numeroTelefonico)
            .input("Contrasena", mssql.VarChar, contrasena)
            .input("Peso", mssql.Float, pesoNumerico)
            .input("Altura", mssql.Float, alturaNumerica)
            .input("HistorialMedico", mssql.Text, historialMedico || null)
            .input("Alergias", mssql.Text, alergias || null)
            .input("MedicamentosQueToma", mssql.Text, medicamentosQueToma || null)
            .input("HabitosAlimenticios", mssql.Text, habitosAlimenticios)
            .query(`
                INSERT INTO Paciente (
                    Nombre, Apellidos, FechaNacimiento, Genero, CorreoElectronico, 
                    NumeroTelefonico, Contrasena, Peso, Altura, HistorialMedico, 
                    Alergias, MedicamentosQueToma, HabitosAlimenticios
                ) VALUES (
                    @Nombre, @Apellidos, @FechaNacimiento, @Genero, @CorreoElectronico,
                    @NumeroTelefonico, @Contrasena, @Peso, @Altura, @HistorialMedico,
                    @Alergias, @MedicamentosQueToma, @HabitosAlimenticios
                )
            `);

        res.status(201).send("Paciente registrado exitosamente");
    } catch (error) {
        console.error("Error en createPaciente:", error);
        res.status(201).json({ message: "Paciente registrado exitosamente" });
    }
};


export const deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConection();
        await pool.request()
            .input("Id", mssql.Int, id)
            .query(queries.deleteItem);
        res.status(200).send("Registro eliminado exitosamente");
    } catch (error) {
        res.status(500).send(`Error al eliminar el registro: ${error.message}`);
    }
};

export const loginUser = async (req, res) => {
    const { usuario, contrasena } = req.body; // Asegúrate de enviar datos en el cuerpo de la solicitud

    console.log(usuario)
    if (!usuario || !contrasena) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
  
    try {
      const pool = await getConection();
  
      // Consulta para validar usuario y contraseña
      const result = await pool
        .request()
        .input("CorreoElectronico", mssql.VarChar, usuario) // Ajusta según tu campo
        .input("Contrasena", mssql.VarChar, contrasena)
        .query(`
          SELECT ID, Nombre, Apellidos
          FROM Paciente
          WHERE CorreoElectronico = @CorreoElectronico AND Contrasena = @Contrasena
        `);
  
      if (result.recordset.length === 0) {
        return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
      }
  
      // Usuario válido
      const user = result.recordset[0];
  
      return res.status(200).json({
        message: "Inicio de sesión exitoso",
        user: {
          id: user.ID,
          nombre: user.Nombre,
          apellidos: user.Apellidos,
        },
      });
    } catch (error) {
      console.error("Error en loginUser:", error);
      res.status(500).json({ error: "Error al procesar la solicitud" });
    }
  };

  export const getHorariosOcupados = async (req, res) => {
    const { id } = req.params; // Usa `id` desde req.params

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "El ID del doctor debe ser un número válido" });
    }

    try {
        const pool = await getConection();
        const result = await pool.request()
            .input("DoctorID", mssql.Int, parseInt(id)) // Convierte el ID a número entero
            .query(`
                SELECT FechaHora 
                FROM Citas
                WHERE DoctorID = @DoctorID
            `);

        const horariosOcupados = result.recordset.map((cita) => ({
            start: cita.FechaHora,
            end: new Date(new Date(cita.FechaHora).getTime() + 30 * 60000),
        }));

        res.json(horariosOcupados);
    } catch (error) {
        console.error("Error al obtener horarios ocupados:", error);
        res.status(500).json({ error: "Error interno al obtener horarios ocupados" });
    }
};


export const agendarCita = async (req, res) => {
    const { doctorId, pacienteId, fechaHora, motivo } = req.body;

    // Validar datos requeridos
    if (!doctorId || !pacienteId || !fechaHora || !motivo) {
        return res.status(400).json({ error: "Todos los datos son obligatorios" });
    }

    try {
        const pool = await getConection();
        await pool.request()
            .input("DoctorID", mssql.Int, doctorId)
            .input("PacienteID", mssql.Int, pacienteId)
            .input("FechaHora", mssql.DateTime, fechaHora)
            .input("Motivo", mssql.NVarChar, motivo)
            .query(`
                INSERT INTO Citas (DoctorID, PacienteID, FechaHora, Motivo)
                VALUES (@DoctorID, @PacienteID, @FechaHora, @Motivo)
            `);

        res.status(201).json({ message: "Cita agendada exitosamente" });
    } catch (error) {
        console.error("Error al agendar cita:", error);
        res.status(500).json({ error: "Error interno al agendar cita" });
    }
};

export const getDoctors = async (req, res) => {
    console.log("entro a este endpoint de doctores")
    try {
        const pool = await getConection();
        const result = await pool.request().query(`
            SELECT ID, Nombre, Especialidad
            FROM Doctor
        `);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(`Error al obtener los datos: ${error.message}`);
    }
};
