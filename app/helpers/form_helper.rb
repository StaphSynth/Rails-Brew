module FormHelper
  def setup_recipe(recipe)
    recipe.recipe_ingredients ||= RecipeIngredient.new
    return recipe
  end

  def getIngredientOptions(ingredients, type)
    options = []

    ingredients.each do |ingredient|
      case ingredient.ingredient_type
      when type
        options.push ingredient
      end
    end

    return options
  end
end
