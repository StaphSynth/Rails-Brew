module RatingsHelper

  #returns the average rating of the passed recipe to 2 decimal places
  def get_average_rating(recipe)
    average_rating = Rating.where(:recipe_id => recipe.id).average(:rating)
    if(average_rating)
      return "%g" % ("%.2f" % (average_rating))
    else
      return 0
    end
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
end
