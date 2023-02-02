module Queries
  class FetchSetting < Queries::BaseQuery

    type Types::SettingType, null: false
    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      @setting = current_shop.setting || current_shop.create_setting
      if @setting.email_notifications.blank?
        email_notifications = [
          {name: "Skip Meal",description: 'Sent to customer when a meal is skipped', status: true, slug: "customer" },
          {name: "Un-Skip Meal",description: 'Sent to customer when a meal is un-skipped', status: true, slug: "customer" },
          {name: "Paused Subscription",description: 'Sent to customer when subscription is paused', status: true, slug: "customer" },
          {name: "Cancelled Subscription",description: 'Sent to customer when a subscription is cancelled', status: true, slug: "customer" },
          {name: "Resumed Subscription",description: 'Sent to customer when a subscription is resumed', status: true, slug: "customer" },
          {name: "Restarted Subscription",description: 'Sent to customer when a subscription is resumed', status: true, slug: "customer" },
          {name: "Swap Subscription",description: 'Sent to customer when a subscription is swapped', status: true, slug: "customer" },
          {name: "Choose Meals",description: 'Sent to customer when they make changes in their meals', status: true, slug: "customer" },

          {name: 'Changes Reminder', description: 'Sent to customers when a recurring order occurs', status: true, slug: "customer" },
          {name: 'Passwordless Login OTP', description: 'Send OTP to customer for passwordless login', status: true, slug: "customer" },
          {name: 'Order fulfiled', description: 'Sent to customers when an order is fulfiled)', status: true, slug: "customer" },
          {name: 'Missing Delivery Date', description: 'Sent to customers when delivery date is missing form their subscription', status: true, slug: "customer" },
          {name: 'Subscription Activation 2 Hours', description: 'Sent to customers after 2 hours of their first sign up for a subscription', status: true, slug: "customer" },
          {name: 'Subscription Activation', description: 'Sent to customers when they first sign up for a subscription', status: true, slug: "customer" },
          {name: 'Subscription Cancellation', description: 'Sent to customers when they cancel all subscription and become inactive', status: true, slug: "customer" },
          {name: 'Fill PreOrder', description: 'Sent to customers when the meals for each week is finalized.', status: true, slug: "customer"},
          {name: 'Recurring Charge Confirmation', description: 'Sent to customers when their recurring payment is processed', status: true, slug: "customer"},
          {name: 'Upcoming Charge', description: 'Sent to customers 3 days before their card is charged for renewal', status: true, slug: "customer" },
          {name: 'Out of Stock', description: 'Sent to customers when purchase runs out of stock', status: true, slug: "customer" },
          {name: 'Card declined', description: 'Sent to customers when card charge is declined', status: true, slug: "customer" },
          {name: 'Delayed checkout payment failed', description: 'Sent to customers when a delayed checkout charge is declined', status: true, slug: "customer" },
          {name: 'Card expiring', description: 'Sent to customers when their credit card is about to expire. Emails will be sent out', status: true, slug: "customer" },
          {name: 'Refund', description: 'Sent to customers when charge is refunded', status: true, slug: "customer",setting_id: 1 },
          {name: 'Get account access', description: 'Sent to customers when they enter their email to access their subscriptions', status: true, slug: "customer" },
          {name: 'Payment Re-authentication', description: 'Sent to your customers when their payment source needs to be re-authenticated.', status: true, slug: "customer" },

          {name: 'Cancellation Alert', description: 'Sent to storeowner when customer cancels an item', status: true, slug: "store_owner" },
          {name: 'Error Charge Processed', description: 'Sent to storeowner when a recurring payment is processed', status: true, slug: "store_owner" },
          {name: 'Variant not found', description: 'Sent to storeowner when variant not found error occurs in an order', status: true, slug: "store_owner"},
          {name: 'Customer Action Log', description: 'Sent to storeowner, daily log of customer’s actions', status: true, slug: "store_owner" },
          {name: 'Order Cancellation', description: 'Sent to store owner when the order is cancelled', status: false, slug: "store_owner" },
          {name: 'Pause Subscription', description: 'Sent to store owner when subscription is paused', status: false, slug: "store_owner" },
          {name: 'Resume Subscription', description: 'Sent to store owner when subscription is resumed', status: false, slug: "store_owner" },
          {name: 'Account Activation URL', description: 'Send the account activation link to the customer', status: true, slug: "customer" },
        ]
        email_notifications.push({name: 'Store Charge Confirmation', description: 'Sent to storeowner to confirm their recurring charges', status: true, slug: "store_owner" }) if ENV['APP_TYPE'] == 'public'
        @setting.email_notifications.create(email_notifications)
      end
      if @setting.reasons_cancels.blank?
        reason_cancels = [
          {title: 'This is too expensive', return_content: 'Returns cancel option and comment field'},
          {title: 'This was created by accident', return_content: 'Returns cancel option and comment field'},
          {title: 'I already have more than I need', return_content: 'Returns cancel and skip or pause options'},
          {title: 'I need it sooner', return_content: 'Returns cancel option and comment field'},
          {title: 'I no longer use this product', return_content: 'Returns cancel option and comment field'},
          {title: 'I want a different product or variety', return_content: 'Returns cancel and swap link'},
          {title: 'Other Reason', return_content: 'Returns cancel option and comment field'},
        ]
        @setting.reasons_cancels.create(reason_cancels)
      end

      @setting
    end
  end
end
