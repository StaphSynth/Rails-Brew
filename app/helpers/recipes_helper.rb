module RecipesHelper
  def getRecipeIngredients(recipe)
    categories = ['malt', 'hops', 'yeast']
    finalStruct = []

    categories.each do |category|
      categoryHash = Hash.new.tap do |hash|
        hash[:title] = category
        hash[:list] = []
      end
      finalStruct.push(categoryHash)
    end

    recipe.recipe_ingredients.all.each do |ingredient|
      ingredientData = Ingredient.find(ingredient.ingredient_id)
      item = Hash.new.tap do |hash|
        hash[:name] = ingredientData.name
        hash[:quantity] = ingredient.quantity
      end

      finalStruct[categories.index(ingredientData.ingredient_type)][:list].push(item)
    end
    return finalStruct
  end

  def maltType
    [
      ['Grain', 'grain'],
      ['DME', 'dme'],
      ['LME', 'lme']
    ]
  end

  def maltUse
    [
      ['Base Malt', 'base malt'],
      ['Other', 'other']
    ]
  end

  def hopUse
    [
      ['Aroma', 'aroma'],
      ['Bittering', 'bittering'],
      ['Both', 'both']
    ]
  end

  def yeastType
    [
      ['Ale', 'ale'],
      ['Lager', 'larger']
    ]
  end
end
