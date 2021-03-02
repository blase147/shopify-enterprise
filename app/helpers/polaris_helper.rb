module PolarisHelper
  def p_text_field options={}
    render('polaris/text_field', options: options)
  end

  def p_text_area options={}
    render('polaris/text_area', options: options)
  end

  def p_button options
    render('polaris/button', options: options)
  end

  def p_header text
    render('polaris/header', text: text)
  end

  def p_banner text
    render('polaris/banner', text: text)
  end

  def p_select options
    render('polaris/select', options: options)
  end

  def p_icon name
    render("polaris/icons/#{name}")
  end
end