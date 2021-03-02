class ScriptTagsService
  def initialize shop
    @shop = shop
    init_session
  end

  def add
    unless order_status_script_tag.present?
      ShopifyAPI::ScriptTag.create(
        event: 'onload', 
        display_scope: 'order_status', src: "#{ENV['HOST']}/script_tags/subscriptions.js?shop_domain=#{shop_domain}"
      )
    end
  rescue Exception => ex
    { ex: ex.message }
  end

  def remove
    order_status_script_tag.destroy
  rescue Exception => ex
    { ex: ex.message }
  end

  private ##

  def order_status_script_tag
    ShopifyAPI::ScriptTag.find(:first, params: {display_scope: 'order_status'})
  end

  def shop_domain
    @shop.shopify_domain
  end

  def init_session
    @shop.connect
  end
end