module Types
    class TimezoneType < Types::BaseObject
      field :all_timezones, [Types::AllTimezonesType], null: true
      field :current_timezone, String, null: true
    end
end