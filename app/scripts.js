document.addEventListener("DOMContentLoaded", function () {
  const rowsPerPage = 20;
  let currentPage = 1;
  let totalPages = 1;
  let currentRecipe = null; // Store the current recipe details
  let allRecipes = []; // Store all recipes data
  let searchTimer; // Timer for delayed search
 
  async function fetchRecipes(page = 1) {
    const url = `http://localhost:3000/api/recipies?page=${page}`;
 
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const dataRecipe = await response.json();
 
      allRecipes = dataRecipe.recipes;
      totalPages = dataRecipe.totalNumberOfPages;
 
      // Render the table with the fetched data
      renderTable(allRecipes, page, totalPages);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  }
 
  function renderTable(data, page, numberOfPages) {
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = "";
 
    data.forEach((item, index) => {
      const row = document.createElement("tr");
 
      const nameCell = document.createElement("td");
      nameCell.textContent = item.name;
      nameCell.classList.add('recipe_name');
      nameCell.addEventListener("click", () => showRecipeDetails(item.name));
 
      const authorCell = document.createElement("td");
      authorCell.textContent = item.authorName;
      authorCell.classList.add('author_name');
      authorCell.addEventListener("click", () => showAuthorDetails(item.authorName));
 
      const ingredientCountCell = document.createElement("td");
      ingredientCountCell.textContent = item.ingredientCount.low;
 
      const skillLevelCell = document.createElement("td");
      skillLevelCell.textContent = item.skillLevel;
 
      row.appendChild(nameCell);
      row.appendChild(authorCell);
      row.appendChild(ingredientCountCell);
      row.appendChild(skillLevelCell);
 
      tableBody.appendChild(row);
  });
    // Always render pagination
    const pageInfo = document.getElementById("pageInfo");
    pageInfo.textContent = `Page ${page} of ${numberOfPages}`;
    pageInfo.style.display = "block";
 
    const prevPageBtn = document.getElementById("prevPage");
    prevPageBtn.disabled = page === 1;
    prevPageBtn.style.display = "block";
 
    const nextPageBtn = document.getElementById("nextPage");
    nextPageBtn.disabled = page === numberOfPages;
    nextPageBtn.style.display = "block";
  }
  async function showAuthorDetails(authorName) {
    try {
        const response = await fetch(`http://localhost:3000/api/recipies/info/authorName?authorName=${authorName}`);
        console.log(`http://localhost:3000/api/recipies/info/authorName?authorName=${authorName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const authorRecipes = await response.json();
        authorRecipesInfo = authorRecipes.recipes;
        console.log(authorRecipesInfo[0].name); 
 
       
        displayAuthorRecipes(authorRecipesInfo);
        document.querySelector(".overlay-close-btn").addEventListener("click", function () {
          const overlay = document.getElementById("overlay-author-recepies");
          overlay.style.display = "none";
          });

    } catch (error) {
        console.error('Error fetching author details:', error);
    }
}
function displayAuthorRecipes(authorRecipes) {
  const overlay = document.getElementById("overlay-author-recepies");
  overlay.style.display = "block";
  authorRecipes.forEach(item=>{
    overlay.innerHTML += `
    <div class="overlay-content-recepies">
      <h2>${item.name}</h2>
    </div>
    
  `;
  })
  overlay.style.display = "block";
}
 
 
  async function showRecipeDetails(name) {
    try {
      const response = await fetch(`http://localhost:3000/api/recipies/info/name?name=${name}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const recipeInfo = await response.json();
      currentRecipe = recipeInfo.recipes[0];
 
      displayRecipeOverlay();
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  }
 
  function displayRecipeOverlay() {
    const overlay = document.getElementById("overlay");
    overlay.innerHTML = `
      <div class="overlay-content">
        <h2>${currentRecipe.name}</h2>
        <p><strong>Description:</strong> ${currentRecipe.description}</p>
        <p><strong>Cooking Time:</strong> ${currentRecipe.cookingTime.low} seconds</p>
        <p><strong>Preparation Time:</strong> ${currentRecipe.preparationTime.low} seconds</p>
        <p><strong>Ingredients:</strong> ${currentRecipe.ingredientCount.low}</p>
        <button onclick="closeOverlay()">Close</button>
      </div>
    `;
    overlay.style.display = "block";
  }
 
  const buttonIngredients = document.querySelector(".filter__button");
  const inputIngredients = document.querySelector(".filter__input");
 
  buttonIngredients.addEventListener('click',function(){
    const filterTerm = inputIngredients.value;
    console.log(showRecipeByFilterIngredients(filterTerm));
 
  })
 
 
  async function showRecipeByFilterIngredients(ingridients) {
    try {
      const response = await fetch(`http://localhost:3000/api/recipies/info/ingredients?ingredients=${ingridients}`);
 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const recipeInfo = await response.json();
      currentRecipes = recipeInfo; 
    
      renderTable(currentRecipes.recipes, 1, currentRecipes.totalNumberOfPages);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  }
 
 
  // Function to close the overlay
  window.closeOverlay = function () {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
  };
 
  // Search functionality
  const searchInput = document.querySelector(".search__input");
  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimer); // Clear the previous timer
    const searchTerm = this.value.trim().toLowerCase();
    if (searchTerm === '') {
      fetchRecipes(currentPage); // Fetch all recipes when search term is empty
    } else {
      searchTimer = setTimeout(() => {
        const filteredRecipes = allRecipes.filter(recipe => recipe.name.toLowerCase().includes(searchTerm));
        renderTable(filteredRecipes, 1, 1); // Always show the first page after search
      }, 500); // Delay for 500 milliseconds before triggering the search
    }
  });
 
  document.getElementById("prevPage").addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      fetchRecipes(currentPage);
    }
  });
 
  document.getElementById("nextPage").addEventListener("click", function () {
    if (currentPage < totalPages) {
      currentPage++;
      fetchRecipes(currentPage);
    }
  });
 
  // Fetch the initial recipes and render the table
  fetchRecipes(currentPage);
});