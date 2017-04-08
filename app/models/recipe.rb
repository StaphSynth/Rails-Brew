class Recipe < ApplicationRecord
  belongs_to :user
  has_many :malts, :inverse_of => :recipe, :dependent => :destroy
  has_many :hops, :inverse_of => :recipe, :dependent => :destroy
  has_many :yeasts, :inverse_of => :recipe, :dependent => :destroy

  accepts_nested_attributes_for :malts
  accepts_nested_attributes_for :hops
  accepts_nested_attributes_for :yeasts
end
