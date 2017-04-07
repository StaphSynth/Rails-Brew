class Hop < ApplicationRecord
  belongs_to :recipe

  validates :aa, presence: true,
                 :numericality => {:greater_than => 0, :less_than => 100}

  def partial
    return :hop
  end
end
