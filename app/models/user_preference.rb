class UserPreference < ApplicationRecord
  belongs_to :user

  validates :volume, length: {is: 1}, format: {with: /[LG]/} # L = litres, G = gallons
  validates :temp, length: {is: 1}, format: {with: /[CF]/}   # C = celcius, F = fahrenheit
  validates :weight, length: {is: 1}, format: {with: /[MI]/} # M = metric (g/kg), I = imperial (lbs/oz)
  validates :default_efficiency, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
end
