class Ingredient < ApplicationRecord
  has_one :hop
  has_one :malt
  has_one :yeast
end
