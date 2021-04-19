// import RoundCheckbox from 'rn-round-checkbox';
import {
  Button, Card,
  ChoiceList,
  FormLayout,
  Heading, Layout, Select,
  Stack, TextField,
  TextStyle
} from '@shopify/polaris';
import React, { useCallback, useState } from 'react';
import Trash from '../../../assets/images/settings/trash.svg';
import ActiveSubscription from './preview/subscription/ActiveSubscription';


const CustomPortal = (props) => {
  // const [checkedProTheme, setCheckedProTheme] = useState(false);
  // const handleChangeProTheme = useCallback(
  //   (newChecked) => setCheckedProTheme(newChecked),
  //   []
  // );
  // const [selectedTheme, setSelectedTheme] = useState(); //['lotus']
  //
  // const handleChangeTheme = useCallback((value) => setSelectedTheme(value), []);

  const [preview, setPreview] = useState(false)
  const [canPreview, setCanPreview] = useState(false)

  const handleChange = (label, e) => {
    setFieldValue(label, e)
    setCanPreview(true)
    console.log(e.target.value);

  }
  const applyStyles = (s) => {
    document.head.appendChild(document.createElement("style")).innerHTML = s;
  }
  const handleApplyStyles = () => {
    const styles = `${values?.styleSubscription || ''} ${values?.styleUpsell || ''} ${values?.styleSidebarPages || ''} ${values?.styleSidebar || ''} ${values?.styleAccountProfile || ''}`;
    applyStyles(styles)
  }
  const [valueAccountProfile_CSS, setValueAccountProfile_CSS] = useState();
  const handleChangeAccountProfile_CSS = useCallback(
    (newValue) => setValueAccountProfile_CSS(newValue),
    []
  );

  const [valueSidebar_CSS, setValueSidebar_CSS] = useState();
  const handleChangeSidebar_CSS = useCallback(
    (newValue) => setValueSidebar_CSS(newValue),
    []
  );

  const [valueSubscription_CSS, setValueSubscription_CSS] = useState();
  const handleChangeSubscription_CSS = useCallback(
    (newValue) => setValueSubscription_CSS(newValue),
    []
  );

  const [valueUpsell_CSS, setValueUpsell_CSS] = useState();
  const handleChangeUpsel_CSS = useCallback(
    (newValue) => setValueUpsell_CSS(newValue),
    []
  );

  const [valueSidebarPages_CSS, setValueSidebarPages_CSS] = useState();
  const handleChangeSidebarPages_CSS = useCallback(
    (newValue) => setValueSidebarPages_CSS(newValue),
    []
  );

  const [selectedDelivery, setSelectedDelivery] = useState(
    'Admin and Customer'
  );
  const handleSelectChangeDelivery = useCallback(
    (value) => setSelectedDelivery(value),
    []
  );
  const options = [
    { label: 'Admin and Customer', value: 'adminAndCustomer' },
    { label: 'Customer', value: 'customer' },
  ];
  const oneTimePurchaseOptions = [
    { label: 'Disabled for everyone', value: 'DisabledForEveryone' }
  ];

  const AllChargeZenProductsOptions = [
    { label: 'All ChargeZen Products', value: 'AllChargeZenProducts' }
  ];
  const Show = [
    { label: 'Show', value: 'Show' }
  ];
  const [selectedFrequency, setSelectedFrequency] = useState(['hidden']);
  const handleChangeFrequency = useCallback(
    (value) => setSelectedFrequency(value),
    []
  );
  const [selectedDiscount, setSelectedDiscount] = useState(['hidden']);
  const handleChangeDiscount = useCallback(
    (value) => setSelectedDiscount(value),
    []
  );

  const [delive, setDelive] = useState({
    deliverySchdule: 'Admin and Customer',
    edit: 'tomorrow',
  });

  const handleSetState = (value, name) => {
    setDelive({ ...delive, [name]: value });
  };

  const [valueEmailContact, setValueEmailContact] = useState();
  const handleChangeEmailContact = useCallback(
    (newValue) => setValueEmailContact(newValue),
    []
  );

  const [valueCancelAfter, setValueCancelAfter] = useState();
  const handleChangeCancelAfter = useCallback(
    (newValue) => setValueCancelAfter(newValue),
    []
  );
  const [reasonsForCancellationList, setReasonsForCancellationList] = useState([
    {
      name: 'This is too expensive',
      description: 'Returns cancel option and comment field',
    },
    {
      name: 'This was created by accident',
      description: 'Returns cancel option and comment field',
    },
    {
      name: 'I already have more than I need',
      description: 'Returns cancel and skip or pause options',
    },
    {
      name: 'I need it sooner',
      description: 'Returns cancel option and comment field',
    },
    {
      name: 'I no longer use this product',
      description: 'Returns cancel option and comment field',
    },
    {
      name: 'I want a different product or variety',
      description: 'Returns cancel and swap link',
    },
    {
      name: 'Other Reason',
      description: 'Returns cancel option and comment field',
    },
  ]);
  const showHideValues = [
    { label: "Show", value: 'true' },
    { label: "Hide", value: 'false' }
  ]
  const {
    values,
    touched,
    errors,
    setFieldValue,
    handleSubmit,
    isSubmitting,
  } = props;

  const handleRemoveReasons = useCallback((values, i) => {
    let reasonCancels = [...(values.reasonsCancels || [])];
    reasonCancels[i]._destroy = true;
    return reasonCancels;
  });
  // const [selectedSave, setSelectedSave] = useState(false);

  return (
    <Layout>
      <Card.Section>
        <Stack vertical>
          <Stack.Item>
            <div className="form-head">
              <p className="control-text">
                Control actions available to your customers after purchase
              </p>
              <div className="purchase-preview">
                {
                  !preview &&
                  <button className={!canPreview ? "preview disabled" : "preview"} disabled={!canPreview} onClick={() => { setPreview(true); handleApplyStyles(); }} >PREVIEW</button>
                }
                {
                  preview &&
                  <button className="preview" onClick={() => setPreview(false)} >CLOSE PREVIEW</button>
                }
                <button className="preview">PUBLISH</button>
              </div>
            </div>

            {preview &&
              <ActiveSubscription Values={values} />
            }

          </Stack.Item>
          {/* <Stack.Item>
            <Stack alignment="center">
              <Stack.Item>
                <div className="protheme">
                  <Checkbox
                    label="PRO Theme Engine"
                    onChange={handleChangeProTheme}
                    checked="indeterminate"
                  />
                  <Badge status="success">PRO</Badge>
                </div>
              </Stack.Item>
              <Stack.Item>
                <span>Themes</span>
              </Stack.Item>
              <Stack.Item>
                <div className="choise-themes">
                  <ChoiceList
                    choices={[
                      { label: 'Lotus ', value: 'lotus' },
                      { label: 'Enso', value: 'enso' },
                    ]}
                    selected={values.themes ? values.themes : 'lotus'}
                    onChange={(e) => {
                      setFieldValue('themes', e[0]);
                      console.log('dfdfdfd: ', e[0]);
                    }}
                  />
                </div>
              </Stack.Item>
            </Stack>
          </Stack.Item> */}
          {
            !preview &&
            <>
              <Stack.Item>
                <h5 className="customize-text">Customize Styles</h5>
              </Stack.Item>
              <Stack.Item>
                <div className="portal-section">
                  <div className="custom-portal">
                    <FormLayout>
                      <div className="account-profile-head">
                        <div className="account-sec">
                          <p className="applied-classes">Account Profile, Contact box & promo/contact button & portal background</p>
                          <TextField
                            label={
                              <TextStyle variation="subdued"> CSS classes available for customization: <span className="custom-classes"> .info-banner, .profile, .initials,
                          .full-name, .contact, .btn-discount, .chargezen-proxy</span>   </TextStyle>
                            }
                            placeholder=".lorem {font-size: 34px;}"
                            multiline={10}
                            value={values.styleAccountProfile ? values.styleAccountProfile : ''}
                            error={touched.styleAccountProfile && errors.styleAccountProfile}
                            onChange={(e) => handleChange('styleAccountProfile', e)}
                          />
                        </div>
                        <div className="promo-section" style={{ marginTop: '52px' }}>
                          <p>Promo button</p>
                          <div className="promo-discount">
                            <Select
                              options={showHideValues}

                              value={values.showPromoButton}
                              error={
                                touched.showPromoButton && errors.showPromoButton
                              }
                              onChange={(e) => setFieldValue('showPromoButton', e)}
                            />
                            <TextField
                              placeholder="Get $5 OFF"
                              value={values.promoButtonContent}
                              onChange={(e) => setFieldValue('promoButtonContent', e)}
                              error={touched.promoButtonContent && errors.promoButtonContent}
                            />
                          </div>
                          <div className="link-searching">
                            <p>Link</p>
                            <TextField
                              placeholder="paste a link or search"
                              value={values.promoButtonUrl}
                              onChange={(e) => setFieldValue('promoButtonUrl', e)}
                              error={touched.promoButtonUrl && errors.promoButtonUrl}
                            />
                            <div className="cross-img" onClick={()=>setFieldValue('promoButtonUrl', '')} >
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.0707 2.92929C15.181 1.03956 12.6726 0 10 0C7.32744 0 4.81902 1.03956 2.92929 2.92929C1.03956 4.81902 0 7.32744 0 10C0 12.6726 1.03956 15.181 2.92929 17.0707C4.81902 18.9604 7.32744 20 10 20C12.6726 20 15.181 18.9604 17.0707 17.0707C18.9604 15.181 20 12.6726 20 10C20 7.32744 18.9604 4.81902 17.0707 2.92929ZM16.2668 16.2668C14.5918 17.9419 12.3653 18.8636 10 18.8636C7.63468 18.8636 5.40825 17.9419 3.73316 16.2668C0.277778 12.8114 0.277778 7.18855 3.73316 3.73316C5.40825 2.05808 7.63468 1.13636 10 1.13636C12.3653 1.13636 14.5918 2.05808 16.2668 3.73316C19.7222 7.18855 19.7222 12.8114 16.2668 16.2668Z" fill="#007EFF" />
                                <path d="M14.4066 5.59369C14.1835 5.37063 13.8258 5.37063 13.6027 5.59369L10 9.19638L6.39732 5.59369C6.17425 5.37063 5.81651 5.37063 5.59345 5.59369C5.37038 5.81675 5.37038 6.1745 5.59345 6.39756L9.19614 10.0003L5.59345 13.603C5.37038 13.826 5.37038 14.1838 5.59345 14.4068C5.70287 14.5163 5.85018 14.5752 5.99328 14.5752C6.13637 14.5752 6.28368 14.5205 6.39311 14.4068L9.9958 10.8041L13.5985 14.4068C13.7079 14.5163 13.8552 14.5752 13.9983 14.5752C14.1456 14.5752 14.2887 14.5205 14.3982 14.4068C14.6212 14.1838 14.6212 13.826 14.3982 13.603L10.8039 10.0003L14.4066 6.39756C14.6296 6.1745 14.6296 5.81675 14.4066 5.59369Z" fill="#007EFF" />
                              </svg>

                            </div>
                          </div>
                          <div className="contact-box" style={{ marginTop: '30px' }}>
                          <p>Contact Box</p>
                          <TextField
                            placeholder="No thanks"
                            value={values.contactBoxContent}
                            onChange={(e) => setFieldValue('contactBoxContent', e)}
                            error={touched.contactBoxContent && errors.contactBoxContent}
                          />
                        </div>
                        </div>
                        <div className="sec-sec">
                          <p className="applied-classes">Sidebar menu, promo tagline I, promo tagline II </p>
                          <TextField
                            label={
                              <TextStyle variation="subdued"> CSS classes available for customization: <span className="custom-classes"> .account-sidebar, .active-subscription .cancel-subscription</span> </TextStyle>
                            }
                            placeholder="Add Code Here..."
                            multiline={10}
                            value={values.styleSidebar ? values.styleSidebar : ''}
                            error={touched.styleSidebar && errors.styleSidebar}
                            onChange={(e) => handleChange('styleSidebar', e)}
                          />
                        </div>
                        <div className="promo-tag" style={{ marginTop: '87px' }}>
                            <p>Promo tagline I</p>
                            <TextField
                              placeholder="No thanks"
                              value={values.promoTagline1Content}
                              onChange={(e) => setFieldValue('promoTagline1Content', e)}
                              error={touched.promoTagline1Content && errors.promoTagline1Content}
                            />
                            <p>Promo tagline II</p>
                            <TextField
                              placeholder="No thanks"
                              value={values.promoTagline2Content}
                              onChange={(e) => setFieldValue('promoTagline2Content', e)}
                              error={touched.promoTagline2Content && errors.promoTagline2Content}
                            />
                          </div>

                      </div>
                      <p className="applied-classes">Active & canceled subscriptions box</p>
                      <TextField
                        label={
                          <TextStyle variation="subdued"> CSS classes available for customization: <span className="custom-classes"> .display-text, .account-img,  .active-text, edit-subscription, delivery-schedule , .action-btn,
                     , btn-wrapper, .minus-quantity, .plus-quantity, .chevron, .edit-address, .notification-banner, .cancel-text </span></TextStyle>
                        }
                        placeholder="Add Code Here..."
                        multiline={10}
                        value={values.styleSubscription ? values.styleSubscription : ''}
                        error={touched.styleSubscription && errors.styleSubscription}
                        onChange={(e) => handleChange('styleSubscription', e)}
                      />
                      <p className="applied-classes">Delivery schedule, order history, addresses, billings & account pages</p>

                      <TextField
                        label={
                          <TextStyle variation="subdued">  CSS classes available for customization: <span className="custom-classes"> .delivery-heading .delivery-text, .delivery-btn, .order-heading, .order-text-heading, .order-text, .btn-view, .btn-invoice, .subscription-text, .edit, .address-text, .address-heading, .main-heading, .card-heading, .payment-img, .card-text, .card-btn, .account-label, .account-input, update-btn </span></TextStyle>
                        }
                        placeholder="Add Code Here..."
                        multiline={10}
                        value={values.styleSidebarPages ? values.styleSidebarPages : ''}
                        error={touched.styleSidebarPages && errors.styleSidebarPages}
                        onChange={(e) => handleChange('styleSidebarPages', e)}
                      />
                      <p className="applied-classes">Upsells Carousel</p>
                      <TextField
                        label={
                          <TextStyle variation="subdued">
                            CSS classes available for customization: <span className="custom-classes"> .offerTitle, .account-carousel, .carousel-img, .carousel-text, .btn-variant</span>
                          </TextStyle>
                        }
                        placeholder="Add Code Here..."
                        multiline={10}
                        value={values.styleUpsell ? values.styleUpsell : ''}
                        error={touched.styleUpsell && errors.styleUpsell}
                        onChange={(e) => handleChange('styleUpsell', e)}
                      />
                    </FormLayout>
                  </div>

                </div>
              </Stack.Item>
            </>
          }
        </Stack>
      </Card.Section>
      <Card.Section>
        <Stack vertical>
          <div className="customer-portal">
            <h2 className="portal-heading">Customer Portal Controls</h2>
            <Stack.Item>
              <p className="navigation-text" variation="strong">Navigation</p>
              <FormLayout>
                <FormLayout.Group>
                  <p>Subscriptions</p>
                  <Select
                    options={showHideValues}
                    value={values.showSubscription}
                    error={
                      touched.showSubscription && errors.showSubscription
                    }
                    onChange={(e) => setFieldValue('showSubscription', e)}
                  />
                  <p>Delivery Schedule</p>
                  <Select
                    options={showHideValues}
                    value={values.showDeliverySchedule}
                    error={
                      touched.showDeliverySchedule && errors.showDeliverySchedule
                    }
                    onChange={(e) => setFieldValue('showDeliverySchedule', e)}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <p>Order History</p>
                  <Select
                    options={showHideValues}
                    value={values.showOrderHistory}
                    error={
                      touched.showOrderHistory && errors.showOrderHistory
                    }
                    onChange={(e) => setFieldValue('showOrderHistory', e)}
                  />
                  <p>Addresses</p>
                  <Select
                    options={showHideValues}
                    value={values.showAddress}
                    error={
                      touched.showAddress && errors.showAddress
                    }
                    onChange={(e) => setFieldValue('showAddress', e)}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <p>Billing</p>
                  <Select
                    options={showHideValues}
                    value={values.showBilling}
                    error={
                      touched.showBilling && errors.showBilling
                    }
                    onChange={(e) => setFieldValue('showBilling', e)}
                  />
                  <p>Account</p>
                  <Select
                    options={showHideValues}
                    value={values.showAccount}
                    error={
                      touched.showAccount && errors.showAccount
                    }
                    onChange={(e) => setFieldValue('showAccount', e)}
                  />
                </FormLayout.Group>
              </FormLayout>
            </Stack.Item>
            <Stack.Item>
              <Stack vertical>
                <p className="navigation-text" variation="strong">Subscription Management</p>

                <FormLayout>
                  <FormLayout.Group>
                    <p>Swap Subscription</p>
                    <Select
                      options={options}
                      value={values.swapProduct}
                      error={touched.swapProduct && errors.swapProduct}
                      onChange={(e) => setFieldValue('swapProduct', e)}
                    />
                    <p>&nbsp;</p>
                  </FormLayout.Group>
                  <FormLayout.Group>
                    <p>Edit Upcoming Quantity</p>
                    <Select
                      options={options}
                      value={values.upcomingQuantity}
                      error={touched.upcomingQuantity && errors.upcomingQuantity}
                      onChange={(e) => setFieldValue('upcomingQuantity', e)}
                    />
                    <p>&nbsp;</p>
                  </FormLayout.Group>
                  {/*<FormLayout.Group>
                      <p>Edit Upcoming Order Date</p>
                      <Select
                        options={options}
                        value={values.upcomingOderDate}
                        error={touched.upcomingOderDate && errors.upcomingOderDate}
                        onChange={(e) => setFieldValue('upcomingOderDate', e)}
                      />
                      <p>&nbsp;</p>
                    </FormLayout.Group>
                    <FormLayout.Group>
                    // <p>Add Products to Subscription</p>
                    <Select
                      options={options}
                      value={values.productToSubscription}
                      error={
                        touched.productToSubscription &&
                        errors.productToSubscription
                      }
                      onChange={(e) => setFieldValue('productToSubscription', e)}
                    />
                    <p>&nbsp;</p>
                  </FormLayout.Group>
                  <FormLayout.Group>
                    <p>Change Variants</p>
                    <Select
                      options={options}
                      value={values.changeVariant}
                      error={touched.changeVariant && errors.changeVariant}
                      onChange={(e) => setFieldValue('changeVariant', e)}
                    />
                    <p>&nbsp;</p>
                  </FormLayout.Group>*/}
                  <FormLayout.Group>
                    <p>Cancel Subscription</p>
                    <Select
                      options={options}
                      value={values.subscriptionCancellation}
                      error={
                        touched.subscriptionCancellation &&
                        errors.subscriptionCancellation
                      }
                      onChange={(e) =>
                        setFieldValue('subscriptionCancellation', e)
                      }
                    />
                    <p>&nbsp;</p>
                  </FormLayout.Group>
                  <FormLayout.Group>
                    <p>Delivery Schedule</p>
                    <Select
                      options={options}
                      value={values.navigationDelivery}
                      error={
                        touched.navigationDelivery && errors.navigationDelivery
                      }
                      onChange={(e) => setFieldValue('navigationDelivery', e)}
                    />
                    <p>&nbsp;</p>
                  </FormLayout.Group>
                  <FormLayout.Group>
                    <p>Pause Subscription</p>
                    <Select
                      options={options}
                      value={values.pauseSubscription}
                      error={
                        touched.pauseSubscription && errors.pauseSubscription
                      }
                      onChange={(e) => setFieldValue('pauseSubscription', e)}
                    />
                    <p>&nbsp;</p>
                  </FormLayout.Group>
                  <FormLayout.Group>
                    <p>Reactivate Subscription</p>
                    <Select
                      options={options}
                      value={values.reactiveSubscription}
                      error={
                        touched.reactiveSubscription && errors.reactiveSubscription
                      }
                      onChange={(e) => setFieldValue('reactiveSubscription', e)}
                    />
                    <p>&nbsp;</p>
                  </FormLayout.Group>
                  <FormLayout.Group>
                    <p>Edit Delivery Address</p>
                    <Select
                      options={options}
                      value={values.shipingAddress}
                      error={touched.shipingAddress && errors.shipingAddress}
                      onChange={(e) => setFieldValue('shipingAddress', e)}
                    />
                    <p>&nbsp;</p>
                  </FormLayout.Group>
                </FormLayout>
              </Stack>
            </Stack.Item>
            <Stack.Item>
              <Stack vertical>
                <p className="navigation-text" variation="strong">Shipment Frequency</p>
                <FormLayout>
                  <FormLayout.Group>
                    <p>Skip Shipment</p>
                    <Select
                      options={options}
                      value={values.shipment}
                      error={touched.shipment && errors.shipment}
                      onChange={(e) => setFieldValue('shipment', e)}
                    />
                    <p>&nbsp;</p>
                  </FormLayout.Group>
                  {/*<FormLayout.Group>
                    <p>Edit Frequency</p>
                    <Select
                      options={options}
                      value={values.frequency}
                      error={touched.frequency && errors.frequency}
                      onChange={(e) => setFieldValue('frequency', e)}
                    />
                    <p>&nbsp;</p>
                  </FormLayout.Group>*/}
                  <FormLayout.Group>
                    <p>Delay/Speedup order</p>
                    <Select
                      options={options}
                      value={values.delayOrder}
                      error={touched.delayOrder && errors.delayOrder}
                      onChange={(e) => setFieldValue('delayOrder', e)}
                    />
                    <p>&nbsp;</p>
                  </FormLayout.Group>
                </FormLayout>
              </Stack>
            </Stack.Item>
          </div>
        </Stack>
      </Card.Section>
      {/*<Card.Section>
        <Stack vertical>
          <div className="frequency-checkbox">
            <p variation="strong">
              Customer facing frequency options
            </p>

            <Stack.Item>
              <ChoiceList
                allowMultiple
                choices={[
                  {
                    label: 'Customer can choose any frequency',
                    value: 'can_choose_any_frequency',
                  },
                  {
                    label:
                      'Limit to frequency options preselected for the subscription ruleset',
                    value: 'limit',
                  },
                ]}
                selected={
                  values.facingFrequencyOption
                    ? values.facingFrequencyOption
                    : ['can_choose_any_frequency']
                }
                error={
                  touched.facingFrequencyOption && errors.facingFrequencyOption
                }
                onChange={(e) => setFieldValue('facingFrequencyOption', e)}
              />
            </Stack.Item>
          </div>
          <Stack.Item>
            <p className="future-delivery">
              Delivery schedule number of days in future shows 90 days (Max.
              180)
            </p>
          </Stack.Item>
          <Stack.Item style={{ marginTop: '0' }}>
            <Stack vertical>
              <p className="frequency-heading" variation="strong">
                {' '}
                Products available for purchase on the customer protal
              </p>
              <div className="">
                <FormLayout.Group>
                  <p>One-time purchases</p>
                  <Select
                    options={oneTimePurchaseOptions}
                    value={values.oneTimePurchase}
                    error={touched.oneTimePurchase && errors.oneTimePurchase}
                    onChange={(e) => setFieldValue('oneTimePurchase', e)}
                  />
                  <p>&nbsp;</p>
                </FormLayout.Group>

                <FormLayout.Group>
                  <p>Products available for purchase</p>
                  <Select
                    options={AllChargeZenProductsOptions}
                    value={values.availablePurchase}
                    error={touched.availablePurchase && errors.availablePurchase}
                    onChange={(e) => setFieldValue('availablePurchase', e)}
                  />
                  <p>&nbsp;</p>
                </FormLayout.Group>
              </div>
            </Stack>
          </Stack.Item>
          <Stack.Item>
            <Stack vertical>
              <p className="frequency-heading" variation="strong">Discounts</p>

              <ChoiceList
                allowMultiple
                choices={[
                  {
                    label:
                      'Allow customers to input discount code on customer portal',
                    value: 'allow',
                  },
                  {
                    label:
                      'Remove discounts from customer addresses after discount limit has been reached',
                    value: 'discount',
                  },
                ]}
                selected={values.discount ? values.discount : ['allow']}
                error={touched.discount && errors.discount}
                onChange={(e) => setFieldValue('discount', e)}
              />
            </Stack>
          </Stack.Item>
          <Stack.Item>
            <Stack vertical>
              <p className="frequency-heading" variation="strong">
                {' '}
                Subscription Cancellation
              </p>
              <FormLayout>
                <FormLayout.Group>
                  <p className="reactive-text">Cancel Subscription</p>
                  <Select
                    options={options}
                    value={values.subscriptionCancellation}
                    error={
                      touched.subscriptionCancellation &&
                      errors.subscriptionCancellation
                    }
                    onChange={(e) =>
                      setFieldValue('subscriptionCancellation', e)
                    }
                  />
                  <p>&nbsp;</p>
                </FormLayout.Group>
              </FormLayout>
            </Stack>
          </Stack.Item>
        </Stack>
      </Card.Section>
      <Card.Section>
        <Stack vertical>
          <Stack.Item>
            <div className="frequency-checkbox">
              <FormLayout>
                <Heading>Customer Cancellation Email Contact</Heading>
                <TextField
                  placeholder="hello@xyz.com"
                  value={values.cancellationEmailContact}
                  error={
                    touched.cancellationEmailContact &&
                    errors.cancellationEmailContact
                  }
                  onChange={(e) => setFieldValue('cancellationEmailContact', e)}
                />
                <Heading>Allow Customer to Cancel After</Heading>
                <FormLayout.Group>
                  <TextField
                    placeholder="No Restriction"
                    value={
                      values.allowCancelAfter
                        ? values.allowCancelAfter
                        : 'No Restriction'
                    }
                    error={touched.allowCancelAfter && errors.allowCancelAfter}
                    onChange={(e) => setFieldValue('allowCancelAfter', e)}
                  />
                  <span>Charge(s)</span>

                </FormLayout.Group>
              </FormLayout>
            </div>
          </Stack.Item>
          <Stack.Item>
            <div style={{ marginTop: '10px' }}>
              <FormLayout>
                <FormLayout.Group>
                  <p className="reactive-text">Reactivate Subscription</p>
                  <Select
                    options={options}
                    value={values.reactiveSubscription}
                    error={
                      touched.reactiveSubscription && errors.reactiveSubscription
                    }
                    onChange={(e) => setFieldValue('reactiveSubscription', e)}
                  />
                  <p>&nbsp;</p>
                </FormLayout.Group>
              </FormLayout>
            </div>
          </Stack.Item>
        </Stack>
      </Card.Section>*/}
      <Card.Section>
        <div className="cancelation-section">
          <Stack vertical>
            <Stack.Item>
              <Heading>Reasons for Cancellation</Heading>
            </Stack.Item>
            {/* {reasonsForCancellationList?.map((item, i) => ( */}
            {values.reasonsCancels?.map((item, i) => (
              <div className={item._destroy ? 'hidden' : ''} key={i}>
                <Stack.Item>
                  <Stack distribution="equalSpacing">
                    <Stack.Item>
                      <TextStyle variation="strong">
                        <a>{item.title}</a>
                      </TextStyle>
                      <br />
                      <TextStyle variation="subdued">
                        {item.returnContent}
                      </TextStyle>
                    </Stack.Item>
                  isSubmitting
                  <Stack.Item>
                      <div className="trash">
                        <Button
                          onClick={() =>
                            // handleRemoveReasons(i)}
                            setFieldValue(
                              'reasonsCancels',
                              handleRemoveReasons(values, i)
                            )
                          }
                        >
                          <img src={Trash}></img>
                        </Button>
                      </div>
                    </Stack.Item>
                  </Stack>
                </Stack.Item>
              </div>
            ))}
          {/*   <Button loading={isSubmitting} primary onClick={() => handleSubmit()}>
               Save
           </Button>*/}
          </Stack>
        </div>
      </Card.Section>
    </Layout>
  );
};
export default CustomPortal;
