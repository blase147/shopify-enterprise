class ZipCodesController < AuthenticatedController

  def index
    response = HTTParty.get(url, basic_auth: auth)
    if response['status']
      ShopifyAPI::Metafield.create({ key: 'zip_codes', value: response['data'].join(','), namespace: 'chargezen', value_type: 'string' })

      render json: { status: response['status'], zip_codes: response['data'] }
    else
      render json: { status: response['status'], error: (response['message'] || response['error']) }
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
