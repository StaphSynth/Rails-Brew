class Hop < ApplicationRecord
  belongs_to :ingredient

  validates :aa, presence: true,
                 :numericality => {:greater_than => 0, :less_than => 100}
  validates :ingredient_id, presence: true
  validates_uniqueness_of :ingredient_id

  def partial
    return 'hop_data'
  end
end
