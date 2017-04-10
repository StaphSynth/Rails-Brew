class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.find_by(email: params[:session][:email].downcase)
    respond_to do |format|
      if(user && user.authenticate(params[:session][:password]))
        #log in
        log_in(user)
        #redirect to user#show
        format.html { redirect_to user, notice: "Welcome back #{user.name}!" }
      else
        #show error
        format.html { redirect_to login_url, notice: "Username/password incorrect. Please try again." }
      end
    end
  end

  def destroy
    log_out
    redirect_to root_url
  end
end
