class ZipCodesController < AuthenticatedController
  skip_before_action :verify_authenticity_token

  def index
    render json: current_shop.zip_codes
  end

  def create
    response = HTTParty.get(url, basic_auth: auth)
    if response['status']
      zip_code = ZipCode.new(params.permit(:city, :state))
      zip_code.codes = response['data']
      zip_code.shop = current_shop
      zip_code.save
      begin
        ShopifyAPI::Metafield.create({ key: 'zip_codes', value: current_shop.zip_codes.pluck(:codes).flatten.join(','), namespace: 'chargezen', value_type: 'string' })
        render json: { status: response['status'], zip_code: zip_code }
      rescue => e
        render json: { status: false, error: e }
      end
    else
      render json: { status: response['status'], error: (response['message'] || response['error']) }
    end
  end

  def destroy
    begin
      ZipCode.where(id: params[:ids]).destroy_all
      ShopifyAPI::Metafield.create({ key: 'zip_codes', value: current_shop.zip_codes.pluck(:codes).flatten.join(','), namespace: 'chargezen', value_type: 'string' })

      render json: { status: true }
    rescue => e
      render json: { status: false, error: e}
    end
  end

  private

  def url
    "https://service.zipapi.us/zipcode/zips?X-API-KEY=#{ENV['ZIP_US_API_KEY']}&city=#{params[:city]}&state=#{params[:state]}"
  end

  def auth
    { username: ENV['ZIP_US_USERNAME'], password: ENV['ZIP_US_PASSWORD'] }
  end
end
