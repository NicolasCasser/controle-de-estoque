const { ILike } = require("typeorm");
const AppDataSource = require("../../database/data-source");

class ProductService {
  async listProducts(search) {
    const productRepository = AppDataSource.getRepository("Product");
    const where = { deletedAt: null };
    if (search && search.trim()) where.nome = ILike(`%${search.trim()}%`);
    return productRepository.find({ where, order: { nome: "ASC" } });
  }

  async getProductById(id) {
    const productRepository = AppDataSource.getRepository("Product");
    const product = await productRepository.findOne({
      where: { id: this.parseId(id), deletedAt: null },
    });
    if (!product) throw new Error("Produto não encontrado.");
    return product;
  }

  async createProduct({ nome, descricao, quantidadeInicial = 0 }) {
    const normalizedName = this.validateName(nome);
    const initialQuantity = this.validateInitialQuantity(quantidadeInicial);

    return AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      const productRepository = transactionalEntityManager.getRepository("Product");
      const movementRepository = transactionalEntityManager.getRepository("Movement");
      const product = productRepository.create({
        nome: normalizedName,
        descricao: this.normalizeOptionalText(descricao),
        quantidadeAtual: initialQuantity,
      });
      const savedProduct = await productRepository.save(product);

      if (initialQuantity > 0) {
        const initialMovement = movementRepository.create({
          productId: savedProduct.id,
          product: savedProduct,
          tipo: "ENTRADA",
          quantidade: initialQuantity,
          observacao: "Estoque inicial",
        });
        await movementRepository.save(initialMovement);
      }
      return savedProduct;
    });
  }

  async updateProduct(id, { nome, descricao }) {
    const productRepository = AppDataSource.getRepository("Product");
    const product = await productRepository.findOne({
      where: { id: this.parseId(id), deletedAt: null },
    });
    if (!product) throw new Error("Produto não encontrado.");
    if (nome !== undefined) product.nome = this.validateName(nome);
    if (descricao !== undefined) product.descricao = this.normalizeOptionalText(descricao);
    return productRepository.save(product);
  }

  async deleteProduct(id) {
    const productRepository = AppDataSource.getRepository("Product");
    const product = await productRepository.findOne({
      where: { id: this.parseId(id), deletedAt: null },
    });
    if (!product) throw new Error("Produto não encontrado.");
    product.deletedAt = new Date();
    await productRepository.save(product);
  }

  parseId(id) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      throw new Error("O identificador do produto é inválido.");
    }
    return parsedId;
  }

  validateName(nome) {
    if (typeof nome !== "string" || !nome.trim()) {
      throw new Error("O nome do produto é obrigatório.");
    }
    return nome.trim();
  }

  validateInitialQuantity(quantidadeInicial) {
    const quantity = Number(quantidadeInicial);
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error("A quantidade inicial deve ser um número inteiro maior ou igual a zero.");
    }
    return quantity;
  }

  normalizeOptionalText(value) {
    if (value === undefined || value === null || value === "") return null;
    return String(value).trim() || null;
  }
}

module.exports = new ProductService();
