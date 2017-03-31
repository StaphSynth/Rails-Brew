class Malt < ApplicationRecord
  belongs_to :ingredient

  validates :GPK, presence: true,
                  :numericality => {:greater_than => 1, :less_than => 2}
  validates :EBC, :numericality => {:greater_than => 0, :less_than => 100, :allow_nil => true}
  validates :ingredient_id, presence: true
  validates_uniqueness_of :ingredient_id

  def partial
    return 'malt_data'
  end
end
