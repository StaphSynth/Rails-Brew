class RatingsController < ApplicationController

  before_action :get_recipe
  before_action :valid_user

  def create
    @rating = Rating.new(rating_params)

    if(@rating.save)
      redirect_to @recipe, :notice => 'Rating saved!'
    else
      redirect_to @recipe, :notice => "Rating failed to save. #{error_handler(@rating)}"
    end
  end

  def update
    @rating = Rating.find_by(:recipe_id => rating_params[:recipe_id], :user_id => rating_params[:user_id])
    error_messages = ""

    if(@rating.update_attributes(rating_params))
      redirect_to @recipe, :notice => 'Your rating has been updated.'
    else
      redirect_to @recipe, :notice => "Rating failed to update. #{error_handler(@rating)}"
    end

  end

  private

    def error_handler(rating)
      error_messages = ""
      if(rating.errors.any?)
        rating.errors.full_messages.each do |message|
          error_messages += message + ". "
        end
      end
      return error_messages
    end

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
