module FormHelper
  def setup_recipe(recipe)
    recipe.recipe_ingredients ||= RecipeIngredient.new
    return recipe
  end
end
