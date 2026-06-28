const express = require("express");
const AppDataSource = require("./database/data-source");
const movementRoutes = require("./modules/movements/movement.routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
res.send("API de Controle de Estoque funcionando!");
});

app.use(movementRoutes);

AppDataSource.initialize()
.then(() => {
    console.log("Banco conectado com sucesso!");

    app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    });
})
.catch((error) => {
    console.error("Erro ao conectar ao banco:", error);
});