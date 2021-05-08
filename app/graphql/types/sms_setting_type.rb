module Types
  class SmsSettingType < Types::BaseObject
    field :id, ID, null: false
    field :status, String, null: true
    field :delay_order, String, null: true
    field :order_tracking, String, null: true
    field :renewal_reminder, String, null: true
    field :swap_product, String, null: true
    field :update_billing_detail, String, null: true
    field :update_shipping_detail, String, null: true
    field :skip_update_next_charge, String, null: true
    field :one_time_upsells, String, null: true
    field :cancel_reactivate_subscription, String, null: true
    field :edit_quantity, String, null: true
    field :cancel_subscription, String, null: true
    field :winback_flow, String, null: true
    field :delivery_start_time, String, null: true
    field :delivery_end_time, String, null: true
    field :renewal_duration, String, null: true
    field :updated_at, String, null: true
    field :shop_phone, String, null: true
    field :sms_count, String, null: true
    field :sms_charge_amount, String, null: true

    def shop_phone
      object.shop.phone
    end

    def sms_count
      @list = $twilio_client.usage.records.list
      @list.sum { |l| l.count_unit == 'messages' ? l.count.to_i : 0 }
    end

    def sms_charge_amount
      @list.sum { |l| l.count_unit == 'messages' ? l.price.to_f : 0 }
    end

    def delivery_start_time
      object.delivery_start_time&.strftime('%H:%M')
    end

    def delivery_end_time
      object.delivery_end_time&.strftime('%H:%M')
    end
  end
end
