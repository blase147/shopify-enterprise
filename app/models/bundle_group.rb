class BundleGroup < ApplicationRecord
  belongs_to :shop
  has_many :bundles, dependent: :destroy
  accepts_nested_attributes_for :bundles, reject_if: :all_blank, allow_destroy: true

  after_create_commit :create_shopify_bundle
  after_update_commit :update_shopify_bundle
  after_destroy_commit :remove_shopify_product

  def create_shopify_bundle
    BundleService::ShopifyProduct.new(self).create
  end

  def update_shopify_bundle
    BundleService::ShopifyProduct.new(self).update
  end

  def remove_shopify_product
    begin
      ShopifyAPI::Product.new(id: shopify_product_id).destroy
    rescue => e
      puts e
    end
  end
end
