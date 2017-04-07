class Yeast < ApplicationRecord
  belongs_to :ingredient

  def partial
    return :yeast
  end
end
