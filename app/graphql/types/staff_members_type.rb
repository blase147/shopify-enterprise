module Types
    class StaffMembersType < Types::BaseObject
      field :id, String, null: true
      field :first_name, String, null: true
      field :last_name, String, null: true
      field :name, String, null: true
      field :email, String, null: true
      field :dashboard_access, String, null: true
      field :mange_plan_access, String, null: true
      field :subscriptions_orders_access, String, null: true
      field :analytics_access, String, null: true
      field :installation_access, String, null: true
      field :tiazens_access, String, null: true
      field :toolbox_access, String, null: true
      field :settings_access, String, null: true
      field :created_at, String, null:true
  
      def first_name
        object.user.first_name
      end
      def last_name
        object.user.last_name
      end
      def name
        object.user.name
      end
      def email
        object.user.email
      end
      def created_at
        object&.created_at&.strftime("%Y-%m-%d")
      end
  
      def name
        object&.user.full_name
      end
  
      def dashboard_access
        object.user_shop_child_setting.dashboard_access
      end
      def mange_plan_access
        object.user_shop_child_setting.manage_plan_access
      end
      def subscriptions_orders_access
        object.user_shop_child_setting.subscription_orders_access
      end
      def analytics_access
        object.user_shop_child_setting.analytics_access
      end
      def installation_access
        object.user_shop_child_setting.installation_access
      end
      def tiazens_access
        object.user_shop_child_setting.tiazen_access
      end
      def toolbox_access
        object.user_shop_child_setting.toolbox_access
      end
      def settings_access
        object.user_shop_child_setting.settings_access
      end
    end
end