class Ingredient < ApplicationRecord
  has_one :hop
  has_one :malt
  has_one :yeast

  def details
    case self.ingredient_type
    when "malt"
      return self.malt
    when "hops"
      return self.hops
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
