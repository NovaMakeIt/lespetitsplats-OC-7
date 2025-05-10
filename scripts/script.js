// Éléments DOM
const recipesContainer = document.getElementById('recipes-container');
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');

// Variables globales
let currentRecipes = [...recipes]; // Copie des recettes pour manipulation

/**
 * Fonction d'initialisation
 */
function init() {
    // Affichage initial de toutes les recettes
    displayRecipes(recipes);
    
    // Initialiser les filtres
    window.filters.init(recipes);
    window.filters.initEvents();
    
    // Event listeners
    // searchInput.addEventListener('input', handleSearch);
    searchButton.addEventListener('click', handleSearch);
}

/**
 * Gère l'événement de recherche
 * @param {Event} event - L'événement déclencheur
 */
function handleSearch(event) {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm.length < 3) {
        // Si moins de 3 caractères, afficher toutes les recettes
        currentRecipes = [...recipes];
    } else {
        // OPTION 1 : Algorithme avec boucles natives
        //currentRecipes = searchRecipesWithLoops(recipes, searchTerm);
        
        // OPTION 2 : Algorithme avec programmation fonctionnelle
        currentRecipes = searchRecipesWithFunctional(recipes, searchTerm);
    }
    
    // Mettre à jour les filtres disponibles
    window.filters.init(currentRecipes);
    
    // Filtrer les recettes avec les filtres sélectionnés
    window.filters.filter();
}

/**
 * Affiche les recettes dans le conteneur
 * @param {Array} recipesToDisplay - Les recettes à afficher
 */
function displayRecipes(recipesToDisplay) {
    // Vider le conteneur
    recipesContainer.innerHTML = '';
    
    // Si aucune recette trouvée
    if (recipesToDisplay.length === 0) {
        recipesContainer.innerHTML = `
            <div class="col-span-full text-center py-10">
                <p class="text-xl text-gray-500">Aucune recette ne correspond à votre recherche</p>
            </div>
        `;
        return;
    }
    
    // Afficher chaque recette
    recipesToDisplay.forEach(recipe => {
        recipesContainer.appendChild(createRecipeCard(recipe));
    });
}

/**
 * Crée une carte de recette
 * @param {Object} recipe - La recette à afficher
 * @returns {HTMLElement} - L'élément DOM de la carte
 */
function createRecipeCard(recipe) {
    // Créer l'élément conteneur
    const card = document.createElement('div');
    card.className = 'w-full bg-white rounded-3xl shadow-lg overflow-hidden';
    
    // Format du temps
    const timeDisplay = `${recipe.time}min`;
    
    // Construire le HTML des ingrédients
    const ingredientsHtml = recipe.ingredients.map(ing => {
        // Formater la quantité et l'unité si elles existent
        let quantity = '';
        if (ing.quantity) {
            quantity = ing.quantity.toString();
            if (ing.unit) {
                quantity += ` ${ing.unit}`;
            }
        }
        
        return `
            <div>
                <p class="text-sm font-medium">${ing.ingredient}</p>
                <p class="text-xs text-gray-500">${quantity}</p>
            </div>
        `;
    }).join('');
    
    // Limiter la description à un nombre raisonnable de caractères
    const shortDescription = recipe.description.length > 150 
        ? recipe.description.substring(0, 150) + '...' 
        : recipe.description;
    
    // Structure de la carte
    card.innerHTML = `
        <div class="relative h-48 overflow-hidden">
            <img src="./assets/recipes/${recipe.image}" alt="${recipe.name}" class="w-full h-full object-cover" />
            <div class="absolute top-2 right-2 bg-yellow-300 text-black text-xs font-semibold px-2 py-1 rounded-full">
                ${timeDisplay}
            </div>
        </div>
        <div class="p-4">
            <h3 class="text-xl font-bold mb-3">${recipe.name}</h3>
            <div class="mb-4">
                <h4 class="text-xs text-gray-500 font-semibold tracking-wider mb-1">RECETTE</h4>
                <p class="text-sm text-gray-800">
                    ${shortDescription}
                </p>
            </div>
            <div>
                <h4 class="text-xs text-gray-500 font-semibold tracking-wider mb-2">INGRÉDIENTS</h4>
                <div class="grid grid-cols-2 gap-x-2 gap-y-3">
                    ${ingredientsHtml}
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Lancer l'initialisation au chargement de la page
window.addEventListener('DOMContentLoaded', init);