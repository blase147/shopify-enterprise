module Types
  class SubscriptionProductType < Types::BaseObject
    field :id, ID, null: false
    field :status, String, null: false
    field :selling_plan, String, null: false
    field :products, String, null: false
    field :created_at, String, null: false

    def selling_plan
      selling_plan = "all"
      if object.selling_plan.present?
        selling_plan = object&.selling_plan&.name
      end
      selling_plan
    end

    def products
      products = []
      object.product_images&.each do |p|
        products << p["product_id"]
      end
      products.join(", ")
    end

    def created_at
      object&.created_at&.strftime("%Y-%m-%d")
    end
  end
end