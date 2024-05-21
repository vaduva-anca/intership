const createDriver = require('../config/dbConfig.js');

async function getRecipies(skip) {
    try {
        // Create a driver instance
        const driver = createDriver();

        // Create a session using the driver
        const session = driver.session();

        const countQuery = 'MATCH (r:Recipe) RETURN COUNT(r) AS totalRecipes';
        const countResult = await session.run(countQuery);
        console.log('Total number of Recipes in the database:', countResult.records[0].get('totalRecipes').toNumber());

        const query = `
        MATCH (r:Recipe)<-[:WROTE]-(a:Author)
OPTIONAL MATCH (r)-[:CONTAINS_INGREDIENT]->(i:Ingredient)
OPTIONAL MATCH (r)-[:DIET_TYPE]->(d:DietType)
WITH r, a.name AS authorName,
     COUNT(i) AS ingredientCount,
     d.name AS dietType,
     CASE
       WHEN LEFT(r.name, 1) >= 'A' AND LEFT(r.name, 1) <= 'Z' THEN LEFT(r.name, 1)
       ELSE '['
     END AS firstLetter
ORDER BY firstLetter
SKIP ${skip*20}
LIMIT 20
RETURN r {.*, authorName: authorName, firstLetter: firstLetter, ingredientCount: ingredientCount, dietType: dietType};`

        console.log(`here we have query ${query}`)
        const result = await session.run(query);

        const totalRecipes = countResult.records[0].get('totalRecipes').toNumber();
        const totalNumberOfPages = Math.ceil(totalRecipes / 20);

        console.log('Total number of pages:', totalNumberOfPages);

        // Close the session
        await session.close();

        // Close the driver
        await driver.close();

        return {
            recipes: result.records.map(record => record.get('r')),
            totalNumberOfPages: totalNumberOfPages
        };
    } catch (error) {
        console.error('Error retrieving recipes from database:', error);
        throw error;
    }
}

async function getRecipieById(id) {
    try {
        const query = `
        MATCH (r:Recipe {id: '${id}'})<-[:WROTE]-(a:Author)
        OPTIONAL MATCH (r)-[:CONTAINS_INGREDIENT]->(i:Ingredient)
        WITH r, a.name AS authorName, COLLECT(i {.*}) AS ingredients
        RETURN r {.*, 
                  authorName: authorName, 
                  ingredients: ingredients
                 } AS recipeDetails;`;

        // Create a driver instance
        const driver = createDriver();

        // Create a session using the driver
        const session = driver.session();

        const recipeInfo = await session.run(query, { id: parseInt(id, 10) });
        console.log('Recipe info by id:', recipeInfo);

        // Close the session and driver
        await session.close();
        await driver.close();

        if (recipeInfo.records.length === 0) {
            throw new Error('Recipe not found');
        }

        return {
            recipe: recipeInfo.records[0].get('recipeDetails')
        };
    } catch (error) {
        console.error('Error retrieving recipe by ID from database:', error);
        throw error;
    }
}

async function getRecipeByName(name){

    try {name
        const query = `MATCH (r:Recipe)
        WHERE r.name CONTAINS '${name}'
        OPTIONAL MATCH (r)<-[:WROTE]-(a:Author)
        OPTIONAL MATCH (r)-[:CONTAINS_INGREDIENT]->(i:Ingredient)
        OPTIONAL MATCH (r)-[:DIET_TYPE]->(d:DietType)
        WITH r, a.name AS authorName, 
             COUNT(i) AS ingredientCount,
             d.name AS dietType
        RETURN r {.*, 
                  authorName: authorName, 
                  ingredientCount: ingredientCount,
                  dietType: dietType,
                  firstLetter: CASE 
                                 WHEN LEFT(r.name, 1) >= 'A' AND LEFT(r.name, 1) <= 'Z' THEN LEFT(r.name, 1)
                                 ELSE '['
                              END
                 } AS recipeDetails;
        `

        // Create a driver instance
        const driver = createDriver();

        // Create a session using the driver
        const session = driver.session();

        const recipeInfo = await session.run(query, { name: name });
        console.log('Recipe info by id:', recipeInfo);

        // Close the session and driver
        await session.close();
        await driver.close();

        if (recipeInfo.records.length === 0) {
            throw new Error('Recipe not found');
        }

        return {
            recipes: recipeInfo.records.map(record => record.get('recipeDetails')),
        };
    } catch (error) {
        console.error('Error retrieving recipe by ID from database:', error);
        throw error;
    }
}

