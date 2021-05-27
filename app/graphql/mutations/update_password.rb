module Mutations
  class UpdatePassword < Mutations::BaseMutation
    argument :params, Types::Input::PasswordInputType, required: true
    field :password, Types::PasswordType, null: false

    def resolve(params:)
      lock_password_params = Hash params
      begin
        lock_password = current_shop.lock_password
        lock_password.update!(lock_password.except(:id))
        { lock_password: lock_password }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
