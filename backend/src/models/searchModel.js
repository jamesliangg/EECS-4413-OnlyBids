const db = require('../config/database');

const SearchModel =  {

    // For autocompletion
    findItemsAutocompletion: async (keyWord) => {
        const [result] = await db.query(
            `SELECT name, image_url FROM Item WHERE LOWER(name) LIKE LOWER(?) LIMIT 10`,
            [`%${keyWord}%`]
        );
        return result;
    },
    
    // For search button
    findItemsFullSearch: async(keyWord) => {
        const searchPattern = `%${keyWord}%`;
        const [result]  = await db.query(
        `SELECT 
            a.auction_id, 
            i.name, 
            i.description, 
            i.starting_price, 
            i.image_url, 
            a.start_time, 
            a.end_time, 
            a.status, 
            a.winner_id, 
            a.final_price
        FROM Auction a
        JOIN Item i ON a.item_id = i.item_id
        WHERE a.status = 'ongoing' 
        AND (i.name LIKE ? OR i.description LIKE ?)
        ORDER BY a.start_time DESC;`,
        [searchPattern, searchPattern]
        );
        
        return result;
    },

    findItemByAuctionId: async(auctionID) => {
        const [result]  = await db.query(
                `SELECT 
                    i.item_id,
                    i.seller_id,
                    i.name,
                    i.description,
                    i.starting_price,
                    i.image_url,
                    i.created_at AS item_created_at,
                    a.auction_id,
                    a.start_time,
                    a.end_time,
                    a.status,
                    a.type,
                    a.winner_id,
                    a.final_price
                FROM 
                    Auction AS a
                JOIN 
                    Item AS i ON a.item_id = i.item_id
                WHERE 
                    a.auction_id = ?;`,
            [auctionID]
            );
            return result;
    }

}

module.exports = SearchModel;