module Types
    class RebuyType < Types::BaseObject
        field :id, ID, null: true
        field :customer_name, String, null: true
        field :url, String, null: true
        field :created_at, String, null: true
    
        def created_at
          object.created_at&.strftime('%b %d %Y, %I:%M %p')
        end

        def customer_name
            "#{object.customer_modal.first_name&.humanize} #{object.customer_modal.last_name&.humanize}" 
        end

        def url
            "https://#{object.shop.shopify_domain}/a/chargezen/rebuy/#{object.token}"
        end
    end
end
  