require("reflect-metadata");
require("dotenv").config();

const { DataSource } = require("typeorm");

const Product = require("../modules/products/product.entity");
const Movement = require("../modules/movements/movement.entity");

const AppDataSource = new DataSource({
type: "postgres",
host: process.env.DB_HOST || "localhost",
port: Number(process.env.DB_PORT) || 5432,
username: process.env.DB_USER || "postgres",
password: process.env.DB_PASSWORD || "postgres",
database: process.env.DB_NAME || "estoque_pi",
synchronize: true,
logging: false,
entities: [Product, Movement],
});

module.exports = AppDataSource;