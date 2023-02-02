module Queries
  class FetchReport < Queries::BaseQuery
    type Types::ExportReportType, null: false
    argument :report_type, String, required: true
    argument :start_date, String, required: true
    argument :end_date, String, required: true

    def resolve(report_type:, start_date:, end_date:)
      arr_data = []
      range = start_date.to_date..end_date.to_date
      case report_type.downcase
      when "product"
        result = ExportService.new.all_products(range)
        result[:products].each do |product|
          arr_data <<  {
            title: product.title,
            handle: product.handle,
            selling_plan_group_count: product.selling_plan_group_count,
            description: product.description,
            created_at: product.created_at,
            updated_at: product.updated_at,
            gift_card_template_suffix: product.gift_card_template_suffix,
            has_only_default_variant: product.has_only_default_variant,
            has_out_of_stock_variants: product.has_out_of_stock_variants,
            is_gift_card: product.is_gift_card,
            product_type: product.product_type,
            requires_selling_plan: product.requires_selling_plan,
            vendor: product.vendor,
            tracks_inventory: product.tracks_inventory,
            total_inventory: product.total_inventory,
            total_variants: product.total_variants
          }
        end
        { products: arr_data }
      when "customer"
        result = ExportService.new.all_customers(range)
        result[:customers].each do |customer|
          arr_data <<  {
            first_name: customer.first_name,
            last_name: customer.last_name,
            email: customer.email,
            phone: customer.phone,
            created_at: customer.created_at,
            updated_at: customer.updated_at,
            accepts_marketing: customer.accepts_marketing,
            orders_count: customer.orders_count,
            state: customer.state,
            total_spent: customer.total_spent,
            note: customer.note,
            verified_email: customer.verified_email,
            multipass_identifier: customer.multipass_identifier,
            tax_exempt: customer.tax_exempt,
            accepts_marketing_updated_at: customer.accepts_marketing_updated_at
          }
        end
        { customers: arr_data }
      when "analytic"
        ReportLog.create(report_type: ReportLog.report_types["analytic"], start_date: range.first, end_date: range.last)
        report_logs = ReportLog.where(created_at: range)
        {report_logs: report_logs}
      else
      end
    end
    
  end
end
