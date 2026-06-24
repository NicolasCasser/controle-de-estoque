const express = require("express");
const AppDataSource = require("./database/data-source");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

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