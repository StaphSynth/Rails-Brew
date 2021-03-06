class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  before_action :logged_in_user, only: [:edit, :update]
  before_action :correct_user, only: [:edit, :update]
  before_action :admin_user, only: :destroy

  # GET /users
  # GET /users.json
  def index
    @users = User.all
  end

  # GET /users/1
  # GET /users/1.json
  def show
    #set ratings to display only for showing users' recipes
    gon.ratingData = { dispOnly: true }
    #set gon.userPref required by JS
    gon.userPref = UserPreference.find_by(:user_id => @user.id)
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
    @user = User.find(params[:id])
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        UserPreference.create(preference_defaults(@user.id))
        UserMailer.account_activation(@user).deliver_now
        format.html {
                      redirect_to root_url,
                      notice: "Welcome aboard, #{@user.name}. Please check your email to activate your account."
                    }
      else
        format.html { render :new }
      end
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to @user, notice: 'Your account was successfully updated.' }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url, notice: 'User was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    def preference_defaults(user_id)
      {
        user_id: user_id,
        volume: 'L',
        temp: 'C',
        weight_big: 'K',
        weight_small: 'M'
      }
    end

    def logged_in_user
      if(!logged_in?)
        store_req_url #for redirecting to the req resource after login
        respond_to do |format|
          format.html { redirect_to login_url, notice: "Login required to perform that action." }
        end
      end
    end

    def correct_user
      @user = User.find(params[:id])
      if(!current_user?(@user))
        redirect_to current_user, notice: "You may only edit your own profile."
      end
    end

    def admin_user
      redirect_to root_url unless current_user.admin?
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation, :location)
    end
end
