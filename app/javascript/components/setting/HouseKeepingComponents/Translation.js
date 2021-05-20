import React, { useEffect } from 'react'
import './translation.css'
import {
  Card,
  Layout,
  TextField,
  SkeletonDisplayText,
  Stack,
  Button
} from '@shopify/polaris';
const Translation = () => {

  useEffect(() => {
    var coll = document.getElementsByClassName("collapsible-translatoin");
    var i;
    
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active-collpase");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        } 
      });
    }
  }, [])
    return (
        <>
        <Layout>
          <div className='translation-page'>
            <p className='customer-see'>Update the text that your customers see.</p>
            <div class="expend-all">
              <strong className="checkout-text">Checkout</strong>
              <p>Expand All</p>
            </div>

            <div className="collapse-section">
              <button className="collapsible-translatoin">Checkout Buttons/Page Controls</button>
              <div className="content-forms">
                <div className="content-collapse">
                  <p>Buttons </p>
                  <TextField label="Continue Button Label" placeholder ="Continue Button Label" />
                  <TextField label="Complete Purchase Button Label" placeholder ="Place my Order" />
                  <p>Links </p>
                  <TextField label="Continue Button Label" placeholder ="Continue Button Label" />
                  <TextField label="Complete Purchase Button Label" placeholder ="Place my Order" />
                  <p>Footer text </p>
                  <TextField label="Copyright Text" placeholder ="All Right Reserved" />
                </div>
              </div>
              {/*Account Setting */}
              <button className="collapsible-translatoin">Account Section</button>
              <div className="content-forms">
                <div className="content-collapse">
                <p>Login to an Existing Account </p>
                  <TextField label="Login" placeholder ="Login" />
                  <TextField label="Logout" placeholder ="Logout" />
                  <TextField label="Login to an Account Title" placeholder ="Login to an Account Title" />
                  <TextField label="Password" placeholder ="Password" />
                  <TextField label="Skip" placeholder ="Skip" />
                  <TextField label="Forgot Password?" placeholder ="Forgot Password?" />
                  <TextField label="Want to Create a New Account?" placeholder ="Want to Create a New Account?" />
                  <p>Create an Account</p>
                  <TextField label="Or" placeholder ="Or" />
                  <TextField label="Create an Account" placeholder ="Create an Account" />
                  <TextField label="Create" placeholder ="Create" />
                  <TextField label="Have an Account?" placeholder ="Have an Account?" />
                  <TextField label="Last step set up the password for your account" placeholder ="Last step set up the password for your account" />
                  <TextField label="Re-enter Password" placeholder ="Re-enter Password" />
                  <TextField label="Your Account needs additional setup. We’ll show you how to do so after you’ve completed this purchase" placeholder ="Your Account needs additional setup. We’ll show you how to do so after you’ve completed this purchase" />
                  <TextField label="Register Account" placeholder ="Register Account" />
                  <TextField label="To be able to manage subscriptions make sure to register your account for" placeholder ="To be able to manage subscriptions make sure to register your account for" />
                  <p>Validation Messages</p>
                  <TextField label="Login Required" placeholder ="Login Required" />
                  <TextField label="Email already associated with an existing account" placeholder ="Email already associated with an existing account" />
                  <TextField label="Email is not associated with an account" placeholder ="Email is not associated with an account" />
                  <TextField label="Email or password is not correct" placeholder ="Email or password is not correct" />
                </div>
              </div>
              {/*Account Setting */}

              <button className="collapsible-translatoin">Customer Personal and Shipping Information</button>
              <div className="content-forms">
                <div className="content-collapse">
                  <p>Customer Personal Information</p>
                  <TextField label="Customer Information Title" placeholder ="Customer & shipping information" />
                  <TextField label="Email Label" placeholder ="Email " />
                  <TextField label="Email Placeholder" placeholder ="Email " />
                  <p>Customer Shipping Address</p>
                  <TextField label="First Name Label" placeholder ="First Name " />
                  <TextField label="First Name Placeholder" placeholder ="First Name " />
                  <TextField label="Last Name Label" placeholder ="Last Name " />
                  <TextField label="Last Name Placeholder" placeholder ="Last Name " />
                  <TextField label="Company Label" placeholder ="Company Label" />
                  <TextField label="Company Placeholder" placeholder ="Company (optional)" />
                  <TextField label="Address 1 Label" placeholder ="Address " />
                  <TextField label="Address 1 Placeholder" placeholder ="Address " />
                  <TextField label="Address 2 Label" placeholder ="Apt, suite, etc." />
                  <TextField label="Address 2 Placeholder" placeholder ="Apt, suite, etc." />
                  <TextField label="City Label" placeholder ="City " />
                  <TextField label="City Placeholder" placeholder ="City " />
                  <TextField label="Country Label" placeholder ="Country Label" />
                  <TextField label="Province Label" placeholder ="State" />
                  <TextField label="Province Placeholder" placeholder ="State" />
                  <TextField label="Zip Code Label" placeholder ="Zip Code " />
                  <TextField label="Zip Code Placeholder" placeholder ="Zip Code " />
                  <TextField label="Phone Label" placeholder ="Phone " />
                  <TextField label="Phone Placeholder" placeholder ="Phone " />
                  <TextField label="Country Calling Code Label" placeholder ="Country Calling Code" />
                  <TextField label="Country Calling Code Placeholder" placeholder ="Please select a Country Calling Code" />
                  <p>Validation Messages</p>
                  <TextField label="Email Validation/error" placeholder ="Please enter a valid email address" />
                  <TextField label="Required Field Error" placeholder ="This field is required" />
                </div>
              </div>
            </div>

            {/*Account Setting */}

            <button className="collapsible-translatoin">Shipping Section Labels</button>
              <div className="content-forms">
                <div className="content-collapse">
                  <TextField label="Shipping Address Title" placeholder ="Shipping Address Title " />
                  <TextField label="Checkout Shipping Title" placeholder ="Shipping " />
                  <TextField label="Free Rate Label" placeholder ="FREE " />
                  <TextField label="Shipments Methods not Available" placeholder ="There are no shipping methods available for your cart or destination" />
                </div>
              </div>

              <button className="collapsible-translatoin">Payment Section</button>
              <div className="content-forms">
                <div className="content-collapse">
                    <TextField label="Checkout Payment Title" placeholder ="Billing and Payment" />
                    <TextField label="Credit Card Title" placeholder ="Credit Card " />
                    <TextField label="Card Number Label" placeholder ="Card Number " />
                    <TextField label="Card Number Placeholder" placeholder ="Card Number " />
                    <TextField label="Name on card label" placeholder ="Name on card " />
                    <TextField label="Name on Card Placeholder" placeholder ="Name on Card " />
                    <TextField label="Card Expiration Label" placeholder ="Expiration " />
                    <TextField label="Card Verification Label" placeholder ="CVV " />
                    <TextField label="Card Verification Placeholder" placeholder ="CVV" />
                    <TextField label="Card Verification Value Explanation" placeholder ="3 or 4 digit security code usually located on the back of the card. " />
                    <TextField label="Billing Address Title" placeholder ="Billing Address" />
                    <TextField label="Different Billing Address Label" placeholder ="Use a different billing address " />
                    <TextField label="Card Security Notice Pop Up" placeholder ="All transactions are secure and encrypted." />
                    <p>PayPal</p>
                    <TextField label="Credit Card or PayPal Title" placeholder ="Credit Card or PayPal" />
                    <TextField label="Click here" placeholder ="Click here" />
                    <p>Validation Messages</p>
                    <TextField label="This is not a Credit Card Number" placeholder ="This is not a Credit Card Number" />
                    <TextField label="Credit Card is expired" placeholder ="Credit Card is expired" />
                    <TextField label="Your Card Number is Incorrect" placeholder ="Your Card Number is Incorrect." />
                    <TextField label="Could not find Payment Information" placeholder ="Could not find Payment Information" />
                    <p>Payment Options (Apple Pay Only)</p>
                    <TextField label="Payment Options" placeholder ="How will you be paying today?" />
                </div>
            </div>

            <button className="collapsible-translatoin">Newsletter Opt-in</button>
              <div className="content-forms">
                <div className="content-collapse">
                    <TextField label="Subscription Checkbox Label" placeholder ="Subscribe to our Newsletter" />
                </div>
                </div>

                <button className="collapsible-translatoin">Order Summary</button>
            <div className="content-forms">
                <div className="content-collapse">
                    <TextField label="Order Summary Title" placeholder ="Order Summary" />
                    <TextField label="Subtotal Label" placeholder ="Subtotal" />
                    <TextField label="Shipping Label" placeholder ="Shipping" />
                    <TextField label="Taxes Label" placeholder ="Taxes" />
                    <TextField label="Total Label" placeholder ="Total" />
                    <TextField label="Payment Due Label" placeholder ="Payment Due" />
                    <TextField label="Paid Label" placeholder ="Paid" />
                    <p>Frequency Labels</p>
                    <TextField label="Every" placeholder ="Every" />
                    <TextField label="Days" placeholder ="Days" />
                    <TextField label="Week" placeholder ="Week" />
                    <TextField label="Weeks" placeholder ="Weeks" />
                    <TextField label="Month" placeholder ="Month" />
                    <TextField label="Months" placeholder ="Months" />
                    <TextField label="Year" placeholder ="Year" />
                    <TextField label="Expires after" placeholder ="Expires after" />
                    <TextField label="Charge" placeholder ="Charge" />
                    <TextField label="Charges" placeholder ="Charges" />
                    <TextField label="Orders" placeholder ="Orders" />
                    <p>Post-purchase Summary Page</p>
                    <TextField label="Address Title" placeholder ="Address " />
                </div>
            </div>   
            <div className="translation-btn">


              <Layout.Section>
                <Stack>
                  <Stack.Item>
                    <Button primary>Cancel</Button>
                  </Stack.Item>
                  <div className="save-btn">
                  <Stack.Item>
                    <Button >Save Changes </Button>
                  </Stack.Item>
                  </div>
                </Stack>
              </Layout.Section>
            </div>
          </div>
        </Layout>
        </>
    )
}

export default Translation
