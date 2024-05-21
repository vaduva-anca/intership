const customersRepository = require('../repository/customerRepository.js');

async function getAllCustomers(page, pageSize) {
    try {
        const offset = (page - 1) * pageSize;
        const customers = await customersRepository.getAllCustomers(offset, pageSize);
        return customers;
    } catch (error) {
        console.error('Error retrieving customers:', error);
        throw error;
    }
}

module.exports = {
    getAllCustomers
};
