class Bundle < ApplicationRecord
  belongs_to :bundle_group

  after_destroy_commit :remove_shopify_variant

  def remove_shopify_variant
    ShopifyAPI::Variant.new(id: shopify_variant_id).destroy
  end
end
