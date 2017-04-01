module FormHelper
  def setup_recipe(recipe)
    recipe.recipe_ingredients ||= RecipeIngredient.new

    3.times do
      recipe.recipe_ingredients.build
    end
    return recipe
  end
end
