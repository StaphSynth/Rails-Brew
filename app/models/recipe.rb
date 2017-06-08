class Recipe < ApplicationRecord
  belongs_to :user
  has_many :malts, :inverse_of => :recipe, :dependent => :destroy
  has_many :hops, :inverse_of => :recipe, :dependent => :destroy
  has_many :yeasts, :inverse_of => :recipe, :dependent => :destroy
  has_many :ratings, :inverse_of => :recipe, :dependent => :destroy
  has_many :recipe_ingredients, :inverse_of => :recipe, :dependent => :destroy

  accepts_nested_attributes_for :malts, :allow_destroy => true,
                                reject_if: lambda { |attributes| attributes[:quantity].blank? }

  accepts_nested_attributes_for :hops, :allow_destroy => true,
                                reject_if: lambda { |attributes| attributes[:quantity].blank? }

  accepts_nested_attributes_for :yeasts, :allow_destroy => true

  accepts_nested_attributes_for :recipe_ingredients, :allow_destroy => true
end
