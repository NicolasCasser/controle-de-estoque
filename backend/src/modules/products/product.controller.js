const productService = require("./product.service");

class ProductController {
  async list(request, response) {
    try {
      const products = await productService.listProducts(request.query.search);
      return response.status(200).json(products);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }

  async getById(request, response) {
    try {
      const product = await productService.getProductById(request.params.id);
      return response.status(200).json(product);
    } catch (error) {
      return ProductController.handleError(response, error);
    }
  }

  async create(request, response) {
    try {
      const { nome, descricao, quantidadeInicial, name, description, initialQuantity } = request.body;
      const product = await productService.createProduct({
        nome: nome ?? name,
        descricao: descricao ?? description,
        quantidadeInicial: quantidadeInicial ?? initialQuantity ?? 0,
      });
      return response.status(201).json(product);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }

  async update(request, response) {
    try {
      const { nome, descricao, name, description } = request.body;
      const product = await productService.updateProduct(request.params.id, {
        nome: nome ?? name,
        descricao: descricao ?? description,
      });
      return response.status(200).json(product);
    } catch (error) {
      return ProductController.handleError(response, error);
    }
  }

  async delete(request, response) {
    try {
      await productService.deleteProduct(request.params.id);
      return response.status(204).send();
    } catch (error) {
      return ProductController.handleError(response, error);
    }
  }

  static handleError(response, error) {
    const status = error.message === "Produto não encontrado." ? 404 : 400;
    return response.status(status).json({ message: error.message });
  }
}

module.exports = new ProductController();
