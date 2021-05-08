module Types
  module Input
    class SmsSettingInputType < Types::BaseInputObject
      argument :id, String, required: false
      argument :status, String, required: false
      argument :delay_order, String, required: false
      argument :edit_delivery_schedule, String, required: false
      argument :order_tracking, String, required: false
      argument :renewal_reminder, String, required: false
      argument :swap_product, String, required: false
      argument :update_billing_detail, String, required: false
      argument :update_shipping_detail, String, required: false
      argument :skip_update_next_charge, String, required: false
      argument :one_time_upsells, String, required: false
      argument :failed_renewal, String, required: false
      argument :cancel_reactivate_subscription, String, required: false
      argument :edit_quantity, String, required: false
      argument :cancel_subscription, String, required: false
      argument :winback_flow, String, required: false
      argument :delivery_start_time, String, required: false
      argument :delivery_end_time, String, required: false
      argument :renewal_duration, String, required: false
      argument :__typename, String, required: false
    end
  end
end
