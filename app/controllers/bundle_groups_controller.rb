class BundleGroupsController < AuthenticatedController
  before_action :set_bundle_group, only: [:show, :edit, :update, :destroy]
  skip_before_action :verify_authenticity_token

  def index
    @bundle_groups = BundleGroup.all
    render json: @bundle_groups
  end

  def show
    render json: @bundle_group.as_json(include: :bundles)
  end

  def create
    permitted_params = bundle_group_params
    permitted_params[:bundles_attributes] = params[:bundle_group].delete(:bundles).map{|b| b.permit(:quantity_limit, :box_price, :price_per_item, :label)}

    @bundle_group = BundleGroup.new(permitted_params)
    @bundle_group.shop = current_shop
    if @bundle_group.save
      render :show, status: :created, location: @bundle_group
    else
      render json: @bundle_group.errors, status: :unprocessable_entity
    end
  end

  def update
    if @bundle_group.shop_id == current_shop.id
      permitted_params = bundle_group_params
      permitted_params[:bundles_attributes] = params[:bundle_group].delete(:bundles).map{|b| b.permit(:quantity_limit, :box_price, :price_per_item, :label)}
      if @bundle_group.update(permitted_params)
        render json: @bundle_group, status: :ok, location: @bundle_group
      else
        render json: @bundle_group.errors, status: :unprocessable_entity
      end
    else
      render json: {}, status: :unauthorized
    end
  end

  def destroy
    @bundle_group.destroy

    head :no_content
  end

  private
    def set_bundle_group
      @bundle_group = BundleGroup.find(params[:id])
    end

    def bundle_group_params
      params.require(:bundle_group).permit(:triggers, :fixed_pricing, :internal_name, :location, :start_date, :end_date, :bundle_type, :collection_images => [:collectionId, :collectionTitle, products: [:productId, :image]], :product_images => [:productId, :image], :selling_plans => [:sellingPlanName, :sellingPlanId])
    end
end
