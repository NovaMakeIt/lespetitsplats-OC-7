// Éléments DOM pour les filtres
const filterDropdowns = document.querySelectorAll('.filter-dropdown');
const selectedFiltersContainer = document.getElementById('selected-filters');

// Objets pour stocker les filtres disponibles et sélectionnés
const availableFilters = {
    ingredients: new Set(),
    appliances: new Set(),
    ustensils: new Set()
};

// Filtres sélectionnés par l'utilisateur
const selectedFilters = {
    ingredients: new Set(),
    appliances: new Set(),
    ustensils: new Set()
};

/**
 * Initialise les filtres à partir des recettes
 * @param {Array} recipes - Liste des recettes
 */
function initFilters(recipes) {
    // Réinitialiser les filtres disponibles
    availableFilters.ingredients.clear();
    availableFilters.appliances.clear();
    availableFilters.ustensils.clear();
    
    // Extraire tous les ingrédients, appareils et ustensiles des recettes
    recipes.forEach(recipe => {
        // Extraire les ingrédients
        recipe.ingredients.forEach(ing => {
            availableFilters.ingredients.add(ing.ingredient.toLowerCase());
        });
        
        // Extraire les appareils
        if (recipe.appliance) {
            availableFilters.appliances.add(recipe.appliance.toLowerCase());
        }
        
        // Extraire les ustensiles
        if (recipe.ustensils && Array.isArray(recipe.ustensils)) {
            recipe.ustensils.forEach(ustensil => {
                availableFilters.ustensils.add(ustensil.toLowerCase());
            });
        }
    });
    
    // Mettre à jour l'affichage des filtres
    updateFilterDisplay('ingredients');
    updateFilterDisplay('appliances');
    updateFilterDisplay('ustensils');
}

/**
 * Met à jour l'affichage des filtres dans un dropdown
 * @param {String} filterType - Type de filtre (ingredients, appliances, ustensils)
 */
function updateFilterDisplay(filterType) {
    const dropdown = document.getElementById(`${filterType}-dropdown`);
    const filterItemsContainer = dropdown.querySelector('.filter-items');
    const searchInput = dropdown.querySelector('.filter-search');
    
    // Vider le conteneur des filtres
    filterItemsContainer.innerHTML = '';
    
    // Filtrer les éléments en fonction de la recherche
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    // Trier les filtres par ordre alphabétique
    const sortedFilters = Array.from(availableFilters[filterType]).sort();
    
    // Ajouter chaque filtre au conteneur s'il n'est pas déjà sélectionné
    sortedFilters.forEach(filter => {
        // Ne pas afficher les filtres déjà sélectionnés
        if (selectedFilters[filterType].has(filter)) {
            return;
        }
        
        // Filtrer par le terme de recherche
        if (searchTerm && !filter.includes(searchTerm)) {
            return;
        }
        
        // Créer l'élément du filtre
        const filterItem = document.createElement('div');
        filterItem.className = 'filter-item cursor-pointer p-2 text-sm whitespace-nowrap overflow-hidden text-ellipsis rounded hover:bg-yellow-custom transition-colors';
        filterItem.textContent = capitalizeFirstLetter(filter);
        filterItem.dataset.value = filter;
        filterItem.dataset.type = filterType;
        
        // Ajouter l'événement de clic
        filterItem.addEventListener('click', () => {
            selectFilter(filterType, filter);
        });
        
        filterItemsContainer.appendChild(filterItem);
    });
    
    // Si aucun filtre n'est disponible, afficher un message
    if (filterItemsContainer.children.length === 0) {
        const noFilter = document.createElement('div');
        noFilter.className = 'col-span-3 text-center text-gray-500 py-2';
        noFilter.textContent = 'Aucun filtre disponible';
        filterItemsContainer.appendChild(noFilter);
    }
}

/**
 * Sélectionne un filtre et met à jour les recettes affichées
 * @param {String} filterType - Type de filtre (ingredients, appliances, ustensils)
 * @param {String} filterValue - Valeur du filtre
 */
function selectFilter(filterType, filterValue) {
    // Ajouter le filtre à la liste des filtres sélectionnés
    selectedFilters[filterType].add(filterValue);
    
    // Mettre à jour l'affichage des filtres
    updateFilterDisplay(filterType);
    
    // Ajouter le tag du filtre sélectionné
    addFilterTag(filterType, filterValue);
    
    // Filtrer les recettes
    filterRecipes();
}

/**
 * Désélectionne un filtre et met à jour les recettes affichées
 * @param {String} filterType - Type de filtre (ingredients, appliances, ustensils)
 * @param {String} filterValue - Valeur du filtre
 */
