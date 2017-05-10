class RecipesController < ApplicationController
  before_action :set_recipe, only: [:show, :edit, :update, :destroy]

  # GET /recipes
  # GET /recipes.json
  def index
        #for when logins are req'd:
        # current_user.recipes
        # Recipe.predefined ?
    @recipes = Recipe.all
  end

  # GET /recipes/1
  # GET /recipes/1.json
  def show
  end

  # GET /recipes/new
  def new
    if(!logged_in?)
      redirect_to login_url, :notice => "You must be logged in to create new recipes"
    end
    
    @recipe = Recipe.new
    @recipe.malts.build
    @recipe.hops.build
    @recipe.yeasts.build
  end

  # GET /recipes/1/edit
  def edit
    if(!logged_in?)
      redirect_to login_url, notice: "Login required to complete that action"
    elsif(current_user != @recipe.user)
      redirect_to current_user, notice: "You may only edit your own recipes"
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
      format.html { redirect_to recipes_url, notice: "#{@recipe.name} deleted." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_recipe
      @recipe = Recipe.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def recipe_params
      params.require(:recipe).permit(:user_id, :name, :method, :malts_attributes => [:id, :name, :malt_type, :use, :EBC, :ppg, :quantity, :_destroy],
                                                               :hops_attributes => [:id, :name, :use, :origin, :aa, :quantity, :_destroy],
                                                               :yeasts_attributes => [:id, :name, :fermentation_type, :temp_range, :_destroy])
    end
end
