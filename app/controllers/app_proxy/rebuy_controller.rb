class AppProxy::RebuyController < AppProxyController
  before_action :init_session
  
  def init_session
    @skip_auth =  true
  end

  def index
    render content_type: 'application/liquid', layout: "rebuy_liquid_app_proxy"
  end

  def rebuy_items
  end


  def upsells
  end 

end