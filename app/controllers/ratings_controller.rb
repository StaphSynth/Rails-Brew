class RatingsController < ApplicationController

  before_action :get_recipe
  before_action :valid_user

  def create
    @rating = Rating.new(rating_params)

    respond_to do |format|
      if(@rating.save)
        format.json { render :json => json_response }
      else
        format.html { redirect_to @recipe, :notice => "Rating failed to save." }
      end
    end
  end

  def update
    @rating = Rating.find_by(:id => rating_params[:id])

    respond_to do |format|
      if(@rating.update_attributes(rating_params))
        format.json { render :json => json_response }
        # format.html { redirect_to @recipe, notice: 'Rating updated.' }
      else
        format.html { redirect_to @recipe, :notice => "Rating failed to update." }
      end
    end

  end

  private

    def rating_params
      params.require(:rating).permit(:id, :user_id, :recipe_id, :rating)
    end

    def valid_user
      if(!logged_in?)
        redirect_to login_url, :notice => "You must be logged in to edit recipe ratings"
      elsif(current_user == @recipe.user)
        redirect_to @recipe, :notice => "You may not rate your own recipes."
      end
    end

    def get_recipe
      @recipe = Recipe.find_by(:id => rating_params[:recipe_id])
    end

    def json_response
      {
        aggregateRating: helpers.get_average_rating(@recipe),
        userRating: @rating.rating,
        ratingId: @rating.id,
        notice: 'Rating updated.'
      }
    end

end
