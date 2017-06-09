class RecipeHop < ApplicationRecord
  belongs_to :recipe

  validates :quantity, presence: true, :numericality => {:greater_than => 0}

  def partial
    return :hop
  end
end
