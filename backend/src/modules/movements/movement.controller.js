const movementService = require("./movement.service");

class MovementController {
async list(request, response) {
    try {
    const { tipo } = request.query;

    const movements = await movementService.listMovements(tipo);

    return response.status(200).json(movements);
    } catch (error) {
    return response.status(400).json({
        message: error.message,
    });
    }
}

async create(request, response) {
    try {
    const { productId, tipo, quantidade, observacao } = request.body;

    const movement = await movementService.createMovement({
        productId,
        tipo,
        quantidade,
        observacao,
    });

    return response.status(201).json(movement);
    } catch (error) {
    return response.status(400).json({
        message: error.message,
    });
    }
}
}

module.exports = new MovementController();