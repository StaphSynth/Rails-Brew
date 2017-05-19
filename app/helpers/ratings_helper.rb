module RatingsHelper

  #returns the aggregate rating of the passed recipe
  def get_aggregate_rating(recipe)
    rating_sum = 0
    ratings = Rating.where(:recipe_id => recipe.id)

    if(ratings.length == 0)
      return 0
    else
      ratings.each do |rating|
        rating_sum += rating.rating
      end
      return rating_sum / ratings.length
    end
  end

  #returns the user rating for the passed recipe
  def get_user_rating(user, recipe)
    return Rating.find_by(:recipe_id => recipe.id, :user_id => user.id)
  end

  #returns a boolean denoting if the user has left a rating for the passed recipe
  def rated?(user, recipe)
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
