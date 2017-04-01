class RecipeIngredient < ApplicationRecord
  has_one :ingredient
  belongs_to :recipe

  validates :quantity, :numericality => {:greater_than => 0}
end
