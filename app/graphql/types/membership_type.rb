module Types
    class MembershipType < Types::BaseObject
      field :id, ID, null: false
      field :name, String, null: true
      field :status, String, null: true
      field :tag, String, null: true
      field :associated_items, String, null: true
  
      field :created_at, String, null: true
      field :updated_at, String, null: true
      field :active_members, String, null: true
      field :selling_plan_name, String, null: true
  
      def created_at
        object.created_at&.strftime('%b %d %Y, %I:%M %p')
      end
  
      def updated_at
        object. updated_at&.strftime('%b %d %Y, %I:%M %p')
      end

      def active_members
        nil
      end

      def selling_plan_name
        object&.selling_plan&.name
      end

      def associated_items
        name = []
        if object.membership_type == "selling_plan"
          name << object.selling_plan.name
        elsif object.membership_type == "products"
          object.product_images&.each do |p|
            name << p["title"]
          end
        elsif object.membership_type == "variants"
          object.variant_images&.each do |p|
            name << p["title"]
          end
        end
        return name.join(", ")
      end
    end
end