function deselectFilter(filterType, filterValue) {
    // Supprimer le filtre de la liste des filtres sélectionnés
    selectedFilters[filterType].delete(filterValue);
    
    // Mettre à jour l'affichage des filtres
    updateFilterDisplay(filterType);
    
    // Supprimer le tag du filtre
    removeFilterTag(filterType, filterValue);
    
    // Filtrer les recettes
    filterRecipes();
}

/**
 * Ajoute un tag de filtre sélectionné
 * @param {String} filterType - Type de filtre (ingredients, appliances, ustensils)
 * @param {String} filterValue - Valeur du filtre
 */
function addFilterTag(filterType, filterValue) {
    const tagId = `tag-${filterType}-${filterValue.replace(/\s+/g, '-')}`;
    
    // Vérifier si le tag existe déjà
    if (document.getElementById(tagId)) {
        return;
    }
    
    // Créer le tag
    const tag = document.createElement('div');
    tag.className = 'filter-tag inline-flex items-center bg-yellow-custom text-black py-4 px-4 gap-[60px] rounded-[10px] text-sm mr-2 mt-4';
    tag.id = tagId;
    tag.innerHTML = `
        ${capitalizeFirstLetter(filterValue)}
        <img src="./assets/icons/close.svg" alt="Supprimer" class="w-4 h-4 ml-2 cursor-pointer hover:opacity-80">
    `;
    
    // Ajouter l'événement de clic pour supprimer le tag
    tag.querySelector('img').addEventListener('click', () => {
        deselectFilter(filterType, filterValue);
    });
    
    // Ajouter le tag au conteneur
    selectedFiltersContainer.appendChild(tag);
}

/**
 * Supprime un tag de filtre
 * @param {String} filterType - Type de filtre (ingredients, appliances, ustensils)
 * @param {String} filterValue - Valeur du filtre
 */
function removeFilterTag(filterType, filterValue) {
    const tagId = `tag-${filterType}-${filterValue.replace(/\s+/g, '-')}`;
    const tag = document.getElementById(tagId);
    
    if (tag) {
        tag.remove();
    }
}

/**
 * Filtre les recettes en fonction des filtres sélectionnés
 */
function filterRecipes() {
    // Récupérer le terme de recherche principal
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    // Filtrer d'abord avec le terme de recherche principal
    let filteredRecipes = [];
    
    // Utiliser l'algorithme de recherche existant si un terme est entré
    if (searchTerm.length >= 3) {
        filteredRecipes = searchRecipesWithFunctional(recipes, searchTerm);
    } else {
        filteredRecipes = [...recipes];
    }
    
    // Filtrer par les filtres sélectionnés
    if (hasSelectedFilters()) {
        filteredRecipes = filteredRecipes.filter(recipe => {
            // Vérifier les ingrédients
            if (selectedFilters.ingredients.size > 0) {
                const recipeIngredients = recipe.ingredients.map(ing => ing.ingredient.toLowerCase());
                
                // Vérifier si tous les ingrédients sélectionnés sont présents dans la recette
                const hasAllIngredients = Array.from(selectedFilters.ingredients).every(ingredient => 
                    recipeIngredients.some(recipeIng => recipeIng.includes(ingredient))
                );
                
                if (!hasAllIngredients) {
                    return false;
                }
            }
            
            // Vérifier les appareils
            if (selectedFilters.appliances.size > 0) {
                const recipeAppliance = recipe.appliance ? recipe.appliance.toLowerCase() : '';
                
                // Vérifier si l'appareil sélectionné est présent dans la recette
                const hasAppliance = Array.from(selectedFilters.appliances).some(appliance => 
                    recipeAppliance.includes(appliance)
                );
                
                if (!hasAppliance) {
                    return false;
                }
            }
            
            // Vérifier les ustensiles
            if (selectedFilters.ustensils.size > 0) {
                const recipeUstensils = recipe.ustensils ? 
                    recipe.ustensils.map(ustensil => ustensil.toLowerCase()) : [];
                
                // Vérifier si tous les ustensiles sélectionnés sont présents dans la recette
                const hasAllUstensils = Array.from(selectedFilters.ustensils).every(ustensil => 
                    recipeUstensils.some(recipeUst => recipeUst.includes(ustensil))
                );
                
                if (!hasAllUstensils) {
                    return false;
                }
            }
            
            return true;
        });
    }
    
    // Mettre à jour les filtres disponibles en fonction des recettes filtrées
    updateAvailableFilters(filteredRecipes);
    
    // Afficher les recettes filtrées
    displayRecipes(filteredRecipes);
    
    // Mettre à jour le compteur de recettes
    if (typeof updateRecipeCount === 'function') {
        updateRecipeCount(filteredRecipes.length);
    }
}

