const AppDataSource = require("../../database/data-source");

class MovementService {
async listMovements(tipo) {
    const movementRepository = AppDataSource.getRepository("Movement");

    const where = {};

    if (tipo) {
    if (!["ENTRADA", "SAIDA"].includes(tipo)) {
        throw new Error("O tipo da movimentação deve ser ENTRADA ou SAIDA.");
    }

    where.tipo = tipo;
    }

    const movements = await movementRepository.find({
    where,
    relations: {
        product: true,
    },
    order: {
        createdAt: "DESC",
    },
    });

    return movements;
}

async createMovement({ productId, tipo, quantidade, observacao }) {
    if (!productId) {
    throw new Error("O produto é obrigatório.");
    }

    if (!tipo || !["ENTRADA", "SAIDA"].includes(tipo)) {
    throw new Error("O tipo da movimentação deve ser ENTRADA ou SAIDA.");
    }

    const quantidadeNumerica = Number(quantidade);

    if (Number.isNaN(quantidadeNumerica) || quantidadeNumerica <= 0) {
    throw new Error("A quantidade deve ser maior que zero.");
    }

    const movement = await AppDataSource.manager.transaction(
    async (transactionalEntityManager) => {
        const productRepository =
        transactionalEntityManager.getRepository("Product");

        const movementRepository =
        transactionalEntityManager.getRepository("Movement");

        const product = await productRepository.findOne({
        where: {
            id: productId,
        },
        });

        if (!product) {
        throw new Error("Produto não encontrado.");
        }

        if (product.deletedAt) {
        throw new Error("Produto excluído não pode receber novas movimentações.");
        }

        if (tipo === "ENTRADA") {
        product.quantidadeAtual += quantidadeNumerica;
        }

        if (tipo === "SAIDA") {
        if (quantidadeNumerica > product.quantidadeAtual) {
            throw new Error(
            "Quantidade solicitada maior que a disponível em estoque."
            );
        }

        product.quantidadeAtual -= quantidadeNumerica;
        }

        const newMovement = movementRepository.create({
        productId,
        product,
        tipo,
        quantidade: quantidadeNumerica,
        observacao,
        });

        await productRepository.save(product);

        const savedMovement = await movementRepository.save(newMovement);

        return savedMovement;
    }
    );

    return movement;
}
}

module.exports = new MovementService();