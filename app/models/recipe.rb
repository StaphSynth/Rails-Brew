class Recipe < ApplicationRecord
  belongs_to :user
  has_many :malts
  has_many :hops
  has_many :yeasts

end
