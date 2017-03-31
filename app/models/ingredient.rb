class Ingredient < ApplicationRecord
  has_one :hop
  has_one :malt
  has_one :yeast

  validates :name, presence: true,
                   length: {maximum: 50}
  validates :ingredient_type, presence: true

  def details
    case self.ingredient_type
    when "malt"
      return self.malt
    when "hops"
      return self.hop
    when "yeast"
      return self.yeast
    end
  end

  def partial
    case self.ingredient_type
    when "malt"
      return "malt_data"
    when "hops"
      return "hop_data"
    when "yeast"
      return "yeast_data"
    end
  end
end
