module RecipesHelper
  def getRecipeIngredients(recipe)
    malts = []
    hops = []
    yeasts = []

    recipe.recipe_ingredients.all.each do |ingredient|
      ingredientData = Ingredient.find(ingredient.ingredient_id)
      tempRow = Hash.new.tap do |hash|
        hash[:name] = ingredientData.name
        hash[:quantity] = ingredient.quantity
      end

      case ingredientData.ingredient_type
      when 'malt'
        malts.push tempRow
      when 'hops'
        hops.push tempRow
      when 'yeast'
        yeasts.push tempRow
      end
    end

    return Hash.new.tap do |hash|
      hash[:malts] = malts
      hash[:hops] = hops
      hash[:yeasts] = yeasts
    end
  end
end
