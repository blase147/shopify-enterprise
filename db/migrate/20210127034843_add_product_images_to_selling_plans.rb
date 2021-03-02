class AddProductImagesToSellingPlans < ActiveRecord::Migration[6.0]
  def change
    add_column :selling_plans, :product_images, :json
  end
end
