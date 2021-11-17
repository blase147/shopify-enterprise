class BundleGroupsController < ApplicationController
  before_action :set_bundle_group, only: [:show, :edit, :update, :destroy]

  # GET /bundle_groups
  # GET /bundle_groups.json
  def index
    @bundle_groups = BundleGroup.all
  end

  # GET /bundle_groups/1
  # GET /bundle_groups/1.json
  def show
  end

  # GET /bundle_groups/new
  def new
    @bundle_group = BundleGroup.new
  end

  # GET /bundle_groups/1/edit
  def edit
  end

  # POST /bundle_groups
  # POST /bundle_groups.json
  def create
    @bundle_group = BundleGroup.new(bundle_group_params)

    respond_to do |format|
      if @bundle_group.save
        format.html { redirect_to @bundle_group, notice: 'Bundle group was successfully created.' }
        format.json { render :show, status: :created, location: @bundle_group }
      else
        format.html { render :new }
        format.json { render json: @bundle_group.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /bundle_groups/1
  # PATCH/PUT /bundle_groups/1.json
  def update
    respond_to do |format|
      if @bundle_group.update(bundle_group_params)
        format.html { redirect_to @bundle_group, notice: 'Bundle group was successfully updated.' }
        format.json { render :show, status: :ok, location: @bundle_group }
      else
        format.html { render :edit }
        format.json { render json: @bundle_group.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /bundle_groups/1
  # DELETE /bundle_groups/1.json
  def destroy
    @bundle_group.destroy
    respond_to do |format|
      format.html { redirect_to bundle_groups_url, notice: 'Bundle group was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_bundle_group
      @bundle_group = BundleGroup.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def bundle_group_params
      params.require(:bundle_group).permit(:shop_id, :internal_name, :location, :start_date, :end_date, :box_type, :collections, :product_images, :triggers, :selling_plans, :fixed_pricing)
    end
end
