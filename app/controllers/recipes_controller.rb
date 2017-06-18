class RecipesController < ApplicationController
  before_action :set_recipe, only: [:show, :edit, :update, :destroy]
  before_action :set_current_user, only: [:show, :edit, :update, :destroy]
  before_action :logged_in_user, only: [:new, :create, :edit, :update, :destroy]
  before_action :valid_user, only: [:edit, :update, :destroy]
  before_action :set_gon

  # GET /recipes
  # GET /recipes.json
  def index
    @recipes = Recipe.paginate(page: params[:page])

    #set the star ratings to display only for recipe index
    gon.ratingData = {
      dispOnly: true
    }
  end

  # GET /recipes/1
  # GET /recipes/1.json
  def show

    if(logged_in? && (@recipe.user != @current_user))
      #don't add to the view count if user looking at their own recipes
      @recipe.update_attribute(:views, @recipe.views + 1)

      #use gon gem to provide parameters for jQ ajax req function
      if(helpers.rated?(@current_user, @recipe))
        gon.ratingData = {
          dispOnly: false,
          action: "update",
          rating: {
            id: Rating.find_by(:recipe_id => @recipe.id, :user_id => @current_user.id).id,
            user_id: @current_user.id,
            recipe_id: @recipe.id
          }
        }
      else  #if not already rated, a rating needs to be created
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
    else #if not logged in or recipe owner, set ratings to display only
      gon.ratingData = {
        dispOnly: true
      }
    end
  end

  #deals with AJAX req for style properties to display once a style has been selected
  def styles
    respond_to do |format|
      format.json{ render :json => helpers.get_style(params[:style_id], :json) }
    end
  end

  #index of BJCP beer styles
  def style_guide
    @styles = helpers.generate_style_array
  end

  # GET /recipes/new
  def new
    @recipe = Recipe.new
    @recipe.recipe_malts.build
    @recipe.recipe_hops.build
    @recipe.recipe_yeasts.build

    #instantiate empty gon hop and malt arrays.
    #These will be used on the front-end for storage of malt and hop data required for
    #various prediction calculations like beer colour, IBUs, OG, ABV, etc.
    gon.malts = Array.new
    gon.hops = Array.new
  end

  # GET /recipes/1/edit
  def edit
    #set the current style data for use by page JS.
    gon.styleData = helpers.get_style(@recipe.style, :json)
  end

  #ingredient data retrieval API. Sends ingredient data to the front-end via AJAX
  def ingredient_data
    respond_to do |format|
      format.json { render json: helpers.get_ingredient(params[:ingredient_type], params[:ingredient_id]) }
    end
  end

  # POST /recipes
  # POST /recipes.json
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

  # PATCH/PUT /recipes/1
  # PATCH/PUT /recipes/1.json
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

  # DELETE /recipes/1
  # DELETE /recipes/1.json
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
      redirect_to @current_user, notice: "You may only modify or delete your own recipes" unless @current_user == @recipe.user
    end

    def set_gon
      gon.ratingData = {}
      gon.styleData = {}
    end

    def set_current_user
      @current_user = current_user if logged_in?
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def recipe_params
      params.require(:recipe).permit(:user_id, :name, :method, :style, :views, :style_id, :batch_volume,
                                    :OG, :FG, :colour, :efficiency, :ingredient_type, :ingredient_id,
                                    :recipe_malts_attributes => [:id, :malt, :quantity, :_destroy],
                                    :recipe_hops_attributes => [:id, :hop, :quantity, :_destroy],
                                    :recipe_yeasts_attributes => [:id, :yeast, :_destroy])
    end
end
