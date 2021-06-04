module Types
  class ExportProductType < Types::BaseObject
    
    field :title, String, null: true
    field :handle, String, null: true
    field :selling_plan_group_count, ID, null: true
    field :description, String, null: true
    field :created_at, String, null: true
    field :updated_at, String, null: true
    field :gift_card_template_suffix, String, null: true
    field :has_only_default_variant, GraphQL::Types::Boolean, null: true
    field :has_out_of_stock_variants, GraphQL::Types::Boolean, null: true
    field :is_gift_card, GraphQL::Types::Boolean, null: true
    field :product_type, String, null: true
    field :requires_selling_plan, GraphQL::Types::Boolean, null: true
    field :vendor, String, null: true
    field :tracks_inventory, GraphQL::Types::Boolean, null: true
    field :total_inventory, ID, null: true
    field :total_variants, ID, null: true

    def created_at
      object[:created_at].to_datetime.strftime('%b %d %Y, %I:%M %p')
    end

    def updated_at
      object[:updated_at].to_datetime.strftime('%b %d %Y, %I:%M %p')
    end
    
  end
end
