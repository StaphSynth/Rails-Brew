class RatingsController < ApplicationController

  before_action :get_recipe
  before_action :valid_user

  def create
    @rating = Rating.new(rating_params)

    if(@rating.save)
      redirect_to @recipe, :notice => 'Rating saved!'
    else
      flash.now[:error] = 'Rating failed to save. Please try again later.'
    end
  end

  def update
    @rating = Rating.find_by(:recipe_id => rating_params[:recipe_id], :user_id => rating_params[:user_id])

    if(@rating.update_attributes(rating_params))
      redirect_to @recipe, :notice => 'Your rating has been updated.'
    else
      flash.now[:error] = 'Rating failed to update. Please try again later.'
    end

  end

  private

    def rating_params
      params.require(:rating).permit(:user_id, :recipe_id, :rating)
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

end
