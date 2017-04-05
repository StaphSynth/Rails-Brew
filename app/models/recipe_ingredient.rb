class RecipeIngredient < ApplicationRecord
  has_one :ingredient
  belongs_to :recipe

  validates :quantity, :numericality => {:greater_than => 0}
  validates_presence_of :ingredient_id
  validates_presence_of :recipe_id
end