async function getRecipeByIngredients(ingredientsString,skip) {
    try {
        // Split the ingredients string into an array based on the comma
        const ingredients = ingredientsString.split(',');

        // Create a driver instance
        const driver = createDriver();

        // Create a session using the driver
        const session = driver.session();
            const elementsQuery = returnStringQuerry2(ingredients);
        const countQuery = `MATCH (r:Recipe)<-[:WROTE]-(a:Author)
        OPTIONAL MATCH (r)-[:CONTAINS_INGREDIENT]->(i:Ingredient)
        WHERE i.name IN [${elementsQuery}]
        WITH r, a.name AS authorName,
             COUNT(DISTINCT i.name) AS matchedIngredientsCount
        WHERE matchedIngredientsCount = SIZE([${elementsQuery}])
        RETURN COUNT(DISTINCT r) AS totalRecipes;
        `
        console.log('Number of pages query: ',countQuery);
        const countResult = await session.run(countQuery);
        console.log('Total number of Recipes in the database:', countResult.records[0].get('totalRecipes').toNumber());

        const query = `
        MATCH (r:Recipe)<-[:WROTE]-(a:Author)
        OPTIONAL MATCH (r)-[:CONTAINS_INGREDIENT]->(i:Ingredient)
        WHERE i.name IN [${returnStringQuerry2(ingredients)}]
        WITH r, a.name AS authorName,
             COUNT(DISTINCT i.name) AS matchedIngredientsCount,
             COUNT(DISTINCT i) AS ingredientCount
        WHERE matchedIngredientsCount = SIZE([${elementsQuery}])

        RETURN r {.*, authorName: authorName, ingredientCount: ingredientCount}
        SKIP ${skip*20}
        LIMIT 20
        ;`;

        console.log(`here we have query ${query}`);
        const result = await session.run(query);

        const totalRecipes = countResult.records[0].get('totalRecipes').toNumber();
        const totalNumberOfPages = Math.ceil(totalRecipes / 20);

        console.log('Total number of pages:', totalNumberOfPages);

        // Close the session
        await session.close();

        // Close the driver
        await driver.close();

        return {
            recipes: result.records.map(record => record.get('r')),
            totalNumberOfPages: totalNumberOfPages
        };
    } catch (error) {
        console.error('Error retrieving recipes from database:', error);
        throw error;
    }
}

async function getRecipeByAuthorName(authorName){
    try {
        // Split the ingredients string into an array based on the comma

        // Create a driver instance
        const driver = createDriver();

        // Create a session using the driver
        const session = driver.session();

        const countQuery = `MATCH (a:Author {name: '${authorName}'})-[:WROTE]->(r:Recipe)
        RETURN COUNT(r) AS totalRecipes;`;
        const countResult = await session.run(countQuery);
        console.log('Total number of Recipes in the database:', countResult.records[0].get('totalRecipes').toNumber());

        const query = `
        MATCH (a:Author {name: '${authorName}'})-[:WROTE]->(r:Recipe)
        OPTIONAL MATCH (r)-[:CONTAINS_INGREDIENT]->(i:Ingredient)
        OPTIONAL MATCH (r)-[:DIET_TYPE]->(d:DietType)
        WITH r, a.name AS authorName,
             COUNT(DISTINCT i) AS ingredientCount,
             d.name AS dietType,
             CASE
               WHEN LEFT(r.name, 1) >= 'A' AND LEFT(r.name, 1) <= 'Z' THEN LEFT(r.name, 1)
               ELSE '['
             END AS firstLetter
        ORDER BY firstLetter
        RETURN r {.*, authorName: authorName, firstLetter: firstLetter, ingredientCount: ingredientCount, dietType: dietType};`;

        console.log(`here we have query ${query}`);
        const result = await session.run(query);

        const totalRecipes = countResult.records[0].get('totalRecipes').toNumber();
        const totalNumberOfPages = Math.ceil(totalRecipes / 20);

        console.log('Total number of pages:', totalNumberOfPages);

        // Close the session
        await session.close();

        // Close the driver
        await driver.close();

        return {
            recipes: result.records.map(record => record.get('r')),
            totalNumberOfPages: totalNumberOfPages
        };
    } catch (error) {
        console.error('Error retrieving recipes from database:', error);
        throw error;
    }
}

function returnStringQuerry2(elements) {

    let query = '';

        for (let i = 0; i < elements.length; i++) {
           
            if(i==elements.length-1){
                query+=`'${elements[i]}'`;
            }else{
                query += `'${elements[i]}',`;
            }
        }


    return query;
}
module.exports = {
    getRecipies,
    getRecipieById,
    getRecipeByName,
    getRecipeByIngredients,
    getRecipeByAuthorName
};
