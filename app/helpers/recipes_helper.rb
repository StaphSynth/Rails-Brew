module RecipesHelper

  #returns a hash of beer styles, indexed by their BJCP subcategory ids.
  def get_styles
    JSON.parse File.read('app/data/style_data.json')
  end
end
