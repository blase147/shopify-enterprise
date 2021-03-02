import React, { useState, useCallback, useEffect } from 'react';
import { Formik } from 'formik';
import _ from 'lodash';
import * as yup from 'yup';
import { Link, useHistory, useParams } from 'react-router-dom';
import AppLayout from '../layout/Layout';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import offerImg from '../../../assets/images/upsell/offerImage.svg';
import SearchProduct from './SearchProduct';
import SearchPlan from './SearchPlan';

import {
  Card,
  Button,
  Form,
  FormLayout,
  TextField,
  TextContainer,
  Frame,
  ContextualSaveBar,
  Select,
  Subheading,
  Toast,
  Banner,
  List,
  Page,
  ButtonGroup,
  TextStyle,
  Checkbox,
  Stack,
  Heading,
  Spinner,
  Autocomplete,
} from '@shopify/polaris';

const NewUpSell = () => {
  const options = [...Array(99).keys()].map((foo) => (foo + 1).toString());

  const interOptions = [
    { label: 'Day(s)', value: 'day' },
    { label: 'Week(s)', value: 'week' },
    { label: 'Month(s)', value: 'month' },
    { label: 'Year(s)', value: 'year' },
  ];

  const cartConditionOptions = [{ label: 'contains any', value: 'cart_any' }];

  const customerConditionOptions = [
    { label: 'is subscribed to any', value: 'customer_any' },
  ];

  const orderConditionOptions = [
    { label: 'less than or equal to', value: 'order_less_equal' },
    { label: 'greater than or equal to', value: 'order_greater_equal' },
  ];

  const productConditionOptions = [
    { label: 'less than or equal to', value: 'product_less_equal' },
    { label: 'greater than or equal to', value: 'product_greater_equal' },
  ];

  const productOptions = [
    { label: '10', value: '10' },
    { label: '20', value: '20' },
    { label: '50', value: '50' },
    { label: '100', value: '100' },
  ];

  const productQuantityOptions = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];

  const templateOptions = [
    { label: '2 Columns', value: 'one_column' },
    { label: '1 Column', value: 'two_column' },
  ];

  const showOptions = [
    { label: 'Show', value: 'true' },
    { label: 'Hide', value: 'false' },
  ];

  const positionOptions = [
    { label: 'Bottom', value: 'bottom' },
    { label: 'Top', value: 'top' },
  ];

  const initialValues = {
    publicName: '',
    internalName: '',
    selectorTitle: '',
    status: '',
    upsellCampaigns: [
      {
        name: '',
        selectorLabel: '',
        description: '',
        intervalType: 'day',
        intervalCount: '1',
        ruleCart: false,
        ruleCartCondition: '',
        ruleCartValue: {
          productId: '',
          title: '',
        },
        ruleCustomer: false,
        ruleCustomerCondition: '',
        ruleCustomerValue: {
          sellingPlanId: '',
          sellingPlanName: '',
        },
        ruleOrder: false,
        ruleOrderCondition: '',
        ruleOrderValue: '',
        ruleProduct: false,
        ruleProductCondition: '',
        ruleProductValue: '',
        productOffer: {
          productId: '',
          title: '',
        },
        productDisplayQuantity: 'true',
        productLimitQuantity: false,
        productQuantityValue: '',
        template: '',
        showOfferTitle: 'true',
        offerTitle: '',
        showTimer: 'true',
        backgroundColor: '',
        buttonPosition: '',
        buttonTextAccept: '',
        buttonTextDecline: '',
        _destroy: false,
      },
    ],
  };

  const [formErrors, setFormErrors] = useState([]);
  const [campaignData, setCampaignData] = useState(null);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);

  const handleRemovingUpsellCampaign = useCallback((values, index) => {
    const campaigns = [...(values.upsellCampaigns || [])];
    campaigns[index]._destroy = true;
    return campaigns;
  });

  const handleAddUpsellCampaign = useCallback((values) => {
    const campaigns = [...(values.upsellCampaigns || [])];
    campaigns.push(initialValues.upsellCampaigns[0]);

    return campaigns;
  });

  const validationSchema = yup.object().shape({
    internalName: yup.string().required().label('Internal name'),
    publicName: yup.string().required().label('Public name'),
    selectorTitle: yup.string().required().label('Campaign selector title'),
    upsellCampaigns: yup.array().of(
      yup.object().shape({
        name: yup.string().required().label('Name'),
        selectorLabel: yup.string().required().label('Plan selector label'),
        // ruleCartValue: yup.object().shape({
        //   productId: yup.string().label('Only select'),
        // }),
        // productOffer: yup.object().shape({
        //   productId: yup.string().required().label('Only select'),
        // }),
        // ruleCustomerValue: yup.object().shape({
        //   sellingPlanId: yup.string().required().label('Only select'),
        // }),
      })
    ),
  });

  const GET_UPSELL_CAMPAIGN = gql`
    query($id: ID!) {
      fetchCampaign(id: $id) {
        id
        publicName
        internalName
        selectorTitle
        status
        upsellCampaigns {
          id
          name
          selectorLabel
          description
          intervalType
          intervalCount
          ruleCart
          ruleCartCondition
          ruleCartValue {
            productId
            title
          }
          ruleCustomer
          ruleCustomerCondition
          ruleCustomerValue {
            sellingPlanId
            sellingPlanName
          }
          ruleOrder
          ruleOrderCondition
          ruleOrderValue
          ruleProduct
          ruleProductCondition
          ruleProductValue
          productOffer {
            productId
            title
          }
          productDisplayQuantity
          productLimitQuantity
          productQuantityValue
          template
          showOfferTitle
          offerTitle
          showTimer
          backgroundColor
          buttonPosition
          buttonTextAccept
          buttonTextDecline
          _destroy
        }
      }
    }
  `;
  const { id } = useParams();

  const [getUpsell, { data, loading, error }] = useLazyQuery(
    GET_UPSELL_CAMPAIGN,
    {
      variables: { id: id },
      fetchPolicy: 'no-cache',
    }
  );

  useEffect(() => {
    if (id) {
      getUpsell();
    }
  }, []);

  const UPDATE_UPSELL_CAMPAIGN = gql`
    mutation($input: UpdateUpsellCampaignGroupInput!) {
      updateCampaign(input: $input) {
        campaign {
          id
          publicName
        }
      }
    }
  `;
  const [updateUpsellCampaign] = useMutation(UPDATE_UPSELL_CAMPAIGN);

  const CREATE_UPSELL_CAMPAIGN = gql`
    mutation($input: AddUpsellCampaignGroupInput!) {
      addCampaign(input: $input) {
        campaign {
          id
          publicName
        }
      }
    }
  `;

  const history = useHistory();
  const [createUpsellCampaign] = useMutation(CREATE_UPSELL_CAMPAIGN);

  useEffect(() => {
    if (data) {
      setCampaignData(data.fetchCampaign);
    }
  }, [data]);

  return (
    <AppLayout typePage="newUpsell" tabIndex="4">
      <Frame>
        <Page
          title={id ? 'Update Upsell Campaign' : 'Create Upsell Campaign'}
          breadcrumbs={[
            {
              content: 'Upsell Campaigns',
              onAction: () => history.push('/upsell'),
            },
          ]}
        >
          {loading && id && (
            <Spinner
              accessibilityLabel="Spinner example"
              size="large"
              color="teal"
            />
          )}
          {(campaignData || !id) && (
            <Formik
              validationSchema={validationSchema}
              initialValues={campaignData || initialValues}
              onSubmit={(values, { setSubmitting }) => {
                if (id) {
                  updateUpsellCampaign({
                    variables: {
                      input: { params: values },
                    },
                  })
                    .then((resp) => {
                      const data = resp.data;
                      const errors = data.errors;

                      console.log(errors);
                      if (errors) {
                        setFormErrors(errors);
                        setSubmitting(false);
                      } else {
                        // setSaveSuccess(true);
                        history.push('/upsell');
                      }
                    })
                    .catch((error) => {
                      setSubmitting(false);
                      setFormErrors(error);
                    });
                } else {
                  //const variables = formatUpsellCampaignGroup(values);
                  createUpsellCampaign({
                    variables: { input: { params: values } },
                  })
                    .then((resp) => {
                      const data = resp.data;
                      const errors = data.errors;

                      console.log(errors);
                      if (errors) {
                        setFormErrors(errors);
                        setSubmitting(false);
                      } else {
                        // setSaveSuccess(true);
                        history.push('/upsell');
                      }
                    })
                    .catch((error) => {
                      setSubmitting(false);
                      setFormErrors(error);
                    });
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                resetForm,
                dirty,
                formik,
                /* and other goodies */
              }) => (
                <Form onSubmit={handleSubmit}>
                  {dirty && (
                    <ContextualSaveBar
                      message="Unsaved changes"
                      saveAction={{
                        onAction: handleSubmit,
                        loading: isSubmitting,
                        disabled: false,
                      }}
                      discardAction={{
                        onAction: resetForm,
                      }}
                    />
                  )}

                  {saveSuccess && (
                    <Toast
                      content="Upsell campaign group is saved"
                      onDismiss={hideSaveSuccess}
                    />
                  )}

                  {formErrors.length > 0 && (
                    <>
                      <Banner
                        title="Upsell campaign group could not be saved"
                        status="critical"
                      >
                        <List type="bullet">
                          {formErrors.map((message, index) => (
                            <List.Item key={index}>{message.message}</List.Item>
                          ))}
                        </List>
                      </Banner>
                      <br />
                    </>
                  )}

                  <Card title="Upsell campaign Group" sectioned>
                    <FormLayout>
                      <FormLayout.Group>
                        <TextField
                          value={values.internalName}
                          label="Internal name"
                          placeholder="Subscription and Save"
                          type="text"
                          error={touched.internalName && errors.internalName}
                          onChange={(e) => setFieldValue('internalName', e)}
                          helpText={
                            <span>
                              Internal name of the group, used to identify it in
                              the admin
                            </span>
                          }
                        />
                        <div className={`btn-group ${!dirty && 'hidden'}`}>
                          <ButtonGroup>
                            <Button
                              primary
                              onClick={() =>
                                setFieldValue('status', 'draft').then(() =>
                                  handleSubmit()
                                )
                              }
                              loading={isSubmitting}
                            >
                              Save as Draft
                            </Button>
                            <Button
                              onClick={() =>
                                setFieldValue('status', 'publish').then(() =>
                                  handleSubmit()
                                )
                              }
                              loading={isSubmitting}
                            >
                              Save & Public
                            </Button>
                          </ButtonGroup>
                        </div>
                      </FormLayout.Group>
                      <FormLayout.Group>
                        <TextField
                          value={values.selectorTitle}
                          error={touched.selectorTitle && errors.selectorTitle}
                          onChange={(e) => setFieldValue('selectorTitle', e)}
                          label="Plan selector title"
                          placeholder="Deliver every"
                          type="text"
                          helpText={
                            <span>
                              Title of the selling plan selector on the product
                              page
                            </span>
                          }
                        />

                        <TextField
                          value={values.publicName}
                          error={touched.publicName && errors.publicName}
                          onChange={(e) => setFieldValue('publicName', e)}
                          label="Public name"
                          placeholder="Subscription and Save"
                          type="text"
                          helpText={
                            <span>
                              Public name of the group, displayed on the product
                              page
                            </span>
                          }
                        />
                      </FormLayout.Group>
                    </FormLayout>
                  </Card>
                  {values.upsellCampaigns.map((campaign, index) => (
                    <div
                      className={
                        campaign._destroy ? 'hidden' : 'itemUpsellCampaign'
                      }
                      key={index}
                    >
                      <Card
                        title="Upsell Campaign"
                        sectioned
                        actions={
                          index == 0
                            ? null
                            : [
                                {
                                  content: 'Remove',
                                  onAction: () => {
                                    setFieldValue(
                                      'upsellCampaigns',
                                      handleRemovingUpsellCampaign(
                                        values,
                                        index
                                      )
                                    );
                                  },
                                },
                              ]
                        }
                      >
                        <FormLayout>
                          <FormLayout.Group>
                            <TextField
                              value={campaign.name}
                              label="Name"
                              placeholder="Subscription and Save - delivered every week"
                              type="text"
                              error={
                                touched.upsellCampaigns?.[index]?.name &&
                                errors.upsellCampaigns?.[index]?.name
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `upsellCampaigns[${index}].name`,
                                  e
                                )
                              }
                              helpText={
                                <span>
                                  Selling plan name displayed in the cart and
                                  during checkout. It's recommended that this
                                  name includes the frequency of deliveries
                                </span>
                              }
                            />
                            <TextField
                              value={campaign.selectorLabel}
                              label="Plan selector label"
                              placeholder="1 week"
                              type="text"
                              error={
                                touched.upsellCampaigns?.[index]
                                  ?.selectorLabel &&
                                errors.upsellCampaigns?.[index]?.selectorLabel
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `upsellCampaigns[${index}].selectorLabel`,
                                  e
                                )
                              }
                              helpText={
                                <span>
                                  Label in the plan selector on the product page
                                </span>
                              }
                            />
                          </FormLayout.Group>
                          <FormLayout.Group>
                            <TextField
                              value={campaign.description}
                              label="Description (optional)"
                              type="text"
                              multiline={4}
                              error={
                                touched.upsellCampaigns?.[index]?.description &&
                                errors.upsellCampaigns?.[index]?.description
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `upsellCampaigns[${index}].description`,
                                  e
                                )
                              }
                              helpText={
                                <span>
                                  Detailed commitment description displayed on
                                  the product page when the plan is selected
                                </span>
                              }
                            />
                            <p> </p>
                          </FormLayout.Group>
                          <TextContainer>
                            <Subheading>DISPLAY RULES</Subheading>
                            <TextStyle variation="subdued">
                              Show these offers when any of the following
                              individual criteria are met
                            </TextStyle>
                          </TextContainer>
                          <FormLayout.Group>
                            <Select
                              label="Interval"
                              value={campaign.intervalCount}
                              error={
                                touched.upsellCampaigns?.[index]
                                  ?.intervalCount &&
                                errors.upsellCampaigns?.[index]?.intervalCount
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `upsellCampaigns[${index}].intervalCount`,
                                  e
                                )
                              }
                              options={options}
                            />
                            <Select
                              options={interOptions}
                              label="  "
                              value={campaign.intervalType}
                              error={
                                touched.upsellCampaigns?.[index]
                                  ?.intervalType &&
                                errors.upsellCampaigns?.[index]?.intervalType
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `upsellCampaigns[${index}].intervalType`,
                                  e
                                )
                              }
                            />
                          </FormLayout.Group>

                          <div className="when-cart">
                            <Stack>
                              <Checkbox
                                label="When cart"
                                checked={campaign.ruleCart}
                                error={
                                  touched.upsellCampaigns?.[index]?.ruleCart &&
                                  errors.upsellCampaigns?.[index]?.ruleCart
                                }
                                onChange={(e) =>
                                  setFieldValue(
                                    `upsellCampaigns[${index}].ruleCart`,
                                    e
                                  )
                                }
                              />
                              <Select
                                label=""
                                value={campaign.ruleCartCondition}
                                error={
                                  touched.upsellCampaigns?.[index]
                                    ?.ruleCartCondition &&
                                  errors.upsellCampaigns?.[index]
                                    ?.ruleCartCondition
                                }
                                onChange={(e) =>
                                  setFieldValue(
                                    `upsellCampaigns[${index}].ruleCartCondition`,
                                    e
                                  )
                                }
                                options={cartConditionOptions}
                              />
                              <p>of the following product</p>
                            </Stack>
                            <div className="search">
                              <SearchProduct
                                value={campaign.ruleCartValue}
                                setFieldValue={setFieldValue}
                                fieldName={`upsellCampaigns[${index}].ruleCartValue`}
                                error={
                                  campaign.ruleCart &&
                                  touched.upsellCampaigns?.[index]
                                    ?.ruleCartValue?.productId &&
                                  errors.upsellCampaigns?.[index]?.ruleCartValue
                                    ?.productId
                                }
                              />
                            </div>
                          </div>

                          <div className="when-cart">
                            <Stack>
                              <Checkbox
                                label="When customer"
                                checked={campaign.ruleCustomer}
                                error={
                                  touched.upsellCampaigns?.[index]
                                    ?.ruleCustomer &&
                                  errors.upsellCampaigns?.[index]?.ruleCustomer
                                }
                                onChange={(e) =>
                                  setFieldValue(
                                    `upsellCampaigns[${index}].ruleCustomer`,
                                    e
                                  )
                                }
                              />
                              <Select
                                label=""
                                value={campaign.ruleCustomerCondition}
                                error={
                                  touched.upsellCampaigns?.[index]
                                    ?.ruleCustomerCondition &&
                                  errors.upsellCampaigns?.[index]
                                    ?.ruleCustomerCondition
                                }
                                onChange={(e) =>
                                  setFieldValue(
                                    `upsellCampaigns[${index}].ruleCustomerCondition`,
                                    e
                                  )
                                }
                                options={customerConditionOptions}
                              />
                              <p>of the following plans</p>
                            </Stack>
                            <div className="search">
                              <SearchPlan
                                idForTextField={`serchPlan-${index}`}
                                value={campaign.ruleCustomerValue}
                                setFieldValue={setFieldValue}
                                fieldName={`upsellCampaigns[${index}].ruleCustomerValue`}
                                error={
                                  campaign.ruleCustomer &&
                                  touched.upsellCampaigns?.[index]
                                    ?.ruleCustomerValue?.sellingPlanId &&
                                  errors.upsellCampaigns?.[index]
                                    ?.ruleCustomerValue?.sellingPlanId
                                }
                              />
                            </div>
                          </div>

                          <div className="when-order">
                            <Checkbox
                              label="When order value is"
                              checked={campaign.ruleOrder}
                              error={
                                touched.upsellCampaigns?.[index]?.ruleOrder &&
                                errors.upsellCampaigns?.[index]?.ruleOrder
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `upsellCampaigns[${index}].ruleOrder`,
                                  e
                                )
                              }
                            />
                            <Select
                              label=""
                              value={campaign.ruleOrderCondition}
                              error={
                                touched.upsellCampaigns?.[index]
                                  ?.ruleOrderCondition &&
                                errors.upsellCampaigns?.[index]
                                  ?.ruleOrderCondition
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `upsellCampaigns[${index}].ruleOrderCondition`,
                                  e
                                )
                              }
                              options={orderConditionOptions}
                            />

                            <div className="amount">
                              <TextField
                                value={campaign.ruleOrderValue}
                                label=""
                                type="text"
                                error={
                                  touched.upsellCampaigns?.[index]
                                    ?.ruleOrderValue &&
                                  errors.upsellCampaigns?.[index]
                                    ?.ruleOrderValue
                                }
                                onChange={(e) =>
                                  setFieldValue(
                                    `upsellCampaigns[${index}].ruleOrderValue`,
                                    e
                                  )
                                }
                                placeholder="100"
                                prefix="$"
                              />
                            </div>
                          </div>

                          <div className="when-order">
                            <Checkbox
                              label="When product count is"
                              checked={campaign.ruleProduct}
                              error={
                                touched.upsellCampaigns?.[index]?.ruleProduct &&
                                errors.upsellCampaigns?.[index]?.ruleProduct
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `upsellCampaigns[${index}].ruleProduct`,
                                  e
                                )
                              }
                            />
                            <Select
                              label=""
                              value={campaign.ruleProductCondition}
                              error={
                                touched.upsellCampaigns?.[index]
                                  ?.ruleProductCondition &&
                                errors.upsellCampaigns?.[index]
                                  ?.ruleProductCondition
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `upsellCampaigns[${index}].ruleProductCondition`,
                                  e
                                )
                              }
                              options={productConditionOptions}
                            />

                            <div className="amount">
                              <Select
                                label=""
                                value={campaign.ruleProductValue}
                                error={
                                  touched.upsellCampaigns?.[index]
                                    ?.ruleProductValue &&
                                  errors.upsellCampaigns?.[index]
                                    ?.ruleProductValue
                                }
                                onChange={(e) =>
                                  setFieldValue(
                                    `upsellCampaigns[${index}].ruleProductValue`,
                                    e
                                  )
                                }
                                options={productOptions}
                              />
                            </div>
                          </div>

                          <TextContainer>
                            <Subheading>OFFERS</Subheading>
                            <p>
                              Select a product(s) to include in this campaign
                              and customize the look.
                            </p>
                          </TextContainer>

                          <FormLayout.Group>
                            <p className="card-offer">PRODUCT</p>
                            <p className="card-offer">CUSTOMIZE</p>
                          </FormLayout.Group>

                          <FormLayout.Group>
                            <div className="product-search">
                              <SearchProduct
                                value={campaign.productOffer}
                                setFieldValue={setFieldValue}
                                fieldName={`upsellCampaigns[${index}].productOffer`}
                                error={
                                  touched.upsellCampaigns?.[index]?.productOffer
                                    ?.productId &&
                                  errors.upsellCampaigns?.[index]?.productOffer
                                    ?.productId
                                }
                              />
                            </div>
                            <Select
                              label="Templates"
                              value={campaign.template}
                              error={
                                touched.upsellCampaigns?.[index]?.template &&
                                errors.upsellCampaigns?.[index]?.template
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `upsellCampaigns[${index}].template`,
                                  e
                                )
                              }
                              options={templateOptions}
                            />
                          </FormLayout.Group>
                          <FormLayout.Group>
                            <div className="offer-left">
                              <Select
                                label="Display Quantity ?"
                                value={campaign.productDisplayQuantity}
                                error={
                                  touched.upsellCampaigns?.[index]
                                    ?.productDisplayQuantity &&
                                  errors.upsellCampaigns?.[index]
                                    ?.productDisplayQuantity
                                }
                                onChange={(e) =>
                                  setFieldValue(
                                    `upsellCampaigns[${index}].productDisplayQuantity`,
                                    String(e)
                                  )
                                }
                                options={productQuantityOptions}
                              />
                              <TextField
                                label={
                                  <Checkbox
                                    label="Limit Quantity"
                                    checked={campaign.productLimitQuantity}
                                    error={
                                      touched.upsellCampaigns?.[index]
                                        ?.productLimitQuantity &&
                                      errors.upsellCampaigns?.[index]
                                        ?.productLimitQuantity
                                    }
                                    onChange={(e) =>
                                      setFieldValue(
                                        `upsellCampaigns[${index}].productLimitQuantity`,
                                        e
                                      )
                                    }
                                  />
                                }
                                value={campaign.productQuantityValue}
                                type="number"
                                error={
                                  touched.upsellCampaigns?.[index]
                                    ?.productQuantityValue &&
                                  errors.upsellCampaigns?.[index]
                                    ?.productQuantityValue
                                }
                                onChange={(e) =>
                                  setFieldValue(
                                    `upsellCampaigns[${index}].productQuantityValue`,
                                    e
                                  )
                                }
                                placeholder="1"
                              />
                              <div></div>
                            </div>

                            <div className="offer-right">
                              <div className="offer-right-select">
                                <Select
                                  label="Offer title"
                                  value={campaign.showOfferTitle}
                                  error={
                                    touched.upsellCampaigns?.[index]
                                      ?.showOfferTitle &&
                                    errors.upsellCampaigns?.[index]
                                      ?.showOfferTitle
                                  }
                                  onChange={(e) =>
                                    setFieldValue(
                                      `upsellCampaigns[${index}].showOfferTitle`,
                                      e
                                    )
                                  }
                                  options={showOptions}
                                />
                              </div>
                              <div className="offer-right-textfield">
                                <TextField
                                  label="  "
                                  placeholder="Wait, there’s an offer for you!"
                                  value={campaign.offerTitle}
                                  type="text"
                                  error={
                                    touched.upsellCampaigns?.[index]
                                      ?.offerTitle &&
                                    errors.upsellCampaigns?.[index]?.offerTitle
                                  }
                                  onChange={(e) =>
                                    setFieldValue(
                                      `upsellCampaigns[${index}].offerTitle`,
                                      e
                                    )
                                  }
                                ></TextField>
                              </div>
                            </div>
                          </FormLayout.Group>
                          <FormLayout.Group>
                            <div></div>
                            <div className="offer-right">
                              <div className="offer-right-select">
                                <Select
                                  label="Timer"
                                  value={campaign.showTimer}
                                  error={
                                    touched.upsellCampaigns?.[index]
                                      ?.showTimer &&
                                    errors.upsellCampaigns?.[index]?.showTimer
                                  }
                                  onChange={(e) =>
                                    setFieldValue(
                                      `upsellCampaigns[${index}].showTimer`,
                                      String(e)
                                    )
                                  }
                                  options={showOptions}
                                />
                              </div>
                              <div className="offer-right-textfield">
                                <TextField
                                  label="Background Color"
                                  placeholder="#00000"
                                  value={campaign.backgroundColor}
                                  type="text"
                                  error={
                                    touched.upsellCampaigns?.[index]
                                      ?.backgroundColor &&
                                    errors.upsellCampaigns?.[index]
                                      ?.backgroundColor
                                  }
                                  onChange={(e) =>
                                    setFieldValue(
                                      `upsellCampaigns[${index}].backgroundColor`,
                                      e
                                    )
                                  }
                                ></TextField>
                              </div>
                            </div>
                          </FormLayout.Group>
                          <FormLayout.Group>
                            <div></div>
                            <TextContainer>
                              <Heading>Buttons</Heading>
                              <div className="offer-right">
                                <div className="offer-right-select">
                                  <Select
                                    label="Positions"
                                    value={campaign.buttonPosition}
                                    error={
                                      touched.upsellCampaigns?.[index]
                                        ?.buttonPosition &&
                                      errors.upsellCampaigns?.[index]
                                        ?.buttonPosition
                                    }
                                    onChange={(e) =>
                                      setFieldValue(
                                        `upsellCampaigns[${index}].buttonPosition`,
                                        e
                                      )
                                    }
                                    options={positionOptions}
                                  />
                                </div>
                                <div className="offer-right-textfield">
                                  <TextField
                                    label="Button Text (Accept Offer)"
                                    placeholder="Pay Now (Total Price)"
                                    value={campaign.buttonTextAccept}
                                    type="text"
                                    error={
                                      touched.upsellCampaigns?.[index]
                                        ?.buttonTextAccept &&
                                      errors.upsellCampaigns?.[index]
                                        ?.buttonTextAccept
                                    }
                                    onChange={(e) =>
                                      setFieldValue(
                                        `upsellCampaigns[${index}].buttonTextAccept`,
                                        e
                                      )
                                    }
                                  ></TextField>
                                </div>
                              </div>
                            </TextContainer>
                          </FormLayout.Group>
                          <FormLayout.Group>
                            <div></div>
                            <div className="decline">
                              <TextField
                                label="Button Text (Decline Offer)"
                                placeholder="No thanks"
                                value={campaign.buttonTextDecline}
                                type="text"
                                error={
                                  touched.upsellCampaigns?.[index]
                                    ?.buttonTextDecline &&
                                  errors.upsellCampaigns?.[index]
                                    ?.buttonTextDecline
                                }
                                onChange={(e) =>
                                  setFieldValue(
                                    `upsellCampaigns[${index}].buttonTextDecline`,
                                    e
                                  )
                                }
                              ></TextField>
                            </div>
                          </FormLayout.Group>
                        </FormLayout>
                      </Card>
                    </div>
                  ))}

                  <br />
                  <div className="addUpsellCampaigns">
                    <Button
                      plain
                      onClick={() =>
                        setFieldValue(
                          'upsellCampaigns',
                          handleAddUpsellCampaign(values)
                        )
                      }
                    >
                      Add upsell campaign
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </Page>
      </Frame>
    </AppLayout>
  );
};

export default NewUpSell;
