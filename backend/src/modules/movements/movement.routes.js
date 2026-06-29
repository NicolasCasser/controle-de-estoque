// Rotas responsáveis pelas operações relacionadas às movimentações

const { Router } = require("express");
const movementController = require("./movement.controller");

const router = Router();

router.get("/", movementController.list);
router.post("/", movementController.create);

module.exports = router;