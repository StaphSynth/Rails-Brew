module RatingsHelper

  #returns the average rating of the passed recipe to 2 decimal places
  def get_average_rating(recipe)
    return "%g" % ("%.2f" % (Rating.where(:recipe_id => recipe.id).average(:rating)))
  end

  #returns the user rating for the passed recipe
  def get_user_rating(user, recipe)
    return Rating.find_by(:recipe_id => recipe.id, :user_id => user.id).rating
  end

  #returns a boolean denoting if the user has left a rating for the passed recipe
  def rated?(user, recipe)
    return false if !logged_in?
    Rating.find_by(:recipe_id => recipe.id, :user_id => user.id) ? true : false
  end

  #returns the options hash for the form_for helper
  def get_options_hash(type, rating = nil)
    case type
    when :create
      return {:url => {:controller => 'ratings', :action => 'create'}, :html => {:method => :post}}
    when :edit
      return {:url => {:controller => 'ratings', :action => 'update', :id => rating.id}, :html => {:method => :put}}
    end
  end

end
