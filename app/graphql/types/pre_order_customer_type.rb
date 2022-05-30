  module Types
  class PreOrderCustomerType < Types::BaseObject
    field :name, String, null: true
    field :subscription, String, null: true
  end

  def name
    "#{object.first_name} #{object.last_name}"
  end
end