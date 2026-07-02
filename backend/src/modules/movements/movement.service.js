// Service responsável pelas regras de negócio das movimentações

const AppDataSource = require("../../database/data-source");

class MovementService {
    // Lista movimentações podendo filtrar pelo tipo
    async listMovements(type) {

        const movementRepository =
            AppDataSource.getRepository("Movement");

        const where = {};

        if (type) {
            if (!["ENTRADA", "SAIDA"].includes(type)) {
                throw new Error(
                    "O tipo da movimentação deve ser ENTRADA ou SAIDA."
                );
            }
            where.type = type;
        }

        return movementRepository.find({
            where,
            relations: {
                product: true,
            },
            order: {
                createdAt: "DESC",
            },
        });
    }

    // Cria uma movimentação e atualiza o estoque
    async createMovement({
        productId,
        type,
        quantity,
        observation
    }) {

        if (!productId) {
            throw new Error("O produto é obrigatório.");
        }

        if (!type || !["ENTRADA", "SAIDA"].includes(type)) {
            throw new Error(
                "O tipo da movimentação deve ser ENTRADA ou SAIDA."
            );
        }

        const quantityNumber = Number(quantity);

        if (
            !Number.isInteger(quantityNumber) ||
            quantityNumber <= 0
        ) {
            throw new Error(
                "A quantidade deve ser um número inteiro maior que zero."
            );
        }

        return AppDataSource.manager.transaction(
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
                    throw new Error(
                        "Produto excluído não pode receber movimentações."
                    );
                }

                if (type === "ENTRADA") {
                    product.currentQuantity += quantityNumber;
                }

                if (type === "SAIDA") {
                    if (
                        quantityNumber >
                        product.currentQuantity
                    ) {
                        throw new Error(
                            "Quantidade solicitada maior que a disponível."
                        );
                    }
                    product.currentQuantity -= quantityNumber;
                }

                const newMovement =
                    movementRepository.create({
                        product,
                        type,
                        quantity: quantityNumber,
                        observation,
                    });

                await productRepository.save(product);
                return movementRepository.save(newMovement);
            }
        );
    }
}
module.exports = new MovementService();