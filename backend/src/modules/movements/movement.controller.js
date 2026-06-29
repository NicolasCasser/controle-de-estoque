// Controller responsável por receber requisições relacionadas às movimentações

const movementService = require("./movement.service");

class MovementController {
    // Lista movimentações cadastradas
    async list(req, res) {
        try {
            const { tipo } = req.query;

            const movements = await movementService.listMovements(tipo);

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
            const { productId, tipo, quantidade, observacao } = req.body;

            const movement = await movementService.createMovement({
                productId,
                tipo,
                quantidade,
                observacao,
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