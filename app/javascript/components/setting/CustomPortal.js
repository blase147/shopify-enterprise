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
    'Storeowner and Customer'
  );
  const handleSelectChangeDelivery = useCallback(
    (value) => setSelectedDelivery(value),
    []
  );
  const options = [
    { label: 'Storeowner and Customer', value: 'storeownerAndCustomer' },
    { label: 'Customer', value: 'customer' },
  ];
  const oneTimePurchaseOptions = [
    { label: 'Disabled for everyone', value: 'DisabledForEveryone' }
  ];

  const AllChargeZenProductsOptions = [
    { label: 'All ChargeZen Products', value: 'AllChargeZenProducts' }
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
    deliverySchdule: 'Storeowner and Customer',
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
                <button className="preview">PREVIEW</button>
                <button style={{ display: 'none' }} className="preview">CLOSE PREVIEW</button>
                <button className="preview">PUBLISH</button>
              </div>
            </div>

            <ActiveSubscription />
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
          <Stack.Item>
            <h5 className="customize-text">Customize Styles</h5>
          </Stack.Item>
          <Stack.Item>
            <div className="custom-portal">
              <FormLayout>
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
                  onChange={(e) => setFieldValue('styleAccountProfile', e)}
                />
                <p className="applied-classes">Sidebar menu, promo tagline I, promo tagline II </p>
                <TextField
                  label={
                    <TextStyle variation="subdued"> CSS classes available for customization: <span className="custom-classes"> .account-sidebar, .active-subscription .cancel-subscription</span> </TextStyle>
                  }
                  placeholder="Add Code Here..."
                  multiline={10}
                  value={values.styleSidebar ? values.styleSidebar : ''}
                  error={touched.styleSidebar && errors.styleSidebar}
                  onChange={(e) => setFieldValue('styleSidebar', e)}
                />
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
                  onChange={(e) => setFieldValue('styleSubscription', e)}
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
                  onChange={(e) => setFieldValue('styleSidebarPages', e)}
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
                  onChange={(e) => setFieldValue('styleUpsell', e)}
                />
              </FormLayout>
            </div>
          </Stack.Item>
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
              </FormLayout>
            </Stack.Item>
            <Stack.Item>
              <p className="navigation-text" variation="strong">Customer Details</p>
              <FormLayout>
                <FormLayout.Group>
                  <p>Edit Shipping Address</p>
                  <Select
                    options={options}
                    value={values.shipingAddress}
                    error={touched.shipingAddress && errors.shipingAddress}
                    onChange={(e) => setFieldValue('shipingAddress', e)}
                  />
                  <p>&nbsp;</p>
                </FormLayout.Group>
              </FormLayout>
            </Stack.Item>
            <Stack.Item>
              <Stack vertical>
                <p className="navigation-text" variation="strong">Subscription Details</p>

                <FormLayout>

                  <FormLayout.Group>
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
                    <p>Edit Upcoming Quantity</p>
                    <Select
                      options={options}
                      value={values.upcomingQuantity}
                      error={touched.upcomingQuantity && errors.upcomingQuantity}
                      onChange={(e) => setFieldValue('upcomingQuantity', e)}
                    />
                    <p>&nbsp;</p>
                  </FormLayout.Group>
                  <FormLayout.Group>
                    <p>Add Products to Subscription</p>
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
                  </FormLayout.Group>
                  <FormLayout.Group>
                    <p>Swap Product</p>
                    <Select
                      options={options}
                      value={values.swapProduct}
                      error={touched.swapProduct && errors.swapProduct}
                      onChange={(e) => setFieldValue('swapProduct', e)}
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
                  <FormLayout.Group>
                    <p>Edit Frequency</p>
                    <Select
                      options={options}
                      value={values.frequency}
                      error={touched.frequency && errors.frequency}
                      onChange={(e) => setFieldValue('frequency', e)}
                    />
                    <p>&nbsp;</p>
                  </FormLayout.Group>
                </FormLayout>
              </Stack>
            </Stack.Item>
          </div>
        </Stack>
      </Card.Section>
      <Card.Section>
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
      </Card.Section>
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
            <Button loading={isSubmitting} primary onClick={() => handleSubmit()}>
              Save
          </Button>
          </Stack>
        </div>
      </Card.Section>
    </Layout>
  );
};
export default CustomPortal;
