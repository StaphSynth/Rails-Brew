class Recipe < ApplicationRecord
  belongs_to :user
  has_many :recipe_malts, :inverse_of => :recipe, :dependent => :destroy
  has_many :recipe_hops, :inverse_of => :recipe, :dependent => :destroy
  has_many :recipe_yeasts, :inverse_of => :recipe, :dependent => :destroy
  has_many :ratings, :inverse_of => :recipe, :dependent => :destroy

  accepts_nested_attributes_for :recipe_malts, :allow_destroy => true,
                                reject_if: lambda { |attributes| attributes[:quantity].blank? }

  accepts_nested_attributes_for :recipe_hops, :allow_destroy => true,
                                reject_if: lambda { |attributes| attributes[:quantity].blank? }

  accepts_nested_attributes_for :recipe_yeasts, :allow_destroy => true

  validates :batch_volume, numericality: { greater_than: 0 }
  validates :views, numericality: { greater_than_or_equal_to: 0 }
  validates :efficiency, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :OG, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 2 }
  validates :FG, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 2 }
  validates :colour, numericality: { greater_than_or_equal_to: 0 }

end
