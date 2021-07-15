class AddBoxSubscriptionCollectionImageField < ActiveRecord::Migration[6.0]
  def change
    add_column :selling_plans, :collection_images, :json
  end
end
