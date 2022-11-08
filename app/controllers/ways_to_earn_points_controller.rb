class WaysToEarnPointsController < ApplicationController
  before_action :set_ways_to_earn_point, only: [:show, :edit, :update, :destroy]

  # GET /ways_to_earn_points
  # GET /ways_to_earn_points.json
  def index
    @ways_to_earn_points = WaysToEarnPoint.all
  end

  # GET /ways_to_earn_points/1
  # GET /ways_to_earn_points/1.json
  def show
  end

  # GET /ways_to_earn_points/new
  def new
    @ways_to_earn_point = WaysToEarnPoint.new
  end

  # GET /ways_to_earn_points/1/edit
  def edit
  end

  # POST /ways_to_earn_points
  # POST /ways_to_earn_points.json
  def create
    @ways_to_earn_point = WaysToEarnPoint.new(ways_to_earn_point_params)

    respond_to do |format|
      if @ways_to_earn_point.save
        format.html { redirect_to @ways_to_earn_point, notice: 'Ways to earn point was successfully created.' }
        format.json { render :show, status: :created, location: @ways_to_earn_point }
      else
        format.html { render :new }
        format.json { render json: @ways_to_earn_point.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /ways_to_earn_points/1
  # PATCH/PUT /ways_to_earn_points/1.json
  def update
    respond_to do |format|
      if @ways_to_earn_point.update(ways_to_earn_point_params)
        format.html { redirect_to @ways_to_earn_point, notice: 'Ways to earn point was successfully updated.' }
        format.json { render :show, status: :ok, location: @ways_to_earn_point }
      else
        format.html { render :edit }
        format.json { render json: @ways_to_earn_point.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /ways_to_earn_points/1
  # DELETE /ways_to_earn_points/1.json
  def destroy
    @ways_to_earn_point.destroy
    respond_to do |format|
      format.html { redirect_to ways_to_earn_points_url, notice: 'Ways to earn point was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_ways_to_earn_point
      @ways_to_earn_point = WaysToEarnPoint.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def ways_to_earn_point_params
      params.require(:ways_to_earn_point).permit(:title, :points_awarded, :status, :summary, :shop_id)
    end
end
