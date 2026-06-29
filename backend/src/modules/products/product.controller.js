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
            return ProductController.handleError(res, error);
        }
    }

    // Busca um produto pelo id
    async findById(req, res) {
        try {
            const product = await productService.findById(req.params.id);

            return res.status(200).json(product);

        } catch (error) {
            return ProductController.handleError(res, error);
        }
    }

    // Cria um novo produto
    async create(req, res) {
        try {
            const product = await productService.create(req.body);

            return res.status(201).json(product);

        } catch (error) {
            return ProductController.handleError(res, error);
        }
    }

    // Atualiza um produto existente
    async update(req, res) {
        try {
            const product = await productService.update(
                req.params.id,
                req.body
            );

            return res.status(200).json(product);

        } catch (error) {
            return ProductController.handleError(res, error);
        }
    }

    // Remove um produto
    async remove(req, res) {
        try {
            await productService.remove(req.params.id);

            return res.status(204).send();

        } catch (error) {
            return ProductController.handleError(res, error);
        }
    }

    // Centraliza tratamento de erros
    static handleError(res, error) {

        if (error.message === "Produto não encontrado") {
            return res.status(404).json({
                message: error.message
            });
        }

        return res.status(400).json({
            message: error.message
        });
    }
}
module.exports = new ProductController();