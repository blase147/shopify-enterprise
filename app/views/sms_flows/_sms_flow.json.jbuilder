json.extract! sms_flow, :id, :name, :sent, :clicks, :revenue, :status, :description, :shop_id, :created_at, :updated_at
json.url sms_flow_url(sms_flow, format: :json)
