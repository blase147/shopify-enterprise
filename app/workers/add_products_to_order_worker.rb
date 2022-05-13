class AddProductsToOrderWorker
  include Sidekiq::Worker

  def perform(shopify_order_id, contract_id)
    if shopify_order_id.present? && contract_id.present?
      Rails.application.load_tasks
      Rake::Task["pre_orders:fill_pre_order_and_add_items_to_shopify_order"].invoke(shopify_order_id, contract_id)
    else
      puts "shopify_order_id or contract_id not present"
    end
  rescue => e
    params = {shopify_order_id: shopify_order_id, contract_id: contract_id}
    message = "#{e.message} from #{e.backtrace.first}"
    SiteLog.create(log_type: SiteLog::TYPES[:sidekiq_job_failure], message: message, params: params)
    raise e
  end
end
