const { Router } = require("express");
const productController = require("./product.controller");

const productRoutes = Router();
productRoutes.get("/products", productController.list);
productRoutes.get("/products/:id", productController.getById);
productRoutes.post("/products", productController.create);
productRoutes.put("/products/:id", productController.update);
productRoutes.delete("/products/:id", productController.delete);

module.exports = productRoutes;
