class AddShopifyContractIdToWorldfarePreOrder < ActiveRecord::Migration[6.0]
  def change
    add_column :worldfare_pre_orders, :shopify_contract_id, :string
  end
end
