import { getConection, mssql } from "./database/conectionSQLserver.js";

// Obtener todos los pacientes
export const getPacientes = async () => {
    try {
        const pool = await getConection();
        const result = await pool.request().query("SELECT * FROM Paciente");
        console.log(result.recordset);
        return result.recordset;
    } catch (error) {
        console.error(error);
    }
};

// Obtener un paciente por ID
export const getPacienteById = async (id) => {
    try {
        const pool = await getConection();
        const result = await pool.request()
            .input('ID', mssql.Int, id)
            .query("SELECT * FROM Paciente WHERE ID = @ID");
        console.log(result.recordset[0]);
        return result.recordset[0];
    } catch (error) {
        console.error(error);
    }
};

// Crear un nuevo paciente
export const createPaciente = async (paciente) => {
    const {
        Nombre,
        Apellidos,
        FechaNacimiento,
        Genero,
        CorreoElectronico,
        NumeroTelefonico,
        Contrasena,
        Peso,
        Altura,
        HistorialMedico,
        Alergias,
        MedicamentosQueToma,
        HabitosAlimenticios
    } = paciente;

    try {
        const pool = await getConection();
        await pool.request()
            .input('Nombre', mssql.NVarChar(50), Nombre)
            .input('Apellidos', mssql.NVarChar(50), Apellidos)
            .input('FechaNacimiento', mssql.Date, FechaNacimiento)
            .input('Genero', mssql.NVarChar(20), Genero)
            .input('CorreoElectronico', mssql.NVarChar(100), CorreoElectronico)
            .input('NumeroTelefonico', mssql.NVarChar(15), NumeroTelefonico)
            .input('Contrasena', mssql.NVarChar(255), Contrasena)
            .input('Peso', mssql.Decimal(5, 2), Peso)
            .input('Altura', mssql.Decimal(5, 2), Altura)
            .input('HistorialMedico', mssql.VarBinary, HistorialMedico)
            .input('Alergias', mssql.NVarChar, Alergias)
            .input('MedicamentosQueToma', mssql.NVarChar, MedicamentosQueToma)
            .input('HabitosAlimenticios', mssql.NVarChar, HabitosAlimenticios)
            .query(`
                INSERT INTO Paciente (Nombre, Apellidos, FechaNacimiento, Genero, CorreoElectronico, NumeroTelefonico, Contrasena, Peso, Altura, HistorialMedico, Alergias, MedicamentosQueToma, HabitosAlimenticios)
                VALUES (@Nombre, @Apellidos, @FechaNacimiento, @Genero, @CorreoElectronico, @NumeroTelefonico, @Contrasena, @Peso, @Altura, @HistorialMedico, @Alergias, @MedicamentosQueToma, @HabitosAlimenticios)
            `);
        console.log("Paciente creado exitosamente.");
    } catch (error) {
        console.error(error);
    }
};

// Actualizar un paciente por ID
export const updatePaciente = async (id, paciente) => {
    const {
        Nombre,
        Apellidos,
        FechaNacimiento,
        Genero,
        CorreoElectronico,
        NumeroTelefonico,
        Contrasena,
        Peso,
        Altura,
        HistorialMedico,
        Alergias,
        MedicamentosQueToma,
        HabitosAlimenticios
    } = paciente;

    try {
        const pool = await getConection();
        await pool.request()
            .input('ID', mssql.Int, id)
            .input('Nombre', mssql.NVarChar(50), Nombre)
            .input('Apellidos', mssql.NVarChar(50), Apellidos)
            .input('FechaNacimiento', mssql.Date, FechaNacimiento)
            .input('Genero', mssql.NVarChar(20), Genero)
            .input('CorreoElectronico', mssql.NVarChar(100), CorreoElectronico)
            .input('NumeroTelefonico', mssql.NVarChar(15), NumeroTelefonico)
            .input('Contrasena', mssql.NVarChar(255), Contrasena)
            .input('Peso', mssql.Decimal(5, 2), Peso)
            .input('Altura', mssql.Decimal(5, 2), Altura)
            .input('HistorialMedico', mssql.VarBinary, HistorialMedico)
            .input('Alergias', mssql.NVarChar, Alergias)
            .input('MedicamentosQueToma', mssql.NVarChar, MedicamentosQueToma)
            .input('HabitosAlimenticios', mssql.NVarChar, HabitosAlimenticios)
            .query(`
                UPDATE Paciente
                SET Nombre = @Nombre,
                    Apellidos = @Apellidos,
                    FechaNacimiento = @FechaNacimiento,
                    Genero = @Genero,
                    CorreoElectronico = @CorreoElectronico,
                    NumeroTelefonico = @NumeroTelefonico,
                    Contrasena = @Contrasena,
                    Peso = @Peso,
                    Altura = @Altura,
                    HistorialMedico = @HistorialMedico,
                    Alergias = @Alergias,
                    MedicamentosQueToma = @MedicamentosQueToma,
                    HabitosAlimenticios = @HabitosAlimenticios
                WHERE ID = @ID
            `);
        console.log("Paciente actualizado exitosamente.");
    } catch (error) {
        console.error(error);
    }
};

// Eliminar un paciente por ID
export const deletePaciente = async (id) => {
    try {
        const pool = await getConection();
        await pool.request()
            .input('ID', mssql.Int, id)
            .query("DELETE FROM Paciente WHERE ID = @ID");
        console.log("Paciente eliminado exitosamente.");
    } catch (error) {
        console.error(error);
    }
};
