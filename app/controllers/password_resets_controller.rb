class PasswordResetsController < ApplicationController

  before_action :get_user, :only => [:edit, :update]
  before_action :valid_user, :only => [:edit, :update]
  before_action :check_expiration, :only => [:edit, :update]


  def new
  end

  def create
    @user = User.find_by(:email => params[:password_reset][:email].downcase)
    respond_to do |format|
      if(@user)
        @user.create_reset_digest
        @user.send_pw_reset_mail
        format.html { redirect_to root_url, :notice => 'Password reset email sent.' }
      else
        format.html { redirect_to login_url, :notice => 'Email address not found.' }
      end
    end
  end

  def edit
  end

  def update
    if(params[:user][:password].empty?)
      @user.errors.add(:password, 'cannot be blank')
      render 'edit'
    elsif(@user.update_attributes(user_params))
      log_in(@user)
      respond_to do |format|
        format.html { redirect_to @user, :notice => 'Your password has been successfully reset.' }
      end
    else
      render 'edit'
    end
  end

  private

    def user_params
      params.require(:user).permit(:password, :password_confirmation)
    end

    def get_user
      @user = User.find_by(email: params[:email])
    end

    #confirm valid user.
    def valid_user
      unless (@user && @user.activated? && @user.authenticated?(:reset, params[:id]))
        redirect_to root_url
      end
    end

    #checks expiration of pw reset token
    def check_expiration
      if(@user.password_reset_expired?)
        respond_to do |format|
          format.html {
            redirect_to new_password_reset_url,
            :notice => 'That password reset link has expired, please request a new one.'
          }
        end
      end
    end

end
