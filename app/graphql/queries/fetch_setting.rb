module Queries
  class FetchSetting < Queries::BaseQuery

    type Types::SettingType, null: false

    def resolve
      @setting = current_shop.setting || current_shop.create_setting
      if @setting.email_notifications.blank?
        email_notifications = [
          {name: 'Subscription Activation', descripton: 'Sent to customers when they first sign up for a subscription', status: true, slug: "customer" },
          {name: 'Subscription Cancellation', descripton: 'Sent to customers when they cancel all subscription and become inactive', status: true, slug: "customer" },
          {name: 'Recurring Charge Confirmation', descripton: 'Sent to customers when their recurring payment is processed', status: true, slug: "customer"},
          {name: 'Upcoming Charge', descripton: 'Sent to customers 3 days before their card is charged for renewal', status: true, slug: "customer" },
          {name: 'Out of Stock', descripton: 'Sent to customers when purchase runs out of stock', status: true, slug: "customer" },
          {name: 'Card declined', descripton: 'Sent to customers when card charge is declined', status: true, slug: "customer" },
          {name: 'Delayed checkout payment failed', descripton: 'Sent to customers when a delayed checkout charge is declined', status: true, slug: "customer" },
          {name: 'Card expiring', descripton: 'Sent to customers when their credit card is about to expire. Emails will be sent out', status: true, slug: "customer" },
          {name: 'Refund', descripton: 'Sent to customers when charge is refunded', status: true, slug: "customer",setting_id: 1 },
          {name: 'Get account access', descripton: 'Sent to customers when they enter their email to access their subscriptions', status: true, slug: "customer" },
          {name: 'Payment Re-authentication', descripton: 'Sent to your customers when their payment source needs to be re-authenticated.', status: true, slug: "customer" },

          {name: 'Cancellation Alert', descripton: 'Sent to storeowner when customer cancels an item', status: true, slug: "store_owner" },
          {name: 'Error Charge Processed', descripton: 'Sent to storeowner when a recurring payment is processed', status: true, slug: "store_owner" },
          {name: 'Variant not found', descripton: 'Sent to storeowner when variant not found error occurs in an order', status: true, slug: "store_owner"},
          {name: 'Customer Action Log', descripton: 'Sent to storeowner, daily log of customer’s actions', status: true, slug: "store_owner" },
        ]
        @setting.email_notifications.create(email_notifications)
      end
      if @setting.reasons_cancels.blank?
        reason_cancels = [
          {title: 'This is too expensive', return_content: 'Returns cancel option and comment field'},
          {title: 'This was created by accident', return_content: 'Returns cancel option and comment field'},
          {title: 'I already have more than I need', return_content: 'Returns cancel and skip or pause options'},
          {title: 'I need it sooner', return_content: 'Returns cancel option and comment field'},
        ]
        @setting.reasons_cancels.create(reason_cancels)
      end
      # byebug
      @setting
    end
  end
end