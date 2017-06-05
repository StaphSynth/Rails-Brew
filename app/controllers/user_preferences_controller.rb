class UserPreferencesController < ApplicationController

  before_action :get_user
  before_action :set_preferences, only: :update

  def update
    if(@user_preference.update_attributes(user_preference_params))
      redirect_to preferences_url, :notice => 'Your preferences have been updated.'
    else
      redirect_to @user, :notice => 'Error updating preferences. Please try again later.'
    end
  end

  private

    def user_preference_params
      params.require(:user_preference).permit(:user_id, :volume, :temp, :weight)
    end

    def get_user
      if(!logged_in?)
        redirect_to login_url, :notice => "You must be logged in to modify preference settings."
      else
        @user = current_user
      end
    end

    def set_preferences
      @user_preference = UserPreference.find_by(:user_id => @user.id)
    end
end
