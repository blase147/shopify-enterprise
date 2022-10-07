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
  Spinner,
  ButtonGroup,
} from '@shopify/polaris';
import DeleteSVG from '../../../assets/images/delete.svg';
import React, { useState, useCallback, useEffect } from 'react';
import { Formik } from 'formik';
import _, { isEmpty } from 'lodash';
import * as yup from 'yup';

import AppLayout from '../layout/Layout';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import { Link, useHistory, useParams } from 'react-router-dom';
import DatePickr from '../common/DatePicker/DatePickr';
import './fixedplan.css';
import { getDate } from 'javascript-time-ago/gradation';
import dayjs from 'dayjs';
import SearchProduct from '../upsell/SearchProduct';
import Preview from './Preview';
import SearchVariants from './SearchVariants';
import LoadingScreen from '../LoadingScreen';

const FixedPlan = () => {
  const GET_SELLING_PLAN = gql`
    query ($id: ID!) {
      fetchPlanGroup(id: $id) {
        id
        publicName
        internalName
        planSelectorTitle
        active
        productIds {
          productId
          title
          image
          _destroy
        }
        variantIds {
          variantId
          title
          image
          _destroy
        }
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
          deliveryIntervalType
          deliveryIntervalCount
          description
          trialAdjustmentValue
          trialAdjustmentType
          trialIntervalType
          trialIntervalCount
          billingDates
          shippingDates
          shippingCutOff
          firstDelivery
          _destroy
        }
      }
    }
  `;
  const { id } = useParams();
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

  const initialValues = {
    name: '',
    selectorLabel: '',
    description: '',
    intervalCount: '1',
    intervalType: 'DAY',
    deliveryIntervalType: 'DAY',
    deliveryIntervalCount: '1',
    minFullfilment: '1',
    maxFullfilment: '1',
    adjustmentType: 'FIXED_AMOUNT',
    adjustmentValue: '0',
    trialIntervalCount: '',
    trialIntervalType: 'DAY',
    trialAdjustmentType: 'FIXED_AMOUNT',
    trialAdjustmentValue: '0',
    billingDates: [],
    shippingDates: [],
    firstDelivery: 'ASAP',
    shippingCutOff: 1,
    _destroy: false,
  };

  const [formErrors, setFormErrors] = useState([]);
  const [planData, setPlanData] = useState(null);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);

  const handleRemovingSellingPlan = useCallback((values, index) => {
    const plans = [...(values.sellingPlans || [])];
    plans[index]._destroy = true;
    return plans;
  });

  const [allProducts, setAllProducts] = useState([]);
  const [allVarients, setAllVarients] = useState([]);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (data) {
      setPlanData(data.fetchPlanGroup);

      // let products=[];
      // let variants=[];
      // data?.fetchPlanGroup?.sellingPlans.forEach(plan=>{
      //   products.push(plan.productIds || []);
      //   variants.push(plan.variantIds || []);
      // })
      setAllProducts(data.fetchPlanGroup.productIds || []);
      setAllVarients(data.fetchPlanGroup.variantIds || []);
    }
  }, [data]);

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

  // const [selectedBillingDate,setSelectedBillingDate]=useState('');
  // const setBillingDate=useCallback((date)=>{
  //   setSelectedBillingDate(date)
  // },[selectedBillingDate])

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
  //Biiling Dates
  const getDate = (dates) => {
    if (dates) {
      dates.push(dayjs(selectedBillingDate).format('YYYY-MM-DD'));
    } else {
      dates = [dayjs(selectedBillingDate).format('YYYY-MM-DD')];
    }
    return dates;
  };
  //Shipping Dates
  const getShippingDate = (dates) => {
    if (dates) {
      dates.push(dayjs(selectedShippingDate).format('YYYY-MM-DD'));
    } else {
      dates = [dayjs(selectedShippingDate).format('YYYY-MM-DD')];
    }
    return dates;
  };
  const removeDate = (dates, index) => {
    if (dates) {
      dates.splice(index, 1);
      setUpdated(true);
    }
    return [...dates];
  };
  const handleAddSellingPlan = useCallback((values) => {
    let dates = selectedDate;
    dates.push({ shippingDate: '', billingDate: '' });
    setSelectedDate(dates);
    //
    const plans = [...(values.sellingPlans || [])];
    initialValues.billingDates = [];
    initialValues.shippingDates = [];
    plans.push({ ...initialValues });
    return plans;
  });

  return (
    <AppLayout typePage="sellingPlanForm" tabIndex={1}>
      <Frame>
        <Page
          title={id ? 'Update selling plan' : 'Create selling plan'}
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
              validationSchema={validationSchema}
              initialValues={
                planData
                  ? planData
                  : {
                    internalName: '',
                    planSelectorTitle: '',
                    publicName: '',
                    active: true,
                    productIds: [],
                    variantIds: [],
                    sellingPlans: [{ ...initialValues }],
                  }
              }
              onSubmit={(values, { setSubmitting, setDirty }) => {
                values.productIds = allProducts || [];
                values.variantIds = allVarients || [];

                values.sellingPlans.forEach((plan, index) => {
                  values.sellingPlans[index].deliveryIntervalCount =
                    values.sellingPlans[index].deliveryIntervalCount ||
                    initialValues.deliveryIntervalCount;
                  values.sellingPlans[index].deliveryIntervalType =
                    values.sellingPlans[index].deliveryIntervalType ||
                    initialValues.deliveryIntervalType;
                  if (!plan.firstDelivery && plan.shippingDates && plan.shippingDates.length > 0) {
                    values.sellingPlans[index].firstDelivery = initialValues.firstDelivery;
                  }
                  // values.sellingPlans[index].productIds = allProducts[index] || [];
                  // values.sellingPlans[index].variantIds = allVarients[index] || [];
                });
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
                          planType: 'fixed_price',
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
                setTouched,
                /* and other goodies */
              }) => (
                <Form onSubmit={handleSubmit}>
                  {(dirty || updated) && (
                    <ContextualSaveBar
                      alignContentFlush={true}
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
                      <br />
                      <FormLayout.Group>
                        <p className="card-offer">PRODUCT</p>
                        <div></div>
                      </FormLayout.Group>

                      <FormLayout.Group>
                        <div className="product-search">
                          <SearchProduct
                            value={values.productIds || [[]]}
                            setFieldValue={setFieldValue}
                            fieldName={`productIds`}
                            allProducts={allProducts || [[]]}
                            setAllProducts={setAllProducts}
                            error={
                              touched.productIds?.productId &&
                              errors.productIds?.productId
                            }
                          />
                        </div>
                      </FormLayout.Group>
                      <Preview
                        isUpdate={!isEmpty(id)}
                        allProducts={allProducts || [[]]}
                        setAllProducts={setAllProducts}
                        setUpdated={setUpdated}
                      />

                      <FormLayout.Group>
                        <p className="card-offer">Variants</p>
                        <div></div>
                      </FormLayout.Group>

                      <FormLayout.Group>
                        <div className="product-search">
                          <SearchVariants
                            value={values.variantIds || [[]]}
                            setFieldValue={setFieldValue}
                            fieldName={`variantIds`}
                            allVariants={allVarients || [[]]}
                            setAllVarients={setAllVarients}
                            error={
                              touched.variantIds?.variantId &&
                              errors.variantIds?.variantId
                            }
                          />
                        </div>
                      </FormLayout.Group>
                      <Preview
                        isUpdate={!isEmpty(id)}
                        allProducts={allVarients || [[]]}
                        setAllProducts={setAllVarients}
                        setUpdated={setUpdated}
                      />
                    </FormLayout>
                  </Card>

                  {values.sellingPlans.map((plan, index) => (
                    <div
                      className={plan._destroy ? 'hidden' : 'itemPlan'}
                      key={index}
                    >
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
                                  let dates = selectedDate.slice(index, 1);
                                  setSelectedDate(dates);
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
                            <p></p>
                          </FormLayout.Group>
                          <TextContainer>
                            <br />
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
                              disabled={plan.adjustmentType == ''}
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
                              value={plan.deliveryIntervalCount === null ? initialValues.deliveryIntervalCount : plan.deliveryIntervalCount}
                              error={
                                touched.sellingPlans?.[index]?.deliveryIntervalCount &&
                                errors.sellingPlans?.[index]?.deliveryIntervalCount
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
                              value={plan.deliveryIntervalType === null ? initialValues.deliveryIntervalType : plan.deliveryIntervalType}
                              error={
                                touched.sellingPlans?.[index]?.deliveryIntervalType &&
                                errors.sellingPlans?.[index]?.deliveryIntervalType
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  `sellingPlans[${index}].deliveryIntervalType`,
                                  e
                                )
                              }
                            />
                          </FormLayout.Group>

                          <TextContainer>
                            <br />
                            <Subheading>TRIAL PERIOD</Subheading>
                          </TextContainer>
                          <FormLayout.Group>
                            <Select
                              label="Trial Cycles"
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
                              options={optionsWithNone}
                            />
                            {/* <Select
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
                            /> */}
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
                              disabled={plan.trialIntervalCount == ''}
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
                                plan.trialAdjustmentType == 'PERCENTAGE' ? '' : '$'
                              }
                              suffix={
                                plan.trialAdjustmentType == 'PERCENTAGE' ? '%' : ''
                              }
                            />
                          </FormLayout.Group>
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
                              <div>
                                <div className="date-input">
                                  <label> Specific billing date </label>
                                  <DatePickr
                                    handleDate={setDate}
                                    type={'billingDate'}
                                    index={index}
                                    date={selectedDate}
                                    callback={setFieldValue}
                                    selectedDate={
                                      values.sellingPlans[index]
                                        ?.billingDates[0]
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
                                      <div className="date-input-group">
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
                                {values.sellingPlans[index]?.billingDates
                                  .length > 0 && (
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

                              {/* <div>
                                {console.log('Plan', plan)}
                                <Select
                                  value={plan.billingCutOff}
                                  label="Cutoff days"
                                  error={
                                    touched.sellingPlans?.[index]
                                      ?.billingCutOff &&
                                    errors.sellingPlans?.[index]?.billingCutOff
                                  }
                                  onChange={(e) =>
                                    setFieldValue(
                                      `sellingPlans[${index}].billingCutOff`,
                                      e
                                    )
                                  }
                                  options={billingCutOffOptions}
                                />

                                <Select
                                  label="First Billing"
                                  value={plan.firstBilling}
                                  error={
                                    touched.sellingPlans?.[index]
                                      ?.firstBilling &&
                                    errors.sellingPlans?.[index]?.firstBilling
                                  }
                                  onChange={(e) =>
                                    setFieldValue(
                                      `sellingPlans[${index}].firstBilling`,
                                      e
                                    )
                                  }
                                  options={firstBillingOptions}
                                />
                              </div> */}
                            </div>
                            <div className="muti-input-wrapper">
                              <div>
                                <div className="date-input">
                                  <label> Specific shipping date </label>
                                  <DatePickr
                                    handleDate={setDate}
                                    type={'shippingDate'}
                                    date={selectedDate}
                                    index={index}
                                    callback={setFieldValue}
                                    selectedDate={
                                      values.sellingPlans[index]
                                        ?.shippingDates[0]
                                    }
                                    input={`sellingPlans[${index}].shippingDates`}
                                    existingValues={
                                      values.sellingPlans[index]?.shippingDates
                                    }
                                    setUpdated={setUpdated}
                                  />
                                </div>
                                <div className="date-list-items">
                                  {values.sellingPlans[
                                    index
                                  ]?.shippingDates.map((date, i) => (
                                    <div className="date-input-group">
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
                                  ))}
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
                                      errors.sellingPlans?.[index]
                                        ?.shippingCutOff
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
                                      errors.sellingPlans?.[index]
                                        ?.firstDelivery
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
                            </div>
                          </FormLayout.Group>
                        </FormLayout>
                      </Card>
                    </div>
                  ))}

                  <br />
                  <div className="addSellingPlans">
                    <Button
                      plain
                      onClick={() => {
                        setFieldValue(
                          'sellingPlans',
                          handleAddSellingPlan(values)
                        );
                      }}
                    >
                      Add selling plan
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

export default FixedPlan;
