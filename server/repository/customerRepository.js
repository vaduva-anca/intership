const connectToDatabase = require('../config/dbConfig.js');

async function getAllCustomers(offset, perPage) {
    try {
        const pool = await connectToDatabase();
        const countQuery = 'SELECT COUNT(*) AS totalCustomers FROM Customers'; 
        const countResult = await pool.request().query(countQuery);
        const query = `
        SELECT *
        FROM Customers
        ORDER BY customer_id
        OFFSET ${offset} ROWS FETCH NEXT ${perPage} ROWS ONLY
        `;
        const result = await pool.request().query(query);
                
        const totalCustomers = countResult.recordset[0].totalCustomers; 
        const totalNumberOfPages = Math.ceil(totalCustomers / perPage);
        
        console.log('Total number of pages Custoemrs:', totalNumberOfPages); 
        return {
            custoemrs: result.recordset,
            totalNumberOfPages: totalNumberOfPages
        }
    } catch (error) {
        console.error('Error retrieving customers from database:', error);
        throw error;
    }
}

module.exports = {
    getAllCustomers
};
