class UserPreferencesController < ApplicationController

  before_action :get_user
  before_action :set_preferences

  def edit
    gon.userPref = @user_preference
  end

  def update
    if(@user_preference.update_attributes(finalize_params(user_preference_params)))
      redirect_to preferences_url, :notice => 'Your preferences have been updated.'
    else
      render :edit
    end
  end

  private

    def user_preference_params
      params.require(:user_preference).permit(:user_id, :volume, :temp, :weight_big, :weight_small,
                                              :default_efficiency, :default_batch_volume)
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

    def finalize_params(pref_params)
      if(pref_params[:weight_big] == 'K')
        pref_params[:weight_small] = 'M'
      elsif(pref_params[:weight_big] == 'I')
        pref_params[:weight_small] = 'O'
      end

      return pref_params
    end
end
