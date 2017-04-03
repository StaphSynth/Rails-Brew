module FormHelper
  def setup_recipe(recipe)
    recipe.recipe_ingredients ||= RecipeIngredient.new
    return recipe
  end

  def getIngredientOptions(ingredients)
    maltOptions = []
    hopsOptions = []
    yeastOptions = []

    ingredients.each do |ingredient|
      case ingredient.ingredient_type
      when 'malt'
        maltOptions.push ingredient
      when 'hops'
        hopsOptions.push ingredient
      when 'yeast'
        yeastOptions.push ingredient
      end
    end

    return Hash.new.tap do |hash|
      hash[:maltOptions] = maltOptions
      hash[:hopsOptions] = hopsOptions
      hash[:yeastOptions] = yeastOptions
    end
  end
end
