class ChangedProductImagesAndVariantImagesInMembership < ActiveRecord::Migration[6.0]
    def change
        change_column :memberships, :product_images, :jsonb 
        change_column :memberships, :variant_images, :jsonb 
    end
end
  