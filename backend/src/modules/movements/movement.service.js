// Service responsável pelas regras de negócio das movimentações

const AppDataSource = require("../../database/data-source");

class MovementService {
    // Lista movimentações podendo filtrar pelo tipo
    async listMovements(tipo) {

        const movementRepository =
            AppDataSource.getRepository("Movement");

        const where = {};

        if (tipo) {
            if (!["ENTRADA", "SAIDA"].includes(tipo)) {
                throw new Error(
                    "O tipo da movimentação deve ser ENTRADA ou SAIDA."
                );
            }
            where.tipo = tipo;
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
        tipo,
        quantidade,
        observacao
    }) {

        if (!productId) {
            throw new Error("O produto é obrigatório.");
        }

        if (!tipo || !["ENTRADA", "SAIDA"].includes(tipo)) {
            throw new Error(
                "O tipo da movimentação deve ser ENTRADA ou SAIDA."
            );
        }

        const quantidadeNumerica = Number(quantidade);

        if (
            !Number.isInteger(quantidadeNumerica) ||
            quantidadeNumerica <= 0
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

                if (tipo === "ENTRADA") {
                    product.currentQuantity += quantidadeNumerica;
                }

                if (tipo === "SAIDA") {
                    if (
                        quantidadeNumerica >
                        product.currentQuantity
                    ) {
                        throw new Error(
                            "Quantidade solicitada maior que a disponível."
                        );
                    }
                    product.currentQuantity -= quantidadeNumerica;
                }

                const newMovement =
                    movementRepository.create({
                        product,
                        tipo,
                        quantidade: quantidadeNumerica,
                        observacao,
                    });

                await productRepository.save(product);
                return movementRepository.save(newMovement);
            }
        );
    }
}
module.exports = new MovementService();