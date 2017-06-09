module RecipesHelper

  #returns a hash of beer styles, indexed by their BJCP subcategory ids.
  def get_styles
    JSON.parse File.read('app/data/style_data.json')
  end

  def generate_style_options
    options = Array.new

    get_styles.each do |key, value|
      option = Array.new
      option.push(value['name'])
      option.push key

      options.push option
    end

    return options
  end

  #returns a hash containing style data when passed a BJCP subcategory id as a string
  def get_style(id)
    get_styles[id]
  end

end
