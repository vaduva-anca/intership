const connectToDatabase = require('../config/dbConfig.js');

async function getAllOrders(offset, perPage) {
    try {
        const pool = await connectToDatabase();
        const countQuery = 'SELECT COUNT(*) AS totalOrders FROM Orders'; 
        const countResult = await pool.request().query(countQuery);
        console.log('Total number of orders in the database:', countResult.recordset[0].totalOrders); 
        
        const query = `
        SELECT
            O.order_id,
            C.name AS customer_name,
            STRING_AGG(B.title, ', ') AS book_titles,
            STRING_AGG(A.name, ', ') AS authors,
            STRING_AGG(CONCAT('$', B.price), ', ') AS prices,
            SUM(OD.quantity) AS total_quantity
        FROM
            Orders O
            INNER JOIN Customers C ON O.customer_id = C.customer_id
            INNER JOIN OrderDetails OD ON O.order_id = OD.order_id
            INNER JOIN Books B ON OD.book_id = B.book_id
            INNER JOIN Authors A ON B.author_id = A.author_id
        GROUP BY O.order_id, C.name
        ORDER BY O.order_id
        OFFSET ${offset} ROWS FETCH NEXT ${perPage} ROWS ONLY
        `;
        const result = await pool.request().query(query);
        
        const totalOrders = countResult.recordset[0].totalOrders; 
        const totalNumberOfPages = Math.ceil(totalOrders / perPage);
        
        console.log('Total number of pages:', totalNumberOfPages); 
        return {
            orders: result.recordset,
            totalNumberOfPages: totalNumberOfPages
        };
    } catch (error) {
        console.error('Error retrieving orders from database:', error);
        throw error;
    }
}


module.exports = {
    getAllOrders
};
