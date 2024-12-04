export const queries = {
    getAllItems: "SELECT * FROM Paciente",
    getItemById: "SELECT * FROM Items WHERE Id = @Id",
    createItem: "INSERT INTO Items (Name, Description) VALUES (@Name, @Description)",
    updateItem: "UPDATE Items SET Name = @Name, Description = @Description WHERE Id = @Id",
    deleteItem: "DELETE FROM Items WHERE Id = @Id",
};
