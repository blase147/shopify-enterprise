class ExportService < GraphqlService
PAGE = 10

  LIST_PRODUCT_QUERY = <<-GRAPHQL
   {
      products(first: #{PAGE}, reverse: true) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            id
            title
            sellingPlanGroupCount
            giftCardTemplateSuffix
            handle
            description
            createdAt
            updatedAt
            hasOnlyDefaultVariant
            hasOutOfStockVariants
            isGiftCard
            productType
            requiresSellingPlan
            vendor
            tracksInventory
            totalInventory
            totalVariants
          }
        }
      }
    }
  GRAPHQL

  LIST_CUSTOMER_QUERY = <<-GRAPHQL
   {
      subscriptionContracts(first: #{PAGE}, reverse: true) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            id
            customer {
              firstName
              lastName
              email
              phone
              createdAt
              updatedAt
              acceptsMarketing
              ordersCount
              state
              totalSpent
              note
              verifiedEmail
              multipassIdentifier
              taxExempt
              acceptsMarketingUpdatedAt
            }
          }
        }
      }
    }
  GRAPHQL

  
  def product_run cursor=nil
    query = LIST_PRODUCT_QUERY
    query = query.gsub("first: #{PAGE}", "first: #{PAGE} after: \"#{cursor}\"") if cursor.present?
    result = client.query(client.parse(query))

    puts '###'
    p result

    data = result.data.products
    products = data.edges.map do |edge|
      edge
    end
    return {
      products: result.data.products.edges,
      has_next_page: data.page_info.has_next_page,
      has_previous_page: data.page_info.has_previous_page,
      next_cursor: products.last.cursor,
      prev_cursort: products.first.cursor
    }

  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def all_products(range)
    ReportLog.create(report_type: ReportLog.report_types["product"], start_date: range.first, end_date: range.last)
    has_next_page = true
    next_cursor = nil
    products = []
    while has_next_page
      data = product_run(next_cursor)
      products.push(data[:products] || [])
      has_next_page = data[:has_next_page]
      next_cursor = data[:next_cursor]
    end
    { products: products.flatten.collect{|c|c.node}.select{|s| s if s.selling_plan_group_count > 0 && range.cover?(s.created_at.to_date)} }
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def customer_run cursor=nil
    query = LIST_CUSTOMER_QUERY
    query = query.gsub("first: #{PAGE}", "first: #{PAGE} after: \"#{cursor}\"") if cursor.present?
    result = client.query(client.parse(query))

    puts '###'
    p result

    data = result.data.subscription_contracts
    subscriptions = data.edges.map do |edge|
      edge
    end

    return {
      subscriptions: subscriptions,
      has_next_page: data.page_info.has_next_page,
      has_previous_page: data.page_info.has_previous_page,
      next_cursor: subscriptions.last.cursor,
      prev_cursort: subscriptions.first.cursor
    }

  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def all_customers(range)
    ReportLog.create(report_type: ReportLog.report_types["customer"], start_date: range.first, end_date: range.last)
    has_next_page = true
    next_cursor = nil
    subscriptions = []
    while has_next_page
      data = customer_run(next_cursor)
      subscriptions.push(data[:subscriptions] || [])
      has_next_page = data[:has_next_page]
      next_cursor = data[:next_cursor]
    end
    { customers: subscriptions.flatten.collect{|s| s.node.customer}.select{|s| s if range.cover?(s.created_at.to_date)} }
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

end




