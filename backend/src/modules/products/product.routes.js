// Rotas responsáveis pelas operações relacionadas aos produtos

const { Router } = require("express");

const productController = require("./product.controller");

const router = Router();

router.get("/", productController.findAll);
router.get("/:id", productController.findById);
router.post("/", productController.create);
router.put("/:id", productController.update);
router.delete("/:id", productController.remove);

module.exports = router;