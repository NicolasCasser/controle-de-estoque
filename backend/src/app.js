// Configuração principal da aplicação e inicialização do servidor.

const express = require("express");
const AppDataSource = require("./database/data-source");

const productRoutes = require("./modules/products/product.routes");

const app = express();
const port = 3000;

app.use(express.json());

// Rotas da aplicação
app.use("/products", productRoutes);

app.get("/", (req, res) => {
    res.send("API do Sistema de Controle de Estoque");
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