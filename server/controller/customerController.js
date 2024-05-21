const express = require('express');
const router = express.Router();
const customersService = require('../service/customerService.js');

router.get('/', async (req, res) => {
    try {
        // Extract page and perPage parameters from query string, default to 1 and 10 respectively if not provided
        const page = req.query.page || 1;
        const perPage = req.query.perPage || 10;

        // Check if page and perPage parameters are valid numbers
        if (isNaN(page) || isNaN(perPage)) {
            return res.status(400).json({ error: 'Invalid page or perPage parameter' });
        }

        // Convert page and perPage parameters to integers
        const pageNumber = parseInt(page, 10);
        const perPageNumber = parseInt(perPage, 10);

        // Check if page and perPage parameters are positive integers
        if (pageNumber <= 0 || perPageNumber <= 0) {
            return res.status(400).json({ error: 'Page and perPage must be positive integers' });
        }

        // Retrieve customers from the service layer
        const customers = await customersService.getAllCustomers(pageNumber, perPageNumber);

        // Send the retrieved customers as a JSON response
        res.status(200).json(customers);
    } catch (error) {
        // Log and handle errors
        console.error('Error retrieving customers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
