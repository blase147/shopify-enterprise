class ExtensionController < AuthenticatedController
  class UnauthorizedRequest < RuntimeError; end

  protect_from_forgery with: :null_session, prepend: true
  before_action :validate_request, only: [:execute_extension], prepend: true

  ENCODING_ALGORITHM = "HS256"

  def execute
    body = (params[:body] || {}).merge({shop_id: current_shop.id})
    type = params[:type]

    result = SellingPlanService.new.run(type, body)
    render json: result
  end

  private

  def validate_request
    JWT.decode(jwt_token_from_request, ENV['SHOPIFY_API_SECRET'], true, algorithm: ENCODING_ALGORITHM)
  rescue JWT::DecodeError => ex
    p ex.message
  end

  def jwt_token_from_request
    token = (/Bearer (?<token>.+)/.match(request.headers.fetch("authorization", "")) || {})[:token]
    raise UnauthorizedRequest unless token.present?
    token
  end
end
