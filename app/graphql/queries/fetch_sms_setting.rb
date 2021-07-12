module Queries
  class FetchSmsSetting < Queries::BaseQuery
    type Types::SmsSettingType, null: false

    def resolve
      SmsSetting.find_or_create_by(shop_id: current_shop.id)
    end
  end
end
