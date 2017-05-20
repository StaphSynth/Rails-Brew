class Rating < ApplicationRecord
  belongs_to :recipe
  belongs_to :user

  validates :rating, :numericality => {:greater_than => 0, :less_than => 6}
end
