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
        <Layout>
        <div className="wrapper">
          <div className="bread-bar">
            <a>Discount</a>
            <span>{">"}</span>
            <a>Create Discount</a>
          </div>
          <div className="promo">
            <DisplayText size="small">Create Discount Code</DisplayText>
            <p>Add a discount code for customers to apply at checkout.</p>
            <div className="discount-group ">
                <DisplayText size="small">Discount Code</DisplayText>
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
              <p className="berad-text">The date range is the window in which customers can apply the discount code for the first time. If the code is redeemed before its set expiration date, it will continue to apply for the duration set above.</p>
              <div className="bread-bar bottom-bread">
                <span></span>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="14" fill="white"/>
                <path d="M13.9996 4C8.47746 4 4 8.47746 4 13.9996C4 19.5217 8.47746 24 13.9996 24C19.5217 24 24 19.5217 24 13.9996C24 8.47746 19.5217 4 13.9996 4ZM16.0813 19.498C15.5666 19.7012 15.1568 19.8552 14.8495 19.9619C14.5431 20.0686 14.1867 20.1219 13.7812 20.1219C13.1581 20.1219 12.673 19.9695 12.3276 19.6656C11.9822 19.3617 11.8104 18.9765 11.8104 18.5084C11.8104 18.3263 11.8231 18.1401 11.8485 17.9505C11.8747 17.7608 11.9162 17.5475 11.9729 17.3079L12.6171 15.0324C12.6739 14.814 12.723 14.6066 12.7619 14.4135C12.8008 14.2188 12.8195 14.0402 12.8195 13.8777C12.8195 13.5881 12.7594 13.385 12.64 13.2707C12.5189 13.1564 12.2912 13.1005 11.9517 13.1005C11.7858 13.1005 11.6148 13.1251 11.4396 13.1767C11.266 13.2301 11.1153 13.2783 10.9917 13.3257L11.1619 12.6248C11.5835 12.4529 11.9873 12.3056 12.3725 12.1837C12.7577 12.0601 13.1217 11.9992 13.4646 11.9992C14.0834 11.9992 14.5608 12.1498 14.8969 12.4478C15.2313 12.7467 15.3998 13.1352 15.3998 13.6127C15.3998 13.7117 15.3879 13.8861 15.3651 14.135C15.3422 14.3848 15.299 14.6125 15.2364 14.8216L14.5956 17.0904C14.5431 17.2724 14.4965 17.4806 14.4542 17.7134C14.4127 17.9462 14.3924 18.124 14.3924 18.2434C14.3924 18.5448 14.4593 18.7505 14.5947 18.8597C14.7285 18.9689 14.963 19.0239 15.2948 19.0239C15.4514 19.0239 15.6267 18.996 15.8248 18.9418C16.0212 18.8876 16.1634 18.8394 16.2531 18.7979L16.0813 19.498ZM15.9678 10.2891C15.669 10.5668 15.3092 10.7056 14.8885 10.7056C14.4686 10.7056 14.1062 10.5668 13.8049 10.2891C13.5052 10.0114 13.3537 9.67365 13.3537 9.27915C13.3537 8.8855 13.506 8.54688 13.8049 8.26667C14.1062 7.98561 14.4686 7.84593 14.8885 7.84593C15.3092 7.84593 15.6698 7.98561 15.9678 8.26667C16.2667 8.54688 16.4165 8.8855 16.4165 9.27915C16.4165 9.6745 16.2667 10.0114 15.9678 10.2891Z" fill="#000000"/>
                </svg>

                <p>Discounts will kick off at 12:00 AM EST/EDT on the specified start date and will expire after 11:59 PM EST/EDT if an expiration date is specified.</p>
              </div>
              <TextField label="Start date" placeholder="2021-04-21" />
              <RadioButton label="Set an expiration date for new customers"/>
              <div className="btn-group translation-btn">
              {/* <Button >Cancel</Button>
              <Button primary>save Changes</Button> */}
                <Button onClick={handleCloseForm} primary>Cancel</Button>
                <div className="save-btn">
                <Button onClick={handleCloseForm} >Save Changes </Button>
                </div>
            </div>
            </Card>
          </div>
          <div class="sec-5">
            <Card title="Discount Code Review" sectioned>
              <div className="limit-group-radio">
              <div class="check-group">
              <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.7455 0.95515L17.7454 0.95525L6.58813 11.7054L3.2546 8.4938L3.25451 8.49372C2.6243 7.88685 1.61063 7.88685 0.980419 8.49372L0.980194 8.49394C0.339935 9.11125 0.339935 10.1194 0.980194 10.7367L0.980307 10.7368L5.45099 15.0445C5.76827 15.3503 6.1804 15.5 6.58815 15.5C6.9959 15.5 7.40803 15.3503 7.72531 15.0445L20.0197 3.19822L20.0198 3.19812C20.6601 2.5808 20.6601 1.57268 20.0198 0.955367L20.0196 0.95515C19.3894 0.348283 18.3757 0.348283 17.7455 0.95515Z" fill="#22B268" stroke="#22B268"/>
              </svg>

                <p>Applies to all product types</p>
              </div>
              <div class="check-group">
              <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.7455 0.95515L17.7454 0.95525L6.58813 11.7054L3.2546 8.4938L3.25451 8.49372C2.6243 7.88685 1.61063 7.88685 0.980419 8.49372L0.980194 8.49394C0.339935 9.11125 0.339935 10.1194 0.980194 10.7367L0.980307 10.7368L5.45099 15.0445C5.76827 15.3503 6.1804 15.5 6.58815 15.5C6.9959 15.5 7.40803 15.3503 7.72531 15.0445L20.0197 3.19822L20.0198 3.19812C20.6601 2.5808 20.6601 1.57268 20.0198 0.955367L20.0196 0.95515C19.3894 0.348283 18.3757 0.348283 17.7455 0.95515Z" fill="#22B268" stroke="#22B268"/>
              </svg>
                <p>Applies to all product types</p>
              </div>
              <div class="check-group">
              <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.7455 0.95515L17.7454 0.95525L6.58813 11.7054L3.2546 8.4938L3.25451 8.49372C2.6243 7.88685 1.61063 7.88685 0.980419 8.49372L0.980194 8.49394C0.339935 9.11125 0.339935 10.1194 0.980194 10.7367L0.980307 10.7368L5.45099 15.0445C5.76827 15.3503 6.1804 15.5 6.58815 15.5C6.9959 15.5 7.40803 15.3503 7.72531 15.0445L20.0197 3.19822L20.0198 3.19812C20.6601 2.5808 20.6601 1.57268 20.0198 0.955367L20.0196 0.95515C19.3894 0.348283 18.3757 0.348283 17.7455 0.95515Z" fill="#22B268" stroke="#22B268"/>
              </svg>
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
