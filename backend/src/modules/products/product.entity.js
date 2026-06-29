// Entidade responsável por representar os produtos no banco de dados

const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: 'Product',
    tableName: 'products',

    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },

        name: {
            type: 'varchar',
        },

        description: {
            type: 'varchar',
            nullable: true,
        },

        currentQuantity: {
            name: 'current_quantity',
            type: 'int',
        },

        createdAt: {
            name: 'created_at',
            type: 'timestamp',
            createDate: true,
        },

        updatedAt: {
            name: 'updated_at',
            type: 'timestamp',
            updateDate: true,
        },

        deletedAt: {
            name: 'deleted_at',
            type: 'timestamp',
            deleteDate: true,
            nullable: true,
        },
    },
});
