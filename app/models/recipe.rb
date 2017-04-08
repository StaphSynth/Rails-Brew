class Recipe < ApplicationRecord
  belongs_to :user
  has_many :malts
  has_many :hops
  has_many :yeasts

  accepts_nested_attributes_for :malts
  accepts_nested_attributes_for :hops
  accepts_nested_attributes_for :yeasts
end
