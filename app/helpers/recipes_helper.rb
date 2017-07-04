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

  #takes the hash of styles and generates an array of the values
  def generate_style_array
    styles = Array.new

    #extract the styles from the hash
    get_styles.each do |k,v|
      styles.push(v)
    end

    return styles
  end

  #get the symbol for the specific unit as stored in user_preferences
  def get_unit_symbol(unit)
    symbols = {
      I: 'lb',
      O: 'oz',
      M: 'g',
      K: 'kg',
      L: 'L',
      G: 'Gal.',
      B: 'Imp. Gal.',
      F: '°F',
      C: '°C'
    }
    symbols[unit.to_sym]
  end

  def minutes_array
    minutes = []
    val = 0

    loop do
      minutes.push([val, val])
      val += 5
      break if val == 65
    end

    minutes.push([90, 90])

    return minutes
  end
end
