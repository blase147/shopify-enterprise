# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# For development
shop = Shop.find_by(shopify_domain: 'aroma360-staging.myshopify.com')

shop.smarty_messages.find_or_create_by(title: 'Delay Order - Invalid Option')
shop.smarty_messages.find_or_create_by(title: 'Delay Order - Failure')
shop.smarty_messages.find_or_create_by(title: 'Delay Order - Options')
shop.smarty_messages.find_or_create_by(title: 'Delay Order - Success')

shop.smarty_messages.find_or_create_by(title: 'Skip Order - Cancel')
shop.smarty_messages.find_or_create_by(title: 'Skip Order - Confirm')
shop.smarty_messages.find_or_create_by(title: 'Skip Order - invalid option')

shop.smarty_variables.find_or_create_by(name: 'shop_name', response: 'Aroma360')
shop.smarty_variables.find_or_create_by(name: 'first_name', response: 'Aroma')

shop.custom_keywords.find_or_create_by(response: "You're welcome! Remember to reply with 'Modify Order' if you need to modify your subscription(s)", keywords: ['thx', 'thanks', 'ty'])
shop.smarty_cancellation_reasons.find_or_create_by(name: 'I already have more than I need', winback: :skip)
shop.smarty_cancellation_reasons.find_or_create_by(name: 'I need it sooner', winback: :not_defined)
