// Controller responsável por receber requisições relacionadas às movimentações

const movementService = require("./movement.service");

class MovementController {
    // Lista movimentações cadastradas
    async list(req, res) {
        try {
            const { type } = req.query;

            const movements = await movementService.listMovements(type);

            return res.status(200).json(movements);

        } catch (error) {
            return res.status(400).json({
                message: error.message,
            });
        }
    }

    // Cria uma nova movimentação
    async create(req, res) {
        try {
            const { productId, type, quantity, observation } = req.body;

            const movement = await movementService.createMovement({
                productId,
                type,
                quantity,
                observation,
            });

            return res.status(201).json(movement);
            
        } catch (error) {
            return res.status(400).json({
                message: error.message,
            });
        }
    }
}

module.exports = new MovementController();