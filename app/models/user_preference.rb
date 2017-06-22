class UserPreference < ApplicationRecord
  belongs_to :user

  validates :volume, length: {is: 1}, format: {with: /[LGB]/} # L = litres, G = US gallons, B = British Gallons
  validates :temp, length: {is: 1}, format: {with: /[CF]/}   # C = celcius, F = fahrenheit
  validates :weight_big, length: {is: 1}, format: {with: /[KI]/} # K = metric kg, I = imperial lbs
  validates :weight_small, length: {is: 1}, format: {with: /[MO]/} # M = metric g, O = imperial oz
  validates :default_efficiency, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
end
