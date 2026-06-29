// Rotas responsáveis pelas operações relacionadas aos produtos

const express = require("express");
const router = express.Router();

const productController = require("./product.controller");

router.get('/', productController.findAll);
router.get('/:id', productController.findById);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.remove);

module.exports = router;