import React from 'react';
import {Button, Layout,Autocomplete,TextField,Icon, DisplayText, Tag, Card, Select, RadioButton, Stack} from '@shopify/polaris';
import {SearchMinor,TickMinor} from '@shopify/polaris-icons';
import './discount.css';

const DiscountForm = ({handleCloseForm}) => {

    const options = [
        {label: 'Fixed Amount', value: 'fixed'}
      ];
      const applyoptions = [
        {label: 'All Products', value: 'fixed'}
      ];
    return (
        <Layout sectioned>
        <div className="wrapper">
          <div className="bread-bar">
            <a>Discount</a> 
            <span>{">"}</span>
            <a>Create Discount</a>
          </div>
          <div className="promo">
            <DisplayText size="small">Create Discount Code</DisplayText>
            <p>Add a discount code for customers to apply at checkout.</p>
            <div className="discount-group">
            <DisplayText size="small">Create Discount Code</DisplayText>
            <TextField placeholder="eg. Discount-2021" />
            </div>
          </div>
          <div class="sec-1">
            <Card title="Type of Discount" sectioned>
              <div className="discount-type-group">
              <Select
                 options={options}
                // onChange={handleSelectChange}
                // value={selected}
                />
                <TextField />
              </div>
              <DisplayText size="small">Minimum Requirements</DisplayText>
              <div className="min-radio-group">
                <RadioButton name="min" label="None"/>
                <RadioButton name="min" label="Minimum purchase amount"/>
              </div>
            </Card>
          </div>
          <div class="sec-2">
            <Card title="Applies to" sectioned>
              <div className="type-group">
              <Select
                 options={applyoptions}
                // onChange={handleSelectChange}
                // value={selected}
                />
              </div>
              <DisplayText size="small">Type of product</DisplayText>
              <div className="min-radio-group">
                <RadioButton 
                name="type" 
                label="All product types"
                helpText="The discount code will apply to subscription and one time products"
                />
                <RadioButton 
                name="type" 
                label="One-time products"
                helpText="The discount code will only apply to non-subscription products"
                />
                <RadioButton 
                name="type" 
                label="Subscription products"
                helpText="The discount code will only apply to subscription products"
                />
              </div>
            </Card>
          </div>
          <div class="sec-3">
            <Card title="Channel Controls" sectioned>
              <p>
              Channels are the interaction points at which either you or the customer can apply a discount. You can control which channels will accept the discount here.
              </p>
              <div className="switch-wrapper">
                <div className="switch-group">
                  <p>
                  Checkout page
                  </p>
                  <div className="switch-section">
                    <label class="switch">
                      <input className="switch-input" type="checkbox" checked />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </div>
                <div className="switch-group">
                  <p>
                  Customer portal
                  </p>
                  <div className="switch-section">
                    <label class="switch">
                      <input className="switch-input" type="checkbox" checked />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </div>
                <div className="switch-group">
                  <p>
                  Merchant portal
                  </p>
                  <div className="switch-section">
                    <label class="switch">
                      <input className="switch-input" type="checkbox" checked />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </div>
                <div className="switch-group">
                  <p>
                  API
                  </p>
                  <div className="switch-section">
                    <label class="switch">
                      <input className="switch-input" type="checkbox" checked />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div class="sec-2">
            <Card title="Application limits" sectioned>
              <div className="limit-group-radio">
              <RadioButton 
                name="limit" 
                label="Limit number of times this discount can be applied in total"
                />
                <RadioButton 
                name="limit" 
                label="Limit to one subscription per customer"
                />
                <RadioButton 
                name="limit" 
                label="Limit to first-time subscribers only"
                />
              </div>
              <p><strong>How many times should the discount apply to the customer's subscription?</strong></p>
              <div className="min-radio-group">
                <RadioButton 
                name="charge" 
                label="One charge only"
                helpText="The discount code will apply to one charge per customer before expiring"
                />
                <RadioButton 
                name="charge" 
                label="Set amount of charges"
                helpText="The discount code will apply to a set amount of charges per customer before expiring"
                />
                <RadioButton 
                name="charge" 
                label="All charges"
                helpText="The discount code will continue to apply to all future customer charges"
                />
              </div>
            </Card>
          </div>
          <div class="sec-4">
            <Card title="Date Range" sectioned>
              <p>The date range is the window in which customers can apply the discount code for the first time. If the code is redeemed before its set expiration date, it will continue to apply for the duration set above.</p>
              <div className="bread-bar">
                <span></span>
                <p>Discounts will kick off at 12:00 AM EST/EDT on the specified start date and will expire after 11:59 PM EST/EDT if an expiration date is specified.</p>
              </div>
              <TextField label="Start date" placeholder="2021-04-21" />
              <RadioButton label="Set an expiration date for new customers"/>
              <div className="btn-group">
              <Button >Cancel</Button>
              <Button primary>save Changes</Button>
            </div>
            </Card>
          </div>
          <div class="sec-5">
            <Card title="Discount Code Review" sectioned>
              <div className="limit-group-radio">
              <div class="check-group">
                <Icon source={TickMinor} color="base" />
                <p>Applies to all product types</p>
              </div>
              <div class="check-group">
                <Icon source={TickMinor} color="base" />
                <p>Applies to all product types</p>
              </div>
              <div class="check-group">
                <Icon source={TickMinor} color="base" />
                <p>Applies to all product types</p>
              </div>
              </div>
              <h3><strong>Need Help?</strong></h3>
              <p>You can read more about setting up discount codes in our knowledge base otherwise you can reach out to our support team directly here.</p>
            </Card>
          </div>
        </div>
      </Layout>
    )
}

export default DiscountForm
