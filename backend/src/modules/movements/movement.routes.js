const { Router } = require("express");
const movementController = require("./movement.controller");

const movementRoutes = Router();

movementRoutes.get("/movements", movementController.list);
movementRoutes.post("/movements", movementController.create);

module.exports = movementRoutes;