class RecipesController < ApplicationController
  before_action :set_recipe, only: [:show, :edit, :update, :destroy]
  before_action :set_current_user, only: [:show, :edit, :update, :destroy]
  before_action :logged_in_user, only: [:new, :create, :edit, :update, :destroy]
  before_action :valid_user, only: [:edit, :update, :destroy]
  before_action :initialize_gon
  before_action :setup_rating, only: :show

  def index
    @recipes = Recipe.paginate(page: params[:page])
    gon.ratingData = { dispOnly: true }
  end

  def show
    @recipe.update_attribute(:views, @recipe.views + 1) unless own_recipe?
  end

  #deals with AJAX req for style properties to display once a style has been selected
  def styles
    respond_to do |format|
      format.json{ render :json => helpers.get_style(params[:style_id], :json) }
    end
  end

  #index of BJCP beer styles
  def style_guide
    @props = {styles: helpers.generate_style_array}
  end

  def new
    @recipe = Recipe.new
    @recipe.recipe_malts.build
    @recipe.recipe_hops.build
    @recipe.recipe_yeasts.build
  end

  # GET /recipes/1/edit
  def edit
    #set the current style data for use by page JS.
    # gon.styleData = helpers.get_style(@recipe.style, :json)
    @current_user_pref = UserPreference.find_by(user_id: @current_user.id)
    @props = {
      recipe: @recipe.to_json,
      styles: helpers.generate_style_options,
      malts: @recipe.recipe_malts,
      hops: @recipe.recipe_hops,
      yeasts: @recipe.recipe_yeasts,
      userPref: @current_user_pref,
      ingredientOptions: {
        malts: helpers.options_generator(:malts),
        hops: helpers.options_generator(:hops),
        yeasts: helpers.options_generator(:yeasts)
      }
    }
  end

  #ingredient data retrieval API. Sends ingredient data to the front-end via AJAX
  def ingredient_data
    respond_to do |format|
      format.json { render json: helpers.get_ingredient(params[:ingredient_type], params[:ingredient_id]) }
    end
  end

  def create
    @recipe = Recipe.new(recipe_params)

    respond_to do |format|
      if @recipe.save
        format.html { redirect_to @recipe, notice: "#{@recipe.name} successfully created." }
        format.json { render :show, status: :created, location: @recipe }
      else
        format.html { render :new }
        format.json { render json: @recipe.errors, status: :unprocessable_entity }
      end
    end
  end #/create

  def update
    respond_to do |format|
      if @recipe.update(recipe_params)
        format.html { redirect_to @recipe, notice: "#{@recipe.name} successfully updated." }
        format.json { render :show, status: :ok, location: @recipe }
      else
        format.html { render :edit }
        format.json { render json: @recipe.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @recipe.destroy
    respond_to do |format|
      format.html { redirect_to @current_user, notice: "#{@recipe.name} deleted." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_recipe
      @recipe = Recipe.find(params[:id])
    end

    def logged_in_user
      redirect_to login_url, notice: "Login required to complete that action" unless logged_in?
    end

    def valid_user
      redirect_to @current_user,
        notice: "You may only modify or delete your own recipes" unless @current_user == @recipe.user
    end

    def initialize_gon
      if logged_in?
        @current_user_pref = UserPreference.find_by(user_id: @current_user.id)
        gon.userPref = @current_user_pref
      else
        gon.userPref = {}
      end

      gon.ratingData = {}
      gon.styleData = {}
    end

    def set_current_user
      @current_user = current_user if logged_in?
    end

    def own_recipe?
      return false unless logged_in?
      @recipe.user == @current_user
    end

    def can_rate?
      !own_recipe? && logged_in?
    end

    def rated?
      helpers.rated?(@current_user, @recipe)
    end

    def setup_rating
      if can_rate?
        if rated?
          gon.ratingData = {
            dispOnly: false,
            action: "update",
            rating: {
              id: Rating.find_by(recipe_id: @recipe.id, user_id: @current_user.id).id,
              user_id: @current_user.id,
              recipe_id: @recipe.id
            }
          }
        else
          gon.ratingData = {
            dispOnly: false,
            action: "create",
            rating: {
              id: nil,
              user_id: @current_user.id,
              recipe_id: @recipe.id
            }
          }
        end
      else
        gon.ratingData = { dispOnly: true }
      end
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def recipe_params
      params.require(:recipe).permit(:user_id, :name, :method, :style, :views, :style_id, :batch_volume,
                                    :OG, :FG, :colour, :efficiency, :ingredient_type, :ingredient_id, :IBU,
                                    :recipe_malts_attributes => [:id, :malt, :quantity, :_destroy],
                                    :recipe_hops_attributes => [:id, :hop, :quantity, :boil_time, :_destroy],
                                    :recipe_yeasts_attributes => [:id, :yeast, :_destroy])
    end
end
