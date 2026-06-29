// Controller responsável por receber requisições relacionadas aos produtos

const productService = require('./product.service');

class ProductController {
    // Lista os produtos cadastrados
    async findAll(req, res) {
        try {
            const { search } = req.query;

            const products = await productService.findAll(search);

            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    }

    // Busca um produto pelo id
    async findById(req, res) {
        try {
            const { id } = req.params;

            const product = await productService.findById(id);

            return res.status(200).json(product);
        } catch (error) {
            return res.status(404).json({
                message: error.message
            });
        }
    }

    // Cria um novo produto
    async create(req, res) {
        try {
            const product = await productService.create(req.body);

            return res.status(201).json(product);
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    // Atualiza um produto existente
    async update(req, res) {
        try {
            const { id } = req.params;

            const product = await productService.update(id, req.body);

            return res.status(200).json(product);
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    // Remove um produto
    async remove(req, res) {
        try {
            const { id } = req.params;

            await productService.remove(id);

            return res.status(204).send();
        } catch (error) {
            return res.status(404).json({
                message: error.message
            });
        }
    }
}

module.exports = new ProductController();