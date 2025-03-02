const db = require('../config/database');

const ItemModel = {
    createItem: async ({ seller_id, name, description, starting_price, image_url }) => {
        try {
            const [itemResult] = await db.query(
                `INSERT INTO Item (seller_id, name, description, starting_price, image_url) VALUES (?, ?, ?, ?, ?)`,
                [seller_id, name, description, starting_price, image_url]
            );
            return itemResult.insertId;
        } catch (error) {
            console.error('Error creating item:', error);
            throw new Error('Database error: Unable to create item');
        }
    }
};

module.exports = ItemModel;