/**
 * Vérifie si des filtres sont sélectionnés
 * @returns {Boolean} - True si au moins un filtre est sélectionné
 */
function hasSelectedFilters() {
    return (
        selectedFilters.ingredients.size > 0 ||
        selectedFilters.appliances.size > 0 ||
        selectedFilters.ustensils.size > 0
    );
}

/**
 * Met à jour les filtres disponibles en fonction des recettes filtrées
 * @param {Array} filteredRecipes - Recettes filtrées
 */
function updateAvailableFilters(filteredRecipes) {
    // Réinitialiser les filtres disponibles tout en conservant les filtres sélectionnés
    const tempFilters = {
        ingredients: new Set(selectedFilters.ingredients),
        appliances: new Set(selectedFilters.appliances),
        ustensils: new Set(selectedFilters.ustensils)
    };
    
    // Extraire tous les filtres des recettes filtrées
    filteredRecipes.forEach(recipe => {
        // Extraire les ingrédients
        recipe.ingredients.forEach(ing => {
            tempFilters.ingredients.add(ing.ingredient.toLowerCase());
        });
        
        // Extraire les appareils
        if (recipe.appliance) {
            tempFilters.appliances.add(recipe.appliance.toLowerCase());
        }
        
        // Extraire les ustensiles
        if (recipe.ustensils && Array.isArray(recipe.ustensils)) {
            recipe.ustensils.forEach(ustensil => {
                tempFilters.ustensils.add(ustensil.toLowerCase());
            });
        }
    });
    
    // Mettre à jour les filtres disponibles
    availableFilters.ingredients = tempFilters.ingredients;
    availableFilters.appliances = tempFilters.appliances;
    availableFilters.ustensils = tempFilters.ustensils;
    
    // Mettre à jour l'affichage des filtres
    updateFilterDisplay('ingredients');
    updateFilterDisplay('appliances');
    updateFilterDisplay('ustensils');
}

/**
 * Met en majuscule la première lettre d'une chaîne
 * @param {String} string - Chaîne à capitaliser
 * @returns {String} - Chaîne avec la première lettre en majuscule
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Initialise les événements pour les dropdowns et les champs de recherche
 */
function initFilterEvents() {
    // Gérer l'ouverture/fermeture des dropdowns
    filterDropdowns.forEach(dropdown => {
        const filterBtn = dropdown.querySelector('.filter-btn');
        const filterContent = dropdown.querySelector('.filter-content');
        const searchInput = dropdown.querySelector('.filter-search');
        const clearSearch = dropdown.querySelector('.clear-search');
        
        // Ouvrir/fermer le dropdown au clic sur le bouton
        filterBtn.addEventListener('click', () => {
            // Fermer tous les autres dropdowns
            filterDropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown && otherDropdown.classList.contains('active')) {
                    otherDropdown.classList.remove('active');
                    otherDropdown.querySelector('.filter-content').classList.add('hidden');
                }
            });
            
            // Basculer l'état du dropdown actuel
            dropdown.classList.toggle('active');
            filterContent.classList.toggle('hidden');
            
            // Focus sur le champ de recherche si le dropdown est ouvert
            if (!filterContent.classList.contains('hidden')) {
                searchInput.focus();
            }
        });
        
        // Filtrer les éléments lors de la saisie dans le champ de recherche
        searchInput.addEventListener('input', () => {
            const filterType = dropdown.id.split('-')[0];
            updateFilterDisplay(filterType);
            
            // Afficher/masquer le bouton de suppression
            if (searchInput.value.length > 0) {
                clearSearch.classList.remove('hidden');
            } else {
                clearSearch.classList.add('hidden');
            }
        });
        
        // Effacer la recherche au clic sur le bouton de suppression
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            clearSearch.classList.add('hidden');
            const filterType = dropdown.id.split('-')[0];
            updateFilterDisplay(filterType);
            searchInput.focus();
        });
    });
    
    // Fermer les dropdowns au clic à l'extérieur
    document.addEventListener('click', (event) => {
        filterDropdowns.forEach(dropdown => {
            if (!dropdown.contains(event.target) && dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
                dropdown.querySelector('.filter-content').classList.add('hidden');
            }
        });
    });
}

// Exporter les fonctions pour les utiliser dans le script principal
window.filters = {
    init: initFilters,
    initEvents: initFilterEvents,
    filter: filterRecipes
};