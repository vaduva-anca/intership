const express = require('express');
const router = express.Router();
const recipieRepository = require('../repository/RecipieRepository.js');


router.get('/', async (req, res) => {
    try{
        const page = req.query.page || 1;
       

        // Check if page and perPage parameters are valid numbers
        if (isNaN(page) ) {
            return res.status(400).json({ error: 'Invalid page  parameter' });
        }

        // Convert page and perPage parameters to integers
        const pageNumber = parseInt(page, 10);
     

        // Check if page and perPage parameters are positive integers
        if (pageNumber <= 0 ) {
            return res.status(400).json({ error: 'Page  must be positive integers' });
        }

        // Retrieve orders from the service layer
        const recipie = await recipieRepository.getRecipies(page);

        // Send the retrieved orders as a JSON response
        res.status(200).json(recipie);
    }catch(error){
        console.error('Error retrieving recipies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/info/id', async (req, res) => {
    try{
        const recipeInfo = req.query.id ;
       
        if (isNaN(recipeInfo) ) {
            return res.status(400).json({ error: 'Invalid recipe id' });
        }     

        // Retrieve orders from the service layer
        const recipie = await recipieRepository.getRecipieById(recipeInfo);

        // Send the retrieved orders as a JSON response
        res.status(200).json(recipie);
    }catch(error){
        console.error('Error retrieving recipies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/info/name',async (req, res) => {
    try{
        const recipeInfo = req.query.name ;
       
     

        const recipie = await recipieRepository.getRecipeByName(recipeInfo);

        // Send the retrieved orders as a JSON response
        res.status(200).json(recipie);
    }catch(error){
        console.error('Error retrieving recipies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



router.get('/info/ingredients',async (req, res) => {
    try{
        const ingredients = req.query.ingredients ;
        const page = req.query.page || 1;
       

        // Check if page and perPage parameters are valid numbers
        if (isNaN(page) ) {
            return res.status(400).json({ error: 'Invalid page  parameter' });
        }

        // Convert page and perPage parameters to integers
        const pageNumber = parseInt(page, 10);
     

        // Check if page and perPage parameters are positive integers
        if (pageNumber <= 0 ) {
            return res.status(400).json({ error: 'Page  must be positive integers' });
        }

     

        const recipie = await recipieRepository.getRecipeByIngredients(ingredients,page);

        // Send the retrieved orders as a JSON response
        res.status(200).json(recipie);
    }catch(error){
        console.error('Error retrieving recipies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.get('/info/authorName',async (req, res) => {
    try{
        const authorName = req.query.authorName;
        const recipie = await recipieRepository.getRecipeByAuthorName(authorName);

        // Send the retrieved orders as a JSON response
        res.status(200).json(recipie);
    }catch(error){
        console.error('Error retrieving recipies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;