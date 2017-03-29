class Malt < ApplicationRecord
  belongs_to :ingredient

  def partial
    return 'malt_data'
  end
end
