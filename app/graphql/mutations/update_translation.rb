module Mutations
  class UpdateTranslation < Mutations::BaseMutation
    argument :params, Types::Input::TranslationInputType, required: true
    field :translation, Types::TranslationType, null: false

    def resolve(params:)
      translation_params = Hash params
      begin
        translation = current_shop.translation
        translation.update!(translation_params.except(:id))
        { translation: translation }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
