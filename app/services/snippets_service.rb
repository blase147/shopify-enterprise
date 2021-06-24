class SnippetsService
  SHOPIFY_PATH = 'app/shopify'

  def initialize theme_id
    @theme_id = theme_id
  end

  def install
    Dir.glob(Rails.root.join(SHOPIFY_PATH, snippet_version, 'snippets', "*")) do |file_path|
      file_name = File.basename(file_path)

      ShopifyAPI::Asset.create(
        theme_id: @theme_id,
        key: "snippets/#{file_name}",
        value: File.read(file_path)
      )
    end

    Dir.glob(Rails.root.join(SHOPIFY_PATH, snippet_version, 'assets', "*")) do |file_path|
      file_name = File.basename(file_path)

      ShopifyAPI::Asset.create(
        theme_id: @theme_id,
        key: "assets/#{file_name}",
        value: File.read(file_path)
      )
    end
  rescue Exception => ex
    { error: ex.message }
  end

  def add_to_theme
    asset = ShopifyAPI::Asset.find('layout/theme.liquid', params: { theme_id: @theme_id })
    snippet = Settings.snippets.main

    unless asset.value.match(/#{snippet}/)
      asset.value.sub!(/<\/head>/, "#{snippet}\n<\/head>")
      asset.save
    end
  rescue Exception => ex
    { error: ex.message }
  end

  def add_to_product
    asset = ShopifyAPI::Asset.find('sections/product-template.liquid', params: { theme_id: @theme_id })
    snippet = Settings.snippets.plan_selector

    unless asset.value.match(/#{snippet}/)
      asset.value.sub!(/<select name="id".*?>[\s\S]*<\/select>/, "\\&\n \t\t\t#{snippet}")
      asset.save
    end
  rescue Exception => ex
    { error: ex.message }
  end

  def add_to_featured_product
    asset = ShopifyAPI::Asset.find('sections/featured-product.liquid', params: { theme_id: @theme_id })
    snippet = Settings.snippets.plan_selector

    unless asset.value.match(/#{snippet}/)
      asset.value.sub!(/<select name="id".*?>[\s\S]*<\/select>/, "\\&\n \t\t\t#{snippet}")
      asset.save
    end
  rescue Exception => ex
    { error: ex.message }
  end

  def add_to_cart
    asset = ShopifyAPI::Asset.find('sections/cart-template.liquid', params: { theme_id: @theme_id }) rescue nil
    asset ||= ShopifyAPI::Asset.find('templates/cart.liquid', params: { theme_id: @theme_id })

    snippet = Settings.snippets.subscriptions_cart_selling_plans

    unless asset.value.match(/#{snippet}/)
      asset.value.sub!(/\{%- assign property_size .*? -%\}/, "#{snippet}\n\t\t\t\t\t\\&")
      asset.save
    end
  rescue Exception => ex
    { error: ex.message }
  end

  def add_to_account
    asset = ShopifyAPI::Asset.find('templates/customers/account.liquid', params: { theme_id: @theme_id })
    snippet = Settings.snippets.customer_portal_frame

    unless asset.value.match(/#{snippet}/)
      asset.value.sub!(/<div class="page-width".*?>[\s\S]*<\/div>/, "\\&\n #{snippet}")
      asset.save
    end

    unless asset.value.match(/#{snippet}/)
      asset.value.sub!("<!-- /templates/customers/account.liquid -->", "<!-- /templates/customers/account.liquid --> \\&\n #{snippet}")
      asset.save
    end
  rescue Exception => ex
    { error: ex.message }
  end

  private ##

  def snippet_version
    Settings.snippets.version.gsub('.', '')
  end
end
