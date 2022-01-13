module Mutations
  class UpdatePassword < Mutations::BaseMutation
    argument :params, Types::Input::PasswordInputType, required: true
    field :password, Types::PasswordType, null: false

    def resolve(params:)
      lock_password_params = Hash params

      current_shop.setting.update(enable_password: lock_password_params[:enable_password])
      begin
        lock_password = current_shop.lock_password
        if lock_password_params[:password] != lock_password_params[:password_confirmation]
          GraphQL::ExecutionError.new('Password and password confirmation did not matched.')
        else
          lock_password.update!(password: lock_password_params[:password])
          { password: { success: true } }
        end
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
