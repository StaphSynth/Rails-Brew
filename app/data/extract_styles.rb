# used to extract useful style data from the bjcp styleguide JSON file taken from
# https://github.com/gthmb/bjcp-2015-json
# outputs a hash with subcategory ids as keys to hashes containing the specific data.
# ONLY RUN THIS SCRIPT TO UPDATE THE style_data.json FILE TO A NEWER VERSION OF THE BJCP STYLEGUIDE
# To run, download the latest version of the styleguide JSON to this folder,
# change the file_name string to whatever the latest version is, then
# $ ruby extract_styles.rb > style_data.json


require "active_support/core_ext/hash/except"
require "json"

file_name = 'bjcp_styleguide_2015.json'

style_guide = JSON.parse File.read file_name

condensed_style_data = Hash.new

style_guide['class'][0]['category'].each do |category|
  category['subcategory'].each do |subcategory|
    condensed_style_data[subcategory['id']] = subcategory.except!('id')
  end
end

puts condensed_style_data.to_json
