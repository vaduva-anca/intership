const neo4j = require('neo4j-driver');

// Neo4j connection details
const url = 'neo4j://34.232.57.230';
const user = 'neo4j';
const password = 'internship-2024';

// Function to create a Neo4j driver instance
function createDriver() {
  return neo4j.driver(url, neo4j.auth.basic(user, password));
}

// Export the function to create the driver instance
module.exports = createDriver;
