const express = require('express');
const bodyParser = require('body-parser');
const ordersController = require('../server/controller/ordersController.js');
const customersController = require('../server/controller/customerController.js');
const recipiesController = require('../server/controller/RecipieController.js');
const cors = require('cors'); 
const app = express();
app.use(cors());

app.use(bodyParser.json());
// app.use('/api/orders', ordersController);
// app.use('/api/customers', customersController);


// app.use('/api/recipies', recipiesController);
// app.use('/api/recipe/info', recipiesController);
// app.use('/api/recipies', recipiesController);

app.use('/api/recipies', recipiesController);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
