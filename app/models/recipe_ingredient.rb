class RecipeIngredient < ApplicationRecord
  has_one :ingredient
  belongs_to :recipe
end
