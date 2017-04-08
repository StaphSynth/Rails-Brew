class Yeast < ApplicationRecord
  belongs_to :recipe

  def partial
    return :yeast
  end
end
