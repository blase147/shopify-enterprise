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
              <strong className="checkout-text">Customer Portal Translation</strong>
              <p>Expand All</p>
            </div>

            <div className="collapse-section">
              <button className="collapsible-translatoin">Sidebar Navigation </button>
              <div className="content-forms">
                <div className="content-collapse">
                  <TextField label="Subscription" placeholder ="Subscription" />
                  <TextField label="Active" placeholder ="Active" />
                  <TextField label="Canceled " placeholder ="Canceled " />
                  <TextField label="Delivery Schedule" placeholder ="Delivery Schedule" />
                  <TextField label="Order History" placeholder ="Order History" />
                  <TextField label="Addresses" placeholder ="Addresses" />
                  <TextField label="Billing " placeholder ="Billing " />
                  <TextField label="Account" placeholder ="Account" />
                </div>
              </div>
              {/*Account Setting */}
              <button className="collapsible-translatoin">Subscription Home Tab</button>
              <div className="content-forms">
                <div className="content-collapse">
                {/* <p>Login to an Existing Account </p> */}
                  <TextField label="My Active Subscriptions" placeholder ="My Active Subscriptions" />
                  <TextField label="No Active Subscription Message " placeholder ="No Subscription have been found for your Account" />
                  <TextField label="Quantity" placeholder ="Quantity" />
                  <TextField label="Edit Button" placeholder ="Edit Button" />
                  <TextField label="Delay Next Order Button" placeholder ="Delay Next Order Button" />
                  <TextField label="Delivery Schedule Button" placeholder ="Delivery Schedule Button" />
                  <TextField label="Edit Subscription Button" placeholder ="Edit Subscription Button" />
                  <TextField label="Delivery Address " placeholder ="Delivery Address " />
                  <TextField label="Edit Button" placeholder ="Edit Button" />
                  <TextField label="Recommended For You" placeholder ="Recommended For You" />
                  <TextField label="Add Subscription" placeholder ="Add Subscription" />
                  <TextField label="Apply Discount to your Next Order" placeholder ="Apply Discount to your Next Order" />
                  <TextField label="Start Date" placeholder ="Start Date" />
                  <TextField label="Est. Next Delivery" placeholder ="Est. Next Delivery" />
                  <TextField label="Last Card Charge " placeholder ="Last Card Charge " />
                  <TextField label="Est. Next Delivery" placeholder ="Est. Next Delivery" />
                  <p>Subscriber + Upsell</p>
                  <TextField label="Hey there! There’s an offer for you!" placeholder ="Hey there! There’s an offer for you!" />
                  <TextField label="10:00 left to claim this offer" placeholder ="10:00 left to claim this offer" />
                  <TextField label="Product Variants" placeholder ="Product Variants" />
                  <TextField label="Pay Now" placeholder ="Pay Now" />
                  <TextField label="No Thanks" placeholder ="No Thanks" />
                  <TextField label="Search for Products" placeholder ="Search for Products" />
                  <TextField label="Search" placeholder ="Search" />
                  <TextField label="Clear" placeholder ="Clear" />
                  
                  <p>Delay Next Order Popup</p>
                  <TextField label="Choose Dates" placeholder ="Choose Dates" />
                  <TextField label="Delay 2 Weeks" placeholder ="Delay 2 Weeks" />
                  <TextField label="Delay 1 Month" placeholder ="Delay 1 Month" />
                  <TextField label="Delay 2 Months" placeholder ="Delay 2 Months" />
                  <TextField label="Delay 3 Months" placeholder ="Delay 3 Months" />
                  <TextField label="Back" placeholder ="Back" />
                  <TextField label="Apply" placeholder ="Apply" />
                  <p>Delay Next Shipment Popup</p>
                  <TextField label="Delay your Next Shipment" placeholder ="Delay your Next Shipment" />
                  <TextField label="Back" placeholder ="Back" />
                  <TextField label="Apply" placeholder ="Apply" />
                  <p>Delivery Schedule popup</p>
                  <TextField label="My Next Order" placeholder ="My Next Order" />
                  <TextField label="Order Product" placeholder ="Order Product" />
                  <TextField label="Order Address" placeholder ="Order Address" />
                  <TextField label="My Scheduled Orders" placeholder ="My Scheduled Orders" />
                  <div className="trnaslation-grid">
                    <TextField label="Skip" placeholder ="Skip" />
                    <TextField label="Back" placeholder ="Back" />
                  </div>
                  <TextField label="Apply" placeholder ="Apply" />
                  <p>Edit Subscription Popup</p>
                  <TextField label="Est. Next Delivery" placeholder ="Est. Next Delivery" />
                  <TextField label="Next Card Charge" placeholder ="Next Card Charge" />
                  <TextField label="Upgrade Subscription" placeholder ="Upgrade Subscription" />
                  <TextField label="Swap Subscription" placeholder ="Swap Subscription" />
                  <TextField label="Ask a Question" placeholder ="Ask a Question" />
                  <TextField label="Cancel Subscription" placeholder ="Cancel Subscription" />
                  <p>Swap Subscription Popup</p>
                  <TextField label="Swap {Product} Subscription to:" placeholder ="Swap {Product} Subscription to:" />
                  <TextField label="Swap Subscription Buton" placeholder ="Swap Subscription Buton" />
                  <p>Upgrade Subscription Popup</p>
                  <TextField label="Upgrade {Product} Subscription to:" placeholder ="Upgrade {Product} Subscription to:" />
                  <TextField label="Upgrade Subscription Buton" placeholder ="Upgrade Subscription Buton" />
                </div>
              </div>

   
              <button className="collapsible-translatoin">Cancelled Subscriptions Tab </button>
              <div className="content-forms">
                <div className="content-collapse">
                  <TextField label="My Canceled Subscriptions" placeholder ="My Canceled Subscriptions" />
                  <TextField label="Reactivate Button " placeholder ="Reactivate" />
                  <TextField label="Start Date" placeholder ="Start Date" />
                  <TextField label="Quantity " placeholder ="Quantity " />
                    <p>My Canceled Subscriptions with Loyalty Programs</p>
                  <TextField label="Cancel {product} Subscription" placeholder ="Cancel {product} Subscription" />
                  <TextField label="Get Reward" placeholder ="Get Reward" />
                  <TextField label="Cancel Anyway" placeholder ="Cancel Anyway" />
                  <TextField label="Keep Points" placeholder ="Keep Points" />
                    <p>My Canceled Subscriptions without Loyalty Programs</p>
                  <TextField label="Cancel Anyway " placeholder ="Cancel Anyway " />
                  <TextField label="Keep Subscription" placeholder ="Keep Subscription" />
                    <p>Cancel Subscriptions with Reasons</p>
                  <TextField label="Cancel {product} Subscription" placeholder ="Cancel {product} Subscription" />
                  <TextField label="Keep Subscription" placeholder ="Keep Subscription" />
                  <TextField label="Cancel" placeholder ="Cancel" />
                </div>
              </div>
              <button className="collapsible-translatoin">Delivery Schedule tab</button>
              <div className="content-forms">
                <div className="content-collapse">
                  <TextField label="My Next Order" placeholder ="My Next Order" />
                  <TextField label="My Scheduled Order" placeholder ="My Scheduled Order" />
                  <TextField label="No Subscription have been found for your Account" placeholder ="No Subscription have been found for your Account" />
                  <TextField label="Est. Delivery " placeholder ="Est. Delivery " />
                  <TextField label="Order Product" placeholder ="Order Product" />
                  <TextField label="Order Address" placeholder ="Order Address" />
                  <TextField label="Skip" placeholder ="Skip" />
                </div>
              </div>
              <button className="collapsible-translatoin">Order History Tab</button>
              <div className="content-forms">
                <div className="content-collapse">
                  <TextField label="My Order History" placeholder ="My Order History" />
                  <TextField label="No Subscription have been found for your Account" placeholder ="No Subscription have been found for your Account" />
                  <TextField label="Order #" placeholder ="Order #" />
                  <TextField label="Date " placeholder ="Date " />
                  <TextField label="Amount" placeholder ="Amount" />
                  <TextField label="View" placeholder ="View" />
                  <TextField label="Invoice" placeholder ="Invoice" />
                </div>
              </div>
              <button className="collapsible-translatoin">Addresses Tab</button>
              <div className="content-forms">
                <div className="content-collapse">
                  <TextField label="My Address" placeholder ="My Address" />
                  <TextField label="No Subscription have been found for your Account" placeholder ="No Subscription have been found for your Account" />
                  <TextField label="Edit " placeholder ="Edit" />
                  <TextField label="Phone " placeholder ="Date " />
                  <TextField label="Company" placeholder ="Company" />
                  <TextField label="Address" placeholder ="Address" />
                  <TextField label="Add Address" placeholder ="Add Address" />
                    <p>Add Address Pop Up</p>
                    <TextField label="First Name " placeholder ="First Name" />
                    <TextField label="Last Name " placeholder ="Last Name " />
                    <TextField label="Address 1" placeholder ="Address 1" />
                    <TextField label="Address 2" placeholder ="Address 2" />
                    <div className='trnaslation-grid'>
                      <TextField label="Company" placeholder ="Company" />
                      <TextField label="City" placeholder ="City" />
                      <TextField label="Country " placeholder ="Country" />
                      <TextField label="Zip/Postal Code " placeholder ="Zip/Postal Code " />
                      <TextField label="State/Province" placeholder ="State/Province" />
                      <TextField label="Phone" placeholder ="Phone" />
                    </div>
                    <TextField label="Update" placeholder ="Update" />
                </div>
              </div>
              <button className="collapsible-translatoin">Billing Tab</button>
              <div className="content-forms">
                <div className="content-collapse">
                  <TextField label="My Billing Information" placeholder ="My Billing Information" />
                  <TextField label="No Subscription have been found for your Account" placeholder ="No Subscription have been found for your Account" />
                  <TextField label="Card on File" placeholder ="Card on File" />
                  <TextField label="Update" placeholder ="Update" />
                  <TextField label="Edit" placeholder ="Edit" />
                  <TextField label="Phone" placeholder ="Phone" />
                  <TextField label="Company" placeholder ="Company" />
                  <TextField label="Address" placeholder ="Address" />
                    <p>Update Payment Pop Up</p>
                    <TextField label="Name on Card" placeholder ="Name on Card" />
                    <TextField label="Card Number" placeholder ="Card Number" />
                    <TextField label="Exp. Month" placeholder ="Exp. Month" />
                    <TextField label="Exp. Date" placeholder ="Exp. Date" />
                    <TextField label="CVV" placeholder ="CVV" />
                    <TextField label="Update Card" placeholder ="Update Card" />
                </div>
              </div>
              <button className="collapsible-translatoin">Account Tab</button>
              <div className="content-forms">
                <div className="content-collapse">
                  <TextField label="My Account Details" placeholder ="My Account Details" />
                  <TextField label="No Subscription have been found for your Account" placeholder ="No Subscription have been found for your Account" />
                  <TextField label="First Name" placeholder ="First Name" />
                  <TextField label="Last Name" placeholder ="Last Name" />
                  <TextField label="Email" placeholder ="Email" />
                  <TextField label="Save Button" placeholder ="Save" />
                    <p>Update Payment Pop Up</p>
                    <TextField label="Name on Card" placeholder ="Name on Card" />
                    <TextField label="Card Number" placeholder ="Card Number" />
                    <TextField label="Exp. Month" placeholder ="Exp. Month" />
                    <TextField label="Exp. Date" placeholder ="Exp. Date" />
                    <TextField label="CVV" placeholder ="CVV" />
                    <TextField label="Update Card" placeholder ="Update Card" />
                </div>
              </div>
              {/*Account Setting */}

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
