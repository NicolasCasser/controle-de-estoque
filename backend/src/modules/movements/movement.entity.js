// Entidade responsável por representar movimentações de estoque

const { EntitySchema } = require("typeorm");

const Movement = new EntitySchema({

    name: "Movement",
    tableName: "movements",

    columns: {

        id: {
            type: "int",
            primary: true,
            generated: true,
        },

        type: {
            type: "varchar",
            length: 20,
            nullable: false,
        },

        quantity: {
            type: "int",
            nullable: false,
        },

        observation: {
            type: "varchar",
            nullable: true,
        },

        createdAt: {
            name: "created_at",
            type: "timestamp",
            createDate: true,
        },
    },

    relations: {

        product: {
            type: "many-to-one",
            target: "Product",

            joinColumn: {
                name: "product_id",
            },

            nullable: false,
        },
    },
});

module.exports = Movement;