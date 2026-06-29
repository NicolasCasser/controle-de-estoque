// Service responsável pelas regras de negócio dos produtos.

const AppDataSource = require('../../database/data-source');
const Product = require('./product.entity');

const productRepository = AppDataSource.getRepository(Product);

class ProductService {
    // Retorna produtos cadastrados podendo filtrar pelo nome
    async findAll(search) {

        const query = productRepository
            .createQueryBuilder("product")
            .orderBy("product.name", "ASC");

        if (search) {
            query.where(
                "product.name ILIKE :search",
                { search: `%${search}%` }
            );
        }

        return query.getMany();
    }

    // Busca um produto pelo id
    async findById(id) {
        const product = await productRepository.findOneBy({ id });

        if (!product) {
            throw new Error("Produto não encontrado");
        }

        return product;
    }

    // Cria um novo produto aplicando as regras de negócio
    async create(data) {
        if (!data.name || !data.name.trim()) {
            throw new Error('Nome do produto é obrigatório');
        }

        if (data.initialQuantity === undefined || data.initialQuantity < 0) {
            throw new Error('Quantidade inicial inválida');
        }

        if (!Number.isInteger(data.initialQuantity)) {
            throw new Error("Quantidade inicial deve ser um número inteiro.");
        }

        const newProduct = {
            name: data.name,
            description: data.description,
            currentQuantity: data.initialQuantity,
        };

        return productRepository.save(newProduct);
    }

    // Atualiza um produto existente aplicando as regras de negócio
    async update(id, data) {
        const product = await productRepository.findOneBy({ id });

        if (!product) {
            throw new Error('Produto não encontrado');
        }

        if (data.name !== undefined && !data.name.trim()) {
            throw new Error("Nome do produto é obrigatório.");
        }

        if (data.currentQuantity !== undefined) {
            throw new Error('Não é possivél alterar a quantidade do produto');
        }

        if (data.name) {
            product.name = data.name;
        }

        if (data.description !== undefined) {
            product.description = data.description;
        }

        return productRepository.save(product);
    }

    // Realiza a exclusão lógica de um produto
    async remove(id) {
        const product = await productRepository.findOneBy({ id });

        if (!product) {
            throw new Error('Produto não encontrado');
        }

        return productRepository.softDelete({ id });
    }
}

module.exports = new ProductService();