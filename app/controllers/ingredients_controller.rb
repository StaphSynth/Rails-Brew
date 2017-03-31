class IngredientsController < ApplicationController
  before_action :set_ingredient, only: [:show, :edit, :update, :destroy]

  # GET /ingredients
  # GET /ingredients.json
  def index
    @ingredients = Ingredient.all
  end

  # GET /ingredients/1
  # GET /ingredients/1.json
  def show
  end

  # GET /ingredients/new
  def new
    @ingredient = Ingredient.new
  end

  # GET /ingredients/1/edit
  def edit
  end

  # POST /ingredients
  # POST /ingredients.json
  def create
    hash_exceptions = [:malt, :hop, :yeast]
    @ingredient = Ingredient.new(ingredient_params.except(*hash_exceptions))

    if ! @ingredient.save
      respond_to do |format|
        puts @ingredient.errors
        format.html { render :new }
        format.json { render json: @ingredient.errors, status: :unprocessable_entity }
      end
      return
    end

    case @ingredient.ingredient_type
      when "malt"
        @details = Malt.new(ingredient_params[:malt])
      when "hops"
        @details = Hop.new(ingredient_params[:hop])
      when "yeast"
        @details = Yeast.new(ingredient_params[:yeast])
    end

    @details[:ingredient_id] = @ingredient.id
    if ! @details.save
      @ingredient.destroy
      respond_to do |format|
        format.html { render :new }
        format.json { render json: @ingredient.errors, status: :unprocessable_entity }
      end
      return
    end

    respond_to do |format|
      format.html { redirect_to @ingredient, notice: "#{@ingredient.ingredient_type}, #{@ingredient.name}, was successfully created." }
      format.json { render :show, status: :created, location: @ingredient }
    end
  end

  # PATCH/PUT /ingredients/1
  # PATCH/PUT /ingredients/1.json
  def update
    respond_to do |format|
      if @ingredient.update(ingredient_params)
        format.html { redirect_to @ingredient, notice: "#{@ingredient.name} successfully updated." }
        format.json { render :show, status: :ok, location: @ingredient }
      else
        format.html { render :edit }
        format.json { render json: @ingredient.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /ingredients/1
  # DELETE /ingredients/1.json
  def destroy
    @ingredient.destroy
    respond_to do |format|
      format.html { redirect_to ingredients_url, notice: "#{@ingredient.name} was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_ingredient
      @ingredient = Ingredient.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def ingredient_params
      params.require(:ingredient).permit(:ingredient_type, :name,
                                        malt: [:malt_type, :use, :EBC, :GPK, :description],
                                        yeast: [:fermentation_type, :temp_range, :description],
                                        hop: [:use, :origin, :aa, :description])
    end
end
