module Types
  class ExportCustomerType < Types::BaseObject
    
    field :first_name, String, null: true
    field :last_name, String, null: true
    field :email, String, null: true
    field :phone, String, null: true
    field :created_at, String, null: true
    field :updated_at, String, null: true
    field :accepts_marketing, GraphQL::Types::Boolean, null: true
    field :orders_count, ID, null: true
    field :state, String, null: true
    field :total_spent, String, null: true
    field :note, String, null: true
    field :verified_email, GraphQL::Types::Boolean, null: true
    field :multipass_identifier, String, null: true
    field :tax_exempt, GraphQL::Types::Boolean, null: true
    field :accepts_marketing_updated_at, String, null: true

    def created_at
      object[:created_at].to_datetime.strftime('%b %d %Y, %I:%M %p')
    end

    def updated_at
      object[:updated_at].to_datetime.strftime('%b %d %Y, %I:%M %p')
    end

    def accepts_marketing_updated_at
      object[:accepts_marketing_updated_at].to_datetime.strftime('%b %d %Y, %I:%M %p')
    end

  end
end
