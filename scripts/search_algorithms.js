/**
 * ALGORITHME DE RECHERCHE - VERSION BOUCLES NATIVES
 */

/**
 * Recherche des recettes avec des boucles natives (for, while)
 * @param {Array} recipes - Tableau de toutes les recettes
 * @param {String} searchTerm - Terme de recherche
 * @returns {Array} - Recettes filtrées correspondant au terme de recherche
 */
function searchRecipesWithLoops(recipes, searchTerm) {
    // Résultats de la recherche
    const results = [];
    
    // Parcourir chaque recette
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        
        // Vérifier si le terme de recherche est dans le nom de la recette
        if (recipe.name.toLowerCase().includes(searchTerm)) {
            results.push(recipe);
            continue; // Passer à la recette suivante si déjà trouvée
        }
        
        // Vérifier si le terme de recherche est dans la description
        if (recipe.description.toLowerCase().includes(searchTerm)) {
            results.push(recipe);
            continue;
        }
        
        // Vérifier si le terme de recherche correspond à un ingrédient
        let ingredientFound = false;
        for (let j = 0; j < recipe.ingredients.length; j++) {
            if (recipe.ingredients[j].ingredient.toLowerCase().includes(searchTerm)) {
                results.push(recipe);
                ingredientFound = true;
                break; // Sortir de la boucle des ingrédients
            }
        }
        if (ingredientFound) continue;
        
        // Vérifier si le terme de recherche correspond à un ustensile
        if (recipe.ustensils) {
            let ustensilFound = false;
            for (let j = 0; j < recipe.ustensils.length; j++) {
                if (recipe.ustensils[j].toLowerCase().includes(searchTerm)) {
                    results.push(recipe);
                    ustensilFound = true;
                    break;
                }
            }
            if (ustensilFound) continue;
        }
        
        // Vérifier si le terme de recherche correspond à un appareil
        if (recipe.appliance && recipe.appliance.toLowerCase().includes(searchTerm)) {
            results.push(recipe);
        }
    }
    
    return results;
}

/**
 * ALGORITHME DE RECHERCHE - VERSION PROGRAMMATION FONCTIONNELLE
 */

/**
 * Recherche des recettes avec la programmation fonctionnelle (filter, map, reduce)
 * @param {Array} recipes - Tableau de toutes les recettes
 * @param {String} searchTerm - Terme de recherche
 * @returns {Array} - Recettes filtrées correspondant au terme de recherche
 */
function searchRecipesWithFunctional(recipes, searchTerm) {
    return recipes.filter(recipe => {
        // Vérifier le nom de la recette
        if (recipe.name.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        // Vérifier la description
        if (recipe.description.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        // Vérifier les ingrédients
        const hasMatchingIngredient = recipe.ingredients.some(ing => 
            ing.ingredient.toLowerCase().includes(searchTerm)
        );
        if (hasMatchingIngredient) {
            return true;
        }
        
        // Vérifier les ustensiles si disponibles
        if (recipe.ustensils && Array.isArray(recipe.ustensils)) {
            const hasMatchingUtensil = recipe.ustensils.some(utensil => 
                utensil.toLowerCase().includes(searchTerm)
            );
            if (hasMatchingUtensil) {
                return true;
            }
        }
        
        // Vérifier l'appareil si disponible
        if (recipe.appliance && recipe.appliance.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        return false;
    });
}