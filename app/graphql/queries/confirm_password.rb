module Queries
  class ConfirmPassword < Queries::BaseQuery
    argument :password, String, required: true
    type Types::PasswordType, null: false

    def resolve(password:)
      if current_shop.lock_password.authenticate(password)
        { success: true }
      else
        GraphQL::ExecutionError.new('Invalid password.')
      end
    end
  end
end
