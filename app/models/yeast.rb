class Yeast < ApplicationRecord
  belongs_to :ingredient

  validates_presence_of :fermentation_type
  validates_presence_of :ingredient_id
  validates_uniqueness_of :ingredient_id

  def partial
    return 'yeast_data'
  end
end
