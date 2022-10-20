module Types
  class SubscriptionLogType < Types::BaseObject
    field :id, ID, null: true
    field :action_type, String, null: true
    field :created_at, String, null: true
    field :description, String, null: true
    field :amount, String, null: true
    field :note, String, null: true
    field :event, String, null: true
    field :customer_name, String, null: true

    def created_at
      object[:created_at].to_datetime.strftime('%b %d %Y, %I:%M %p')
    end

    def event
      case object[:action_type]
      when "opt_in"
        "New"
      else
        object[:action_type]
      end
    end

    def customer_name
      object&.customer_subscription_contract&.name
    end
  end
end
