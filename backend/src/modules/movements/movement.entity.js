const { EntitySchema } = require("typeorm");

const Movement = new EntitySchema({
name: "Movement",
tableName: "movements",

columns: {
    id: {
    type: Number,
    primary: true,
    generated: true,
    },

    productId: {
    type: Number,
    nullable: false,
    },

    tipo: {
    type: "varchar",
    length: 20,
    nullable: false,
    },

    quantidade: {
    type: Number,
    nullable: false,
    },

    observacao: {
    type: "varchar",
    nullable: true,
    },

    createdAt: {
    type: "timestamp",
    createDate: true,
    },
},

relations: {
    product: {
    type: "many-to-one",
    target: "Product",
    joinColumn: {
        name: "productId",
    },
    nullable: false,
    },
},
});

module.exports = Movement;