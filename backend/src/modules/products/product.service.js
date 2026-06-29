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

        if (search && search.trim()) {
            query.where(
                "product.name ILIKE :search",
                { search: `%${search.trim()}%` }
            );
        }

        return query.getMany();
    }


    // Busca um produto pelo id
    async findById(id) {
        const product = await productRepository.findOneBy({
            id: this.parseId(id)
        });

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

        const quantity = Number(data.initialQuantity);

        if (!Number.isInteger(quantity) || quantity < 0) {
            throw new Error(
                'Quantidade inicial deve ser um número inteiro maior ou igual a zero'
            );
        }

        const newProduct = {
            name: data.name.trim(),
            description: this.normalizeOptionalText(data.description),
            currentQuantity: quantity,
        };

        return productRepository.save(newProduct);
    }


    // Atualiza um produto existente aplicando as regras de negócio
    async update(id, data) {

        const product = await productRepository.findOneBy({
            id: this.parseId(id)
        });

        if (!product) {
            throw new Error('Produto não encontrado');
        }


        if (data.name !== undefined) {
            if (!data.name.trim()) {
                throw new Error("Nome do produto é obrigatório.");
            }

            product.name = data.name.trim();
        }


        // Não permite alteração manual do estoque
        if (data.currentQuantity !== undefined) {
            throw new Error(
                'Não é possível alterar a quantidade do produto'
            );
        }


        if (data.description !== undefined) {
            product.description = this.normalizeOptionalText(
                data.description
            );
        }


        return productRepository.save(product);
    }


    // Realiza exclusão lógica do produto
    async remove(id) {

        const product = await productRepository.findOneBy({
            id: this.parseId(id)
        });

        if (!product) {
            throw new Error('Produto não encontrado');
        }

        return productRepository.softDelete({
            id: product.id
        });
    }

    // Valida e converte o id recebido
    parseId(id) {

        const parsedId = Number(id);

        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            throw new Error('Identificador do produto inválido');
        }

        return parsedId;
    }

    // Trata campos de texto opcionais
    normalizeOptionalText(value) {

        if (value === undefined || value === null || value === '') {
            return null;
        }

        return String(value).trim() || null;
    }
}

module.exports = new ProductService();