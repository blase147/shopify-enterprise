import {
  Layout,
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
  Stack,
  Spinner,
  Checkbox,
} from '@shopify/polaris';
import DeleteSVG from '../../../assets/images/delete.svg';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import _ from 'lodash';
import * as yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';
import LayoutIndex from '../layout/Layout';
import SearchCollection from './SearchCollection';
import SearchProduct from './SearchProduct';
import dayjs from 'dayjs';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import DatePickr from '../common/DatePicker/DatePickr';
import removeIcon from '../../../assets/images/subscriptionsPlans/removeProduct.svg';
import LoadingScreen from '../LoadingScreen';

const BuildABoxPlan = () => {
  const { id } = useParams();
  const GET_SELLING_PLAN = gql`
    query ($id: ID!) {
      fetchPlanGroup(id: $id) {
        id
        publicName
        internalName
        planSelectorTitle
        active
        sellingPlans {
          id
          name
          selectorLabel
          adjustmentValue
          adjustmentType
          minFullfilment
          maxFullfilment
          intervalType
          intervalCount
          description
          _destroy
          deliveryIntervalType
          deliveryIntervalCount
          trialAdjustmentValue
          trialAdjustmentType
          trialIntervalType
          trialIntervalCount
          boxSubscriptionType
          boxIsQuantity
          boxIsQuantityLimited
          boxQuantityLimit
          billingDates
          shippingDates
          shippingCutOff
          firstDelivery
          productImages {
            productId
            image
            _destroy
          }
          collectionImages {
            collectionId
            collectionTitle
            products {
              productId
              image
              _destroy
            }
            _destroy
          }
        }
      }
    }
  `;

  const [getSellingPlan, { data, loading, error }] = useLazyQuery(
    GET_SELLING_PLAN,
    {
      variables: { id: id },
      fetchPolicy: 'no-cache',
    }
  );
  useEffect(() => {
    if (id) {
      getSellingPlan();
    }
  }, []);

  // consts ###
  const options = [...Array(99).keys()].map((foo) => (foo + 1).toString());

  const shippingCutOffOptions = [];
  [...Array(31).keys()].map((foo) =>
    shippingCutOffOptions.push({
      label: `${foo + 1} ${foo == 0 ? 'day' : 'days'}`,
      value: foo + 1,
    })
  );

  const firstDeliveryOptions = [
    { label: 'ASAP', value: 'ASAP' },
    { label: 'NEXT', value: 'NEXT' },
  ];

  const optionsWithNone = [...options];
  optionsWithNone.unshift({ value: '', label: 'None' });
  const interOptions = [
    { label: 'Day(s)', value: 'DAY' },
    { label: 'Week(s)', value: 'WEEK' },
    { label: 'Month(s)', value: 'MONTH' },
    { label: 'Year(s)', value: 'YEAR' },
  ];
  const adjusmentOptions = [
    { label: 'Fixed amount discount', value: 'FIXED_AMOUNT' },
    { label: 'Percentage discount', value: 'PERCENTAGE' },
    { label: 'Manual price', value: 'PRICE' },
  ];
  const boxQuantityOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  const [formErrors, setFormErrors] = useState([]);
  const [planData, setPlanData] = useState(null);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);

  useEffect(() => {
    if (data && data.fetchPlanGroup) {
      setPlanData(data.fetchPlanGroup);
      setSelectedProducts(data.fetchPlanGroup.sellingPlans[0].productImages);
      setProductListFirst(data.fetchPlanGroup.sellingPlans[0].productImages);
      setSelectedProductOptions(() => {
        const defaultOption = [];
        data.fetchPlanGroup.sellingPlans[0].productImages?.map(
          (image) =>
            image._destroy == false && defaultOption.push(image.productId)
        );
        return defaultOption;
      });
      setSelectedCollections(
        data.fetchPlanGroup.sellingPlans[0].collectionImages
      );
      setSelectedCollectionOptions(() => {
        const defaultOption = [];
        data.fetchPlanGroup.sellingPlans[0].collectionImages?.map(
          (image) =>
            image._destroy == false && defaultOption.push(image.collectionId)
        );
        return defaultOption;
      });
    }
  }, [data]);

  const initialValues = {
    name: '',
    selectorLabel: '',
    description: '',
    intervalCount: '1',
    intervalType: 'DAY',
    minFullfilment: '1',
    maxFullfilment: '1',
    adjustmentType: 'FIXED_AMOUNT',
    adjustmentValue: '0',
    _destroy: false,
    deliveryIntervalType: 'DAY',
    deliveryIntervalCount: '1',
    trialIntervalCount: '1',
    trialIntervalType: 'DAY',
    trialAdjustmentType: '',
    trialAdjustmentValue: '0',
    boxSubscriptionType: 0,
    firstDelivery: 'ASAP',
    shippingCutOff: 1,
    billingDates: [],
    shippingDates: [],
    boxIsQuantity: true,
    boxIsQuantityLimited: true,
    boxQuantityLimit: 0,
  };

  const [productImagesFirst, setProductListFirst] = useState([]);

  const validationSchema = yup.object().shape({
    internalName: yup.string().required().label('Internal name'),
    publicName: yup.string().required().label('Public name'),
    planSelectorTitle: yup.string().required().label('Plan selector title'),
    sellingPlans: yup.array().of(
      yup.object().shape({
        name: yup.string().required().label('Name'),
        selectorLabel: yup.string().required().label('Plan selector label'),
      })
    ),
  });

  const UPDATE_SELLING_PLAN = gql`
    mutation ($input: UpdateSellingPlanGroupInput!) {
      updatePlan(input: $input) {
        plan {
          id
          name
        }
      }
    }
  `;
  const [updateSellingPlan] = useMutation(UPDATE_SELLING_PLAN);

  const CREATE_SELLING_PLAN = gql`
    mutation ($input: AddSellingPlanGroupInput!) {
      addPlan(input: $input) {
        plan {
          id
          name
        }
      }
    }
  `;

  const [createSellingPlan] = useMutation(CREATE_SELLING_PLAN);
  const history = useHistory();

  // controll product image
  const formRef = useRef(null);
  const [selectedProductOptions, setSelectedProductOptions] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [selectedCollectionOptions, setSelectedCollectionOptions] = useState(
    []
  );
  const [selectedCollections, setSelectedCollections] = useState([]);

  const handleRemoveProduct = (index) => {
    setSelectedProducts(() => {
      let newSelectedProduct = [...(selectedProducts || [])];
      newSelectedProduct[index]._destroy = true;
      return newSelectedProduct;
    });
    setSelectedProductOptions([
      ...selectedProductOptions.slice(0, index),
      ...selectedProductOptions.slice(index + 1),
    ]);
  };

  const handleRemoveCollectionProduct = (collectionIndex, productIndex) => {
    setSelectedCollections(() => {
      let newSelectedCollection = [...(selectedCollections || [])];
      newSelectedCollection[collectionIndex].products[
        productIndex
      ]._destroy = true;
      return newSelectedCollection;
    });
  };

  useEffect(() => {
    if (
      selectedProducts &&
      formRef.current &&
      formRef.current?.values.sellingPlans[0].productImages != selectedProducts
    ) {
      formRef.current.setFieldValue(
        'sellingPlans[0].productImages',
        selectedProducts
      );
    }
  }, [selectedProducts]);

  useEffect(() => {
    if (
      selectedCollections &&
      formRef.current &&
      formRef.current?.values.sellingPlans[0].collectionImages !=
      selectedCollections
    ) {
      formRef.current.setFieldValue(
        'sellingPlans[0].collectionImages',
        selectedCollections
      );
    }
  }, [selectedCollections]);

  const [updated, setUpdated] = useState(false);
  const [selectedDate, setSelectedDate] = useState([
    { shippingDate: '', billingDate: '' },
  ]);
  const setDate = useCallback(
    (date) => {
      setSelectedDate(date);
    },
    [setSelectedDate]
  );

  const clearDate = useCallback(
    (type, index) => {
      let date = (selectedDate[index][type] = '');
      setSelectedDate(date);
    },
    [setSelectedDate]
  );

  const removeSelectedDate = (type, index, values) => {
    if (values[`${type}s`].length < 1) {
      let date = selectedDate;
      date[index][type] = '';
      setSelectedDate(date);
    }
  };

  const removeDate = (dates, index) => {
    if (dates) {
      dates.splice(index, 1);
      setUpdated(true);
    }
    return [...dates];
  };
  const checkDates = (setFieldValue, values, selectedDate, field) => {
    if (selectedDate[0]?.billingDate && values.billingDates.length === 0) {
      setFieldValue(`${field}.billingDates`, [selectedDate[0].billingDate]);
    }
    if (selectedDate[0]?.shippingDate && values.shippingDates.length === 0) {
      setFieldValue(`${field}.shippingDates`, [selectedDate[0].shippingDate]);
    }
  };
  return (
    <LayoutIndex typePage="sellingPlanForm" tabIndex={1}>
      <Frame>
        <Page
          title={
            id
              ? 'Update selling plan (Build A Box)'
              : 'Create selling plan (Build A Box)'
          }
          breadcrumbs={[
            {
              content: 'Manage Plans',
              onAction: () => history.push('/subscription-plans'),
            },
          ]}
        >
          {loading && id && (
            <LoadingScreen />
          )}

          {(planData || !id) && (
            <Formik
              innerRef={formRef}
              validationSchema={validationSchema}
              initialValues={
                planData
                  ? planData
                  : {
                    internalName: '',
                    planSelectorTitle: '',
                    publicName: '',
                    sellingPlans: [{ ...initialValues }],
                  }
              }
              onSubmit={(values, { setSubmitting, setDirty }) => {
                if (id) {
                  updateSellingPlan({
                    variables: {
                      input: { params: values },
                    },
                  })
                    .then((resp) => {
                      const data = resp.data;
                      const errors = data.errors;

                      if (errors) {
                        setFormErrors(errors);
                        setSubmitting(false);
                      } else {
                        // setSaveSuccess(true);
                        history.push('/subscription-plans');
                      }
                    })
                    .catch((error) => {
                      setSubmitting(false);
                      setFormErrors(error);
                    });
                } else {
                  createSellingPlan({
                    variables: {
                      input: {
                        params: {
                          ...values,
                          planType: 'build_a_box',
                        },
                      },
                    },
                  })
                    .then((resp) => {
                      const data = resp.data;
                      const errors = data.errors;

                      if (errors) {
                        setFormErrors(errors);
                        setSubmitting(false);
                      } else {
                        // setSaveSuccess(true);
                        history.push('/subscription-plans');
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
                  {(dirty || updated) && (
                    <ContextualSaveBar
                      message="Unsaved changes"
                      saveAction={{
                        onAction: () =>
                          setFieldValue('active', true).then(() =>
                            handleSubmit()
                          ),
                        loading: isSubmitting,
                        disabled: false,
                      }}
                      discardAction={{
                        onAction: () => {
                          setSelectedProducts(productImagesFirst);
                          resetForm();
                          setUpdated((flag) => (flag = false));
                        },
                      }}
                    />
                  )}

                  {saveSuccess && (
                    <Toast
                      content="Selling plan group is saved"
                      onDismiss={hideSaveSuccess}
                    />
                  )}

                  {formErrors.length > 0 && (
                    <>
                      <Banner
                        title="Selling plan group could not be saved"
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

                  <Card title="Selling Plan Group" sectioned>
                    <FormLayout>
                      <FormLayout.Group>
                        <TextField
                          value={values.internalName}
                          label="Internal name"
                          placeholder="Subscribe & Save"
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
                                setFieldValue('active', false).then(() =>
                                  handleSubmit()
                                )
                              }
                              loading={isSubmitting}
                            >
                              Save as Draft
                            </Button>
                            <Button
                              onClick={() =>
                                setFieldValue('active', true).then(() =>
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
                          value={values.planSelectorTitle}
                          error={
                            touched.planSelectorTitle &&
                            errors.planSelectorTitle
                          }
                          onChange={(e) =>
                            setFieldValue('planSelectorTitle', e)
                          }
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
                          placeholder="Subscribe & Save"
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

                  {values.sellingPlans.map((plan, index) => (
                    <div className="itemPlan" key={index}>
                      <Card
                        title="Selling Plan"
                        sectioned
                        actions={
                          (!id && index != 0) ||
                            (id &&
                              values.sellingPlans.filter((p) => !p._destroy)
                                .length > 1)
                            ? [
                              {
                                content: 'Remove',
                                onAction: () => {
                                  setFieldValue(
                                    `sellingPlans[${index}]._destroy`,
                                    true
                                  );
                                },
                              },
                            ]
                            : []
                        }
                      >
                        <FormLayout>
                          <FormLayout.Group>
                            <TextField
                              value={plan.name}
                              error={
                                touched.sellingPlans?.[index]?.name &&
                                errors.sellingPlans?.[index]?.name
                              }
                              onChange={(e) =>
                                setFieldValue(`sellingPlans[${index}].name`, e)
                              }
                              label="Name"
                              placeholder="Subscribe and Save - delivered every week"
                              type="text"
                              helpText={
                                <span>
                                  Selling plan name displayed in the cart and
                                  during checkout. It's recommended that this
                                  name includes the frequency of deliveries
                                </span>
                              }
                            />
                            <TextField
                              value={plan.selectorLabel}
                              error={
                                touched.sellingPlans?.[index]?.selectorLabel &&
                                errors.sellingPlans?.[index]?.selectorLabel
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `sellingPlans[${index}].selectorLabel`,
                                  e
                                )
                              }
                              label="Plan selector label"
                              placeholder="1 week"
                              type="text"
                              helpText={
                                <span>
                                  Label in the plan selector on the product page
                                </span>
                              }
                            />
                          </FormLayout.Group>
                          <FormLayout.Group>
                            <TextField
                              value={plan.description}
                              error={
                                touched.sellingPlans?.[index]?.description &&
                                errors.sellingPlans?.[index]?.description
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `sellingPlans[${index}].description`,
                                  e
                                )
                              }
                              label="Description (optional)"
                              type="text"
                              multiline={4}
                              helpText={
                                <span>
                                  Detailed commitment description displayed on
                                  the product page when the plan is selected
                                </span>
                              }
                            />
                            <p> </p>
                          </FormLayout.Group>
                          <br />
                          {/* Billing Rule */}
                          <TextContainer>
                            <Subheading>Billing Rules</Subheading>
                          </TextContainer>

                          <FormLayout.Group>
                            <Select
                              label="Interval"
                              value={plan.intervalCount}
                              error={
                                touched.sellingPlans?.[index]?.intervalCount &&
                                errors.sellingPlans?.[index]?.intervalCount
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `sellingPlans[${index}].intervalCount`,
                                  e
                                )
                              }
                              options={options}
                            />
                            <Select
                              options={interOptions}
                              label="  "
                              value={plan.intervalType}
                              error={
                                touched.sellingPlans?.[index]?.intervalType &&
                                errors.sellingPlans?.[index]?.intervalType
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `sellingPlans[${index}].intervalType`,
                                  e
                                )
                              }
                            />
                          </FormLayout.Group>
                          <FormLayout.Group>
                            <Select
                              options={optionsWithNone}
                              label="Min number of fullfilments before the customer can cancel"
                              value={plan.minFullfilment}
                              error={
                                touched.sellingPlans?.[index]?.minFullfilment &&
                                errors.sellingPlans?.[index]?.minFullfilment
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `sellingPlans[${index}].minFullfilment`,
                                  e
                                )
                              }
                            />
                            <Select
                              options={optionsWithNone}
                              label="Max number of fullfilments"
                              value={plan.maxFullfilment}
                              error={
                                touched.sellingPlans?.[index]?.maxFullfilment &&
                                errors.sellingPlans?.[index]?.maxFullfilment
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `sellingPlans[${index}].maxFullfilment`,
                                  e
                                )
                              }
                            />
                          </FormLayout.Group>
                          <FormLayout.Group>
                            <Select
                              options={adjusmentOptions}
                              label="Discount or manual price"
                              value={plan.adjustmentType}
                              error={
                                touched.sellingPlans?.[index]?.adjustmentType &&
                                errors.sellingPlans?.[index]?.adjustmentType
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `sellingPlans[${index}].adjustmentType`,
                                  e
                                )
                              }
                            />
                            <TextField
                              disabled={false}
                              type="number"
                              label="Adjustment value"
                              value={plan.adjustmentValue}
                              error={
                                touched.sellingPlans?.[index]
                                  ?.adjustmentValue &&
                                errors.sellingPlans?.[index]?.adjustmentValue
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `sellingPlans[${index}].adjustmentValue`,
                                  e
                                )
                              }
                              prefix={
                                plan.adjustmentType == 'PERCENTAGE' ? '' : '$'
                              }
                              suffix={
                                plan.adjustmentType == 'PERCENTAGE' ? '%' : ''
                              }
                            />
                          </FormLayout.Group>
                          <TextContainer>
                            <br />
                            <Subheading>Delivery Rules</Subheading>
                          </TextContainer>
                          <FormLayout.Group>
                            <Select
                              label="Interval"
                              value={
                                plan.deliveryIntervalCount === null
                                  ? initialValues.deliveryIntervalCount
                                  : plan.deliveryIntervalCount
                              }
                              error={
                                touched.sellingPlans?.[index]
                                  ?.deliveryIntervalCount &&
                                errors.sellingPlans?.[index]
                                  ?.deliveryIntervalCount
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `sellingPlans[${index}].deliveryIntervalCount`,
                                  e
                                )
                              }
                              options={options}
                            />
                            <Select
                              options={interOptions}
                              label="  "
                              value={
                                plan.deliveryIntervalType === null
                                  ? initialValues.deliveryIntervalType
                                  : plan.deliveryIntervalType
                              }
                              error={
                                touched.sellingPlans?.[index]
                                  ?.deliveryIntervalType &&
                                errors.sellingPlans?.[index]
                                  ?.deliveryIntervalType
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `sellingPlans[${index}].deliveryIntervalType`,
                                  e
                                )
                              }
                            />
                          </FormLayout.Group>
                          <br />
                          {/* Trial Period */}
                          <TextContainer>
                            <Subheading>TRIAL PERIOD</Subheading>
                          </TextContainer>
                          <FormLayout.Group>
                            <Select
                              label="Interval"
                              value={plan.trialIntervalCount}
                              error={
                                touched.sellingPlans?.[index]
                                  ?.trialIntervalCount &&
                                errors.sellingPlans?.[index]?.trialIntervalCount
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `sellingPlans[${index}].trialIntervalCount`,
                                  e
                                )
                              }
                              options={options}
                            />
                            <Select
                              options={interOptions}
                              label="  "
                              value={plan.trialIntervalType}
                              error={
                                touched.sellingPlans?.[index]
                                  ?.trialIntervalType &&
                                errors.sellingPlans?.[index]?.trialIntervalType
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `sellingPlans[${index}].trialIntervalType`,
                                  e
                                )
                              }
                            />
                          </FormLayout.Group>
                          <FormLayout.Group>
                            <Select
                              options={adjusmentOptions}
                              label="Trial or manual price"
                              value={plan.trialAdjustmentType}
                              error={
                                touched.sellingPlans?.[index]
                                  ?.trialAdjustmentType &&
                                errors.sellingPlans?.[index]
                                  ?.trialAdjustmentType
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `sellingPlans[${index}].trialAdjustmentType`,
                                  e
                                )
                              }
                            />
                            <TextField
                              disabled={plan.trialAdjustmentType == ''}
                              type="number"
                              label="Adjustment value"
                              value={plan.trialAdjustmentValue}
                              error={
                                touched.sellingPlans?.[index]
                                  ?.adjustmentValue &&
                                errors.sellingPlans?.[index]
                                  ?.trialAdjustmentValue
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `sellingPlans[${index}].trialAdjustmentValue`,
                                  e
                                )
                              }
                              prefix={
                                plan.adjustmentType == 'PERCENTAGE' ? '' : '$'
                              }
                              suffix={
                                plan.adjustmentType == 'PERCENTAGE' ? '%' : ''
                              }
                            />
                          </FormLayout.Group>
                          <br />
                          {/* Build A Box */}
                          <TextContainer>
                            <Subheading>BUILD-A-BOX CONFIGURATION</Subheading>
                          </TextContainer>
                          <FormLayout.Group>
                            <div className="box-subscription-detail">
                              {/* <Select
                                    className="box-subscription-align"
                                    label="Display Quantity ?"
                                    value={plan.boxIsQuantity}
                                    error={
                                      touched.sellingPlans?.[index]?.boxIsQuantity &&
                                      errors.sellingPlans?.[index]?.boxIsQuantity
                                    }
                                    onChange={(e) => {
                                      setFieldValue(
                                        `sellingPlans[${index}].boxIsQuantity`,
                                        (e === 'true')
                                      )}
                                    }
                                    options={boxQuantityOptions}
                                  /> */}
                              <TextField
                                label="Limit Options"
                                value={plan.boxQuantityLimit.toString()}
                                disabled={
                                  !plan.boxIsQuantity ||
                                  !plan.boxIsQuantityLimited
                                }
                                error={
                                  touched.sellingPlans?.[index]
                                    ?.boxQuantityLimit &&
                                  errors.sellingPlans?.[index]?.boxQuantityLimit
                                }
                                type="number"
                                onChange={(e) => {
                                  setFieldValue(
                                    `sellingPlans[${index}].boxQuantityLimit`,
                                    parseInt(e)
                                  );
                                }}
                              // placeholder="1"
                              />
                            </div>
                          </FormLayout.Group>
                          <FormLayout.Group>
                            <Checkbox
                              label="Sort box choices by collection"
                              checked={plan.boxSubscriptionType === 1}
                              error={
                                touched.sellingPlans?.[index]
                                  ?.boxSubscriptionType &&
                                errors.sellingPlans?.[index]
                                  ?.boxSubscriptionType
                              }
                              onChange={(e) => {
                                setFieldValue(
                                  `sellingPlans[${index}].boxSubscriptionType`,
                                  e === true ? 1 : 0
                                );
                              }}
                            />
                            <Checkbox
                              label="Display box choices by products"
                              checked={plan.boxSubscriptionType === 2}
                              error={
                                touched.sellingPlans?.[index]
                                  ?.boxSubscriptionType &&
                                errors.sellingPlans?.[index]
                                  ?.boxSubscriptionType
                              }
                              onChange={(e) => {
                                setFieldValue(
                                  `sellingPlans[${index}].boxSubscriptionType`,
                                  e === true ? 2 : 0
                                );
                              }}
                            />
                          </FormLayout.Group>
                          <FormLayout.Group>
                            {plan.boxSubscriptionType === 1 && (
                              <div className="box-subscription-search">
                                <TextContainer>Collection</TextContainer>
                                <SearchCollection
                                  selectedOptions={selectedCollectionOptions}
                                  setSelectedOptions={
                                    setSelectedCollectionOptions
                                  }
                                  selectedCollections={selectedCollections}
                                  setSelectedCollections={
                                    setSelectedCollections
                                  }
                                />
                              </div>
                            )}
                            {plan.boxSubscriptionType === 2 && (
                              <div className="box-subscription-search">
                                <TextContainer>Product</TextContainer>
                                <SearchProduct
                                  selectedOptions={selectedProductOptions}
                                  setSelectedOptions={setSelectedProductOptions}
                                  selectedProducts={selectedProducts}
                                  setSelectedProducts={setSelectedProducts}
                                />
                              </div>
                            )}
                          </FormLayout.Group>
                          {plan.boxSubscriptionType === 1 && (
                            <div className="collection-stack">
                              {selectedCollections.map(
                                (collection, i) =>
                                  collection._destroy === false && (
                                    <div
                                      key={i}
                                      className="building-box-collection"
                                    >
                                      <div>{collection?.collectionTitle}</div>
                                      <Stack>
                                        {collection.products?.map(
                                          (product, j) =>
                                            product._destroy === false && (
                                              <div
                                                key={j}
                                                className="building-box-product"
                                              >
                                                <img
                                                  className="product"
                                                  src={product?.image}
                                                />
                                                <img
                                                  className="removeIcon"
                                                  onClick={() => {
                                                    handleRemoveCollectionProduct(
                                                      i,
                                                      j
                                                    );
                                                  }}
                                                  src={removeIcon}
                                                />
                                              </div>
                                            )
                                        )}
                                      </Stack>
                                    </div>
                                  )
                              )}
                            </div>
                          )}
                          {plan.boxSubscriptionType === 2 && (
                            <div className="product-stack">
                              <div>
                                Selected products (subscription box options)
                              </div>
                              <Stack>
                                {selectedProducts.map(
                                  (product, i) =>
                                    product._destroy === false && (
                                      <div
                                        key={i}
                                        className="building-box-product"
                                      >
                                        <img
                                          className="product"
                                          src={product?.image}
                                        />
                                        <img
                                          onClick={() => {
                                            handleRemoveProduct(i);
                                          }}
                                          className="removeIcon"
                                          src={removeIcon}
                                        />
                                      </div>
                                    )
                                )}
                              </Stack>
                            </div>
                          )}

                          <TextContainer>
                            <br />
                            <p>
                              <strong style={{ fontWeight: '600' }}>
                                MANUAL RULES
                              </strong>
                              <i> pro</i>{' '}
                            </p>
                          </TextContainer>
                          <FormLayout.Group>
                            <div className="muti-input-wrapper">
                              <div className="date-input">
                                {checkDates(
                                  setFieldValue,
                                  values.sellingPlans[index],
                                  selectedDate,
                                  `sellingPlans[${index}]`
                                )}
                                <label> Specific billing date </label>
                                <DatePickr
                                  handleDate={setDate}
                                  type={'billingDate'}
                                  index={index}
                                  date={selectedDate}
                                  callback={setFieldValue}
                                  selectedDate={
                                    values.sellingPlans[index]?.billingDates[0]
                                  }
                                  input={`sellingPlans[${index}].billingDates`}
                                  existingValues={
                                    values.sellingPlans[index]?.billingDates
                                  }
                                  setUpdated={setUpdated}
                                />
                              </div>
                              <div className="date-list-items">
                                {values.sellingPlans[index]?.billingDates.map(
                                  (date, i) => (
                                    <div
                                      key={`billing-date-${i}`}
                                      className="date-input-group"
                                    >
                                      <label> Next billing date: </label>
                                      <div className="date-item-wrapper">
                                        <p>
                                          {dayjs(date, 'YYYY-MM-DD').format(
                                            'MMM DD, YYYY'
                                          )}
                                        </p>
                                        <img
                                          className="pointer"
                                          src={DeleteSVG}
                                          onClick={() => {
                                            setFieldValue(
                                              `sellingPlans[${index}].billingDates`,
                                              removeDate(
                                                values.sellingPlans[index]
                                                  ?.billingDates,
                                                i
                                              )
                                            );
                                            removeSelectedDate(
                                              'billingDate',
                                              index,
                                              values.sellingPlans[index]
                                            );
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                              {values.sellingPlans[index]?.billingDates.length >
                                0 && (
                                  <div className="add-date-btn">
                                    <Button
                                      primary
                                      onClick={() =>
                                        clearDate('billingDate', index)
                                      }
                                    >
                                      + Add
                                    </Button>
                                  </div>
                                )}
                            </div>
                            <div className="muti-input-wrapper">
                              <div className="date-input">
                                <label> Specific shipping date </label>
                                <DatePickr
                                  handleDate={setDate}
                                  type={'shippingDate'}
                                  date={selectedDate}
                                  index={index}
                                  callback={setFieldValue}
                                  selectedDate={
                                    values.sellingPlans[index]?.shippingDates[0]
                                  }
                                  input={`sellingPlans[${index}].shippingDates`}
                                  existingValues={
                                    values.sellingPlans[index]?.shippingDates
                                  }
                                  setUpdated={setUpdated}
                                />
                              </div>
                              <div className="date-list-items">
                                {values.sellingPlans[index]?.shippingDates.map(
                                  (date, i) => (
                                    <div
                                      key={`shipping-date-${i}`}
                                      className="date-input-group"
                                    >
                                      <label> Next shipping date: </label>
                                      <div className="date-item-wrapper">
                                        <p>
                                          {dayjs(date, 'YYYY-MM-DD').format(
                                            'MMM DD, YYYY'
                                          )}
                                        </p>
                                        <img
                                          className="pointer"
                                          src={DeleteSVG}
                                          onClick={() => {
                                            setFieldValue(
                                              `sellingPlans[${index}].shippingDates`,
                                              removeDate(
                                                values.sellingPlans[index]
                                                  ?.shippingDates,
                                                i
                                              )
                                            );
                                            removeSelectedDate(
                                              'shippingDate',
                                              index,
                                              values.sellingPlans[index]
                                            );
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )
                                )}
                                {values.sellingPlans[index]?.shippingDates
                                  .length > 0 && (
                                    <div className="add-date-btn">
                                      <Button
                                        primary
                                        onClick={() =>
                                          clearDate('shippingDate', index)
                                        }
                                      >
                                        + Add
                                      </Button>
                                    </div>
                                  )}
                              </div>
                              <div>
                                <Select
                                  value={plan.shippingCutOff}
                                  label="Cutoff days"
                                  error={
                                    touched.sellingPlans?.[index]
                                      ?.shippingCutOff &&
                                    errors.sellingPlans?.[index]?.shippingCutOff
                                  }
                                  onChange={(e) =>
                                    setFieldValue(
                                      `sellingPlans[${index}].shippingCutOff`,
                                      Number(e)
                                    )
                                  }
                                  options={shippingCutOffOptions}
                                />

                                <Select
                                  label="First Delivery"
                                  value={plan.firstDelivery}
                                  error={
                                    touched.sellingPlans?.[index]
                                      ?.firstDelivery &&
                                    errors.sellingPlans?.[index]?.firstDelivery
                                  }
                                  onChange={(e) =>
                                    setFieldValue(
                                      `sellingPlans[${index}].firstDelivery`,
                                      e
                                    )
                                  }
                                  options={firstDeliveryOptions}
                                />
                              </div>
                            </div>
                          </FormLayout.Group>
                        </FormLayout>
                        <br />
                      </Card>
                    </div>
                  ))}
                </Form>
              )}
            </Formik>
          )}
        </Page>
      </Frame>
    </LayoutIndex>
  );
};

export default BuildABoxPlan;
