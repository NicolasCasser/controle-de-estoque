const { EntitySchema } = require("typeorm");

const Product = new EntitySchema({
name: "Product",
tableName: "products",

columns: {
    id: {
    type: Number,
    primary: true,
    generated: true,
    },

    nome: {
    type: "varchar",
    nullable: false,
    },

    descricao: {
    type: "varchar",
    nullable: true,
    },

    quantidadeAtual: {
    type: Number,
    default: 0,
    nullable: false,
    },

    createdAt: {
    type: "timestamp",
    createDate: true,
    },

    updatedAt: {
    type: "timestamp",
    updateDate: true,
    },

    deletedAt: {
    type: "timestamp",
    nullable: true,
    },
},
});

module.exports = Product;