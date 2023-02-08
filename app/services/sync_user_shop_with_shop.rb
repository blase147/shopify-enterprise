class SyncUserShopWithShop < GraphqlService

    def get_current_shop_details current_user_id=nil, shop_id
        shop = Shop.find(shop_id)
        shop.connect
        shop_data = ShopifyAPI::Shop.current
        shop_owner = check_user_exits(current_user_id, shop, shop_data)
    end

    def check_user_exits current_user_id=nil, shop, shop_data
        shop_owner = User.find_by_email(shop_data.customer_email) rescue nil
        current_user = User.find(current_user_id) rescue nil
        unless shop_owner.present?
            auth_token = SecureRandom.urlsafe_base64(nil, false)
            user_name = shop_data&.shop_owner&.split(" ")
            shop_owner = User.new(email: shop_data.customer_email, first_name: user_name.first, last_name: user_name.last,token_without_password: auth_token)
            shop_owner.save(validate: false)
            show_owner = User.find_by_email(shop_data.customer_email)
            set_password_link = "#{ENV["HOST"]}authenticateAdmin?id=#{shop_owner.id}&token=#{auth_token}"
            send_set_password_link(shop_owner, set_password_link, shop.id)
        end
        user_shop = UserShop.find_or_create_by( user_id: shop_owner.id, shop_id: shop.id, role: "admin")
        
    end

    def send_set_password_link(user, password_link, shop_id)
        email_body = email_template(user.first_name, password_link )
        customer_object = {subject: "Set Account Password", customer: user, email_body: email_body, shop_id: shop_id}
        success = SendEmailService.new.send_set_password_email(customer_object)
    end

    def email_template user_name, set_password_link
        "<table cellspacing='0' border='0' cellpadding='0' width='100%' bgcolor='#f2f3f8'
        style='@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;'>
        <tbody>
            <tr>
                <td>
                    <table style='background-color: #f2f3f8; max-width:670px;  margin:0 auto;' width='100%' border='0'
                        align='center' cellpadding='0' cellspacing='0'>
                        <tbody>
                            <tr>
                                <td style='height:80px;'>&nbsp;</td>
                            </tr>
                            <tr>



                                <td style='height:20px;'>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width='95%' border='0' align='center' cellpadding='0' cellspacing='0'
                                        style='max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);'>
                                        <tbody>
                                            <tr>
                                                <td style='height:40px;'>&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td style='padding:0 35px;'>
                                                    <h1 style='color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;'>
                                                        Hi #{user_name},<br>
                                                        Your are successfully registered in Chargezen</h1>
                                                    <span
                                                        style='display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;'></span>
                                                    <p style='color:#455056; font-size:15px;line-height:24px; margin:0;'>
                                                        Your account is successfuly registered on Chargezen. Please click on
                                                        the link below to set your account password.
                                                    </p>
                                                    <a href='#{set_password_link}'
                                                        style='background:black;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;'>Set
                                                        Password</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style='height:40px;'>&nbsp;</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style='height:20px;'>&nbsp;</td>
                            </tr>
                            <tr>
                                <td style='height:80px;'>&nbsp;</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>"
    end
end