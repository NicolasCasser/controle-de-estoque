// Configuração do TypeORM e conexão com o PostgreSQL.

const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../../.env")
});

const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    // Cria e atualiza tabelas automaticamente baseado nas entidades
    synchronize: true,

    entities: [
        "src/modules/**/*.entity.js"
    ]
});

module.exports = AppDataSource