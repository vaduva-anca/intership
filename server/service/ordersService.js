const ordersRepository = require('../repository/ordersRepository.js');


async function getAllOrders(page, perPage) {
    try {
        const offset = (page - 1) * perPage;
        console.log("offset " + offset)
        const orders = await ordersRepository.getAllOrders(offset, perPage);
        return orders;
    } catch (error) {
        console.error('Error retrieving orders:', error);
        throw error;
    }
}

module.exports = {
    getAllOrders
};