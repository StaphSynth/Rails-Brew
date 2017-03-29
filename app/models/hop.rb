class Hop < ApplicationRecord
  belongs_to :ingredient

  def partial
    return 'hop_data'
  end
end
