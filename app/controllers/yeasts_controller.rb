class YeastsController < ApplicationController
  before_action :set_yeast, only: [:show, :edit, :update, :destroy]

  # GET /yeasts
  # GET /yeasts.json
  def index
    @yeasts = Yeast.all
  end

  # GET /yeasts/1
  # GET /yeasts/1.json
  def show
  end

  # GET /yeasts/new
  def new
    @yeast = Yeast.new
  end

  # GET /yeasts/1/edit
  def edit
  end

  # POST /yeasts
  # POST /yeasts.json
  def create
    @yeast = Yeast.new(yeast_params)

    respond_to do |format|
      if @yeast.save
        format.html { redirect_to @yeast, notice: 'Yeast was successfully created.' }
        format.json { render :show, status: :created, location: @yeast }
      else
        format.html { render :new }
        format.json { render json: @yeast.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /yeasts/1
  # PATCH/PUT /yeasts/1.json
  def update
    respond_to do |format|
      if @yeast.update(yeast_params)
        format.html { redirect_to @yeast, notice: 'Yeast was successfully updated.' }
        format.json { render :show, status: :ok, location: @yeast }
      else
        format.html { render :edit }
        format.json { render json: @yeast.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /yeasts/1
  # DELETE /yeasts/1.json
  def destroy
    @yeast.destroy
    respond_to do |format|
      format.html { redirect_to yeasts_url, notice: 'Yeast was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_yeast
      @yeast = Yeast.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def yeast_params
      params.require(:yeast).permit(:name, :type, :temp_range, :description)
    end
end
