class RecipeYeast < ApplicationRecord
  belongs_to :recipe

  def partial
    return :yeast
  end
end
