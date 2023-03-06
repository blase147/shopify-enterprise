class AddProductImagesVariantImagesAndMembershipTypeToMembership < ActiveRecord::Migration[6.0]
    def change
      add_column :memberships, :product_images, :json
      add_column :memberships, :variant_images, :json
      add_column :memberships, :membership_type, :string
    end
end
  