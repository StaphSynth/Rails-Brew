class MaltsController < ApplicationController
  before_action :set_malt, only: [:show, :edit, :update, :destroy]

  # GET /malts
  # GET /malts.json
  def index
    @malts = Malt.all
  end

  # GET /malts/1
  # GET /malts/1.json
  def show
  end

  # GET /malts/new
  def new
    @malt = Malt.new
  end

  # GET /malts/1/edit
  def edit
  end

  # POST /malts
  # POST /malts.json
  def create
    @malt = Malt.new(malt_params)

    respond_to do |format|
      if @malt.save
        format.html { redirect_to @malt, notice: 'Malt was successfully created.' }
        format.json { render :show, status: :created, location: @malt }
      else
        format.html { render :new }
        format.json { render json: @malt.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /malts/1
  # PATCH/PUT /malts/1.json
  def update
    respond_to do |format|
      if @malt.update(malt_params)
        format.html { redirect_to @malt, notice: 'Malt was successfully updated.' }
        format.json { render :show, status: :ok, location: @malt }
      else
        format.html { render :edit }
        format.json { render json: @malt.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /malts/1
  # DELETE /malts/1.json
  def destroy
    @malt.destroy
    respond_to do |format|
      format.html { redirect_to malts_url, notice: 'Malt was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_malt
      @malt = Malt.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def malt_params
      params.require(:malt).permit(:name, :ingredient_id, :malt_type, :use, :EBC, :GPK, :description)
    end
end
