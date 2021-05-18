# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# For development
shop = Shop.find_by(shopify_domain: ENV['SHOP'])

shop.smarty_messages.delete_all
shop.smarty_cancellation_reasons.delete_all
shop.smarty_variables.delete_all
# Billing Update
shop.smarty_messages.create(title: 'Modify Order - Billing Info', body: "Your current preferred payment method is:\n{{card_brand - card_last4}}\nExpiration {{card_exp_month/card_exp_year}}\nTo update your payment info, please check the email we just sent to your email address on file.")

# Delay Order
shop.smarty_messages.create(title: 'Delay Order - Invalid Option', body: "Oops, it seems you entered an incorrect answer, please choose a valid option:\n1. 1w (Delay 1 week)\n2. 2w (Delay 2 weeks)\n3. 3w (Delay 3 weeks)")

shop.smarty_messages.create(title: 'Delay Order - Failure', body: "We were unable to delay your upcoming order of {{subscription_title}} scheduled for
{{subscription_charge_date}} . Please try again or contact support at {{shop_email}}")

shop.smarty_messages.create(title: 'Delay Order - Options', body: "Please choose from the following options to delay your upcoming order:\n1. 1w (Delay 1 week)\n2. 2w (Delay 2 weeks)\n3. 3w (Delay 3 weeks)")

shop.smarty_messages.create(title: 'Delay Order - Success', body: "Awesome!, you've pushed back this order by {{delay_weeks}} week(s). It will process on
{{subscription_charge_date}}")

shop.smarty_messages.create(title: 'Delay Order - Confirm', body: "Your next delivery date would be around the {{subscription_charge_date}}, Reply with 'yes' if you want to delay?")

#Skip Order

shop.smarty_messages.create(title: 'Skip Order - Cancel', body: "Alright, we're still on schedule for your order planned for {{subscription_charge_date}}.")
shop.smarty_messages.create(title: 'Skip Order - Confirm', body: "Hey {{first_name}}! confirm you want to skip your order for {{subscription_title}} scheduled for {{subscription_charge_date}}? If so, please reply 'Y' to confirm or 'N' to ignore.")
shop.smarty_messages.create(title: 'Skip Order - Invalid Option', body: "Oops, it seems you entered an incorrect answer, please choose a valid option. Reply 'Y' to confirm or 'N' to ignore.")
shop.smarty_messages.create(title: 'Skip Order - Failure', body: "We were unable to skip your upcoming order scheduled for {{subscription_charge_date}}. Please try again later or contact support at {{shop_email}}")
shop.smarty_messages.create(title: 'Skip Order - Success', body: "Awesome! You’ve skipped the order originally planned for {{old_charge_date}}, so your next order will now process on {{subscription_charge_date}}.")

# Edit Quantity
shop.smarty_messages.create(title: 'Edit quantity - Cancel', body: "Alright, the quantity of your order for {{line_item_name}} remains {{line_item_qty}} pc(s)")
shop.smarty_messages.create(title: 'Edit quantity - Confirm', body: "Hey {{first_name}}! confirm you want to change the quantity of your order for {{line_item_name}}? If so, please reply 'Y' to confirm or 'N' to ignore.")
shop.smarty_messages.create(title: 'Edit quantity - Conditional', body: "Your order for {{subscription_title}} has the following line items:\n{{line_item_list}}\nPlease respond with the ID of the line item whose quantity you want to change.")
shop.smarty_messages.create(title: 'Edit quantity - conditional_response', body: "Got it! Please reply with the new quantity for {{line_item_name}}")
shop.smarty_messages.create(title: 'Edit quantity - conditional_response_failure', body: "Oops, it seems you entered an incorrect answer, please choose a valid option")
shop.smarty_messages.create(title: 'Edit quantity - Success', body: "Awesome! We’ve changed the quantity of {{line_item_name}}. It will be reflected in your next delivery.")
shop.smarty_messages.create(title: 'Edit quantity - failure', body: "Oops, we’re unable to change the quantity of your order. Please try again or contact support at {{shop_email}}.")
shop.smarty_messages.create(title: 'Edit quantity- Invalid Option', body: "Oops, it seems you entered an incorrect answer, please choose a valid option. Reply 'Y' to confirm or 'N' to ignore.")

# Cancelation
shop.smarty_messages.create(title: 'End Subscription - confirmation', body: "Confirm you want to cancel your subscription to order {{subscription_title}}? If so, please reply 'Y' to confirm or 'N' to ignore")
shop.smarty_messages.create(title: 'End Subscription - Cancel', body: "OK, ignored.If you need anything else, let us know. You can reply with 'HEY' or email us at {{shop_email}}")
shop.smarty_messages.create(title: 'End Subscription - Cancellation Reason', body: "Ok {{first_name}} - before we end your subscription, which of the following best describes why you'd like to cancel? \n{{cancellation_reasons}}")
shop.smarty_messages.create(title: 'End Subscription - invalid option', body: "Oops, it seems you entered an incorrect answer, please choose a valid option. Reply 'Y' to confirm or 'N' to ignore")
shop.smarty_messages.create(title: 'End Subscription - Winback Swap', body: "Do you want to swap a product for your current subscription (SWAP) or continue with the cancellation of your subscription (CONTINUE) ?")
shop.smarty_messages.create(title: 'End Subscription - Winback Skip', body: "Do you want to skip a product for your current subscription (SKIP) or continue with the cancellation of your subscription (CONTINUE) ?")
shop.smarty_messages.create(title: 'End Subscription - Success', body: "Sad to see you go! Text 'Restart' to resubscribe at any time and we'd love you to share more detailed feedback at shop_email. Cheers! <3 {{shop_name}}")
shop.smarty_messages.create(title: 'End Subscription - Failure', body: "Hey {{first_name}}!, it looks like your subscription for {{subscription_title}} is already cancelled! For more information, go to: {{manage_subscriptions_url}} or contact us at {{shop_email}}")
shop.smarty_messages.create(title: 'End Subscription - Contact', body: "Someone from our support team will be in touch with you soon & they'll assist you with your request.")

#Opt In
shop.smarty_messages.create(title: 'Opt-in', body: "Hey {{first_name}}! Welcome to the {{shop_name}} SMS service! You can manage your subscription via sms without having to log into the customer portal or contacting support.. Just reply 'HEY' to this number at any time.  To opt-out of this service, reply with 'STOP'")
shop.smarty_messages.create(title: 'Opt-in - success', body: "Hey {{first_name}}! We are preparing to ship your order of {{subscription_title}}. To manage your future orders via SMS, save this number and reply with 'HEY' at any time.")

# Charge Faillure
shop.smarty_messages.create(title: 'Charge - Failure', body: "Hey {{first_name}}!, we are unable to charge your order, someone from our support team will be in touch with you soon.")

shop.smarty_messages.create(title: 'Charge - Reminder', body: "Hey {{first_name}}! We are preparing to ship your order of {{subscription_title}}. To manage your future orders via SMS, save this number and reply with 'HEY' at any time")

#Cancellation Reasons
shop.smarty_cancellation_reasons.create(name: 'I want a different product or variety', winback: :swap)
shop.smarty_cancellation_reasons.create(name: 'I already have more than I need', winback: :skip)
shop.smarty_cancellation_reasons.create(name: 'I need it sooner')
shop.smarty_cancellation_reasons.create(name: 'I no longer use this product')
shop.smarty_cancellation_reasons.create(name: 'This is too expensive')
shop.smarty_cancellation_reasons.create(name: 'Other reason')
shop.smarty_cancellation_reasons.create(name: 'This was created by accident')


#Billing Update
shop.smarty_variables.create(name: 'card_brand - card_last4')
shop.smarty_variables.create(name: 'card_exp_month/card_exp_year')
#Delay Order
shop.smarty_variables.create(name: 'subscription_title')
shop.smarty_variables.create(name: 'subscription_charge_date')
shop.smarty_variables.create(name: 'delay_weeks')
shop.smarty_variables.create(name: 'delay_weeks')
shop.smarty_variables.create(name: 'shop_email')
# Skip
shop.smarty_variables.create(name: 'first_name')
shop.smarty_variables.create(name: 'old_charge_date')

#Edit Quantity
shop.smarty_variables.create(name: 'line_item_qty')
shop.smarty_variables.create(name: 'line_item_list')
shop.smarty_variables.create(name: 'line_item_name')

#Cancellation Reason
shop.smarty_variables.create(name: 'manage_subscriptions_url')
shop.smarty_variables.create(name: 'cancellation_reasons')
shop.smarty_variables.create(name: 'shop_name')
