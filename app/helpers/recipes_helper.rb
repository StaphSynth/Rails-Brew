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

  #returns an object containing style data-accessing methods when passed a BJCP subcategory id as a string
  #accepts a type symbol (default :ruby). Returns the style info as a ruby object by default, pass :json
  #for a json response
  def get_style(id, response = :ruby)
    if(response == :ruby)
      return OpenStruct.new(get_styles[id])
    elsif(response == :json)
      return get_styles[id]
    else
      return false
    end
  end

end
