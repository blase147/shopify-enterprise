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
  DataTable,
  Toast,
  Banner,
  List,
  Page,
  Spinner,
  ButtonGroup,
  Stack,
  Layout,
  Link,
  Heading,
  TextStyle,
} from '@shopify/polaris';
import DeleteSVG from '../../../assets/images/delete.svg';
import ClipboardSVG from '../../../assets/images/clipboard.svg';
import TotalRevenueSVG from '../../../assets/images/total_revenue.svg';
import BillingFrequencySVG from '../../../assets/images/billing_frequency.svg';
import DeliveryScheduleSVG from '../../../assets/images/delivery_schedule.svg';
import React, { useState, useCallback, useEffect } from 'react';
import { Formik } from 'formik';
import _, { isEmpty } from 'lodash';
import * as yup from 'yup';

import AppLayout from '../layout/Layout';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';
import DatePickr from '../common/DatePicker/DatePickr';
import './fixedplan.css';
import { getDate } from 'javascript-time-ago/gradation';
import dayjs from 'dayjs';
import SearchProduct from '../upsell/SearchProduct';
import Preview from './Preview';
import SearchVariants from './SearchVariants';

const PowerView = () => {
  const GET_SELLING_PLAN = gql`
    query ($id: ID!) {
      fetchPowerPlanGroup(id: $id) {
        id

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
          shopifyId
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

          totalAmount
          activeSubscriptions
          orders{
            id
            displayFulfillmentStatus
            name
            customer
            amount
            createdAt
          }
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
  console.log('Aloha from power view');
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

  const [selectedProducts, setSelectedProducts] = useState([]);
  useEffect(() => {
    if (data) {
      setPlanData(data.fetchPowerPlanGroup);

      // let products=[];
      // let variants=[];
      // data?.fetchPowerPlanGroup?.sellingPlans.forEach(plan=>{
      //   products.push(plan.productIds || []);
      //   variants.push(plan.variantIds || []);
      // })

      setAllProducts(data.fetchPowerPlanGroup.productIds || []);
      setAllVarients(data.fetchPowerPlanGroup.variantIds || []);
      setSelectedProducts(
        data.fetchPowerPlanGroup.sellingPlans.map(
          (p) => data.fetchPowerPlanGroup.productIds?.[0]?.productId
        )
      );
    }
  }, [data]);

  const validationSchema = yup.object().shape({
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
  const formatRows = (rows) => {
    return rows?.map((row) => [
      <Checkbox
        label={false}
        checked={selectedPlansForRemove.indexOf(row.id) != -1}
        onChange={(newChecked) => handleChangeCheckedPlans(newChecked, row.id)}
      />,
      <div className="plans">
        <div className={`${row.active ? 'active' : 'draft'}`}>
          <Badge>{row.active ? 'Active' : 'Draft'}</Badge>
        </div>
        <Link to={`/${generateLink(row.planType)}/${row.id}`} key={row.id}>
          {row.name}
        </Link>
      </div>,
      `${row.sellingPlans[0].intervalCount} ${capitalize(row.sellingPlans[0].intervalType)}`,
      row.price,
      row.subscriptionModel,
      row.planType === 'fixed_price'
        ? '0 Days'
        : `${row.sellingPlans[0].trialIntervalCount} ${capitalize(row.sellingPlans[0].trialIntervalType)}`,
    ]);
  }
  return (
    <AppLayout tabIndex={1}>
      <Frame>
        <Page
          title="Power View"
          breadcrumbs={[
            {
              content: 'Plan Lists',
              onAction: () => history.push('/subscription-plans'),
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
          {planData && (
            <Formik
              validationSchema={validationSchema}
              initialValues={planData}
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
                  if (
                    !plan.firstDelivery &&
                    plan.shippingDates &&
                    plan.shippingDates.length > 0
                  ) {
                    values.sellingPlans[index].firstDelivery =
                      initialValues.firstDelivery;
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

                  {values.sellingPlans.map((plan, index) => (
                    <div className={'powerItemPlan'} key={index}>
                      <Layout>
                        <Layout.Section>
                          <Card sectioned>
                            <Stack>
                              <Stack.Item>
                                <Heading>{plan.name}</Heading>
                                <TextStyle variation="subdued">
                                  Active Since 2 months ago
                                </TextStyle>
                              </Stack.Item>
                              <Stack.Item fill></Stack.Item>
                              <Stack.Item>
                                <>
                                  <TextStyle variation="strong">Selling Plan Id:</TextStyle>
                                  <br />
                                  <TextStyle variation="subdued">
                                    {plan?.shopifyId?.match(/\d+/)?.[0]}
                                  </TextStyle>
                                </>
                              </Stack.Item>
                            </Stack>
                            <br />
                            <div
                              style={{

                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Select
                                options={allProducts.map((product) => {
                                  return {
                                    label: product.title,
                                    value: product.productId,
                                  };
                                })}
                                value={selectedProducts[index]}
                                onChange={(e) => {
                                  const temp = [...selectedProducts];
                                  temp[index] = e;
                                  setSelectedProducts(temp);
                                }}
                              ></Select>

                              <Link>Pause</Link>
                            </div>
                            <br />
                            <Stack>
                              <Button primary>Swap Product</Button>
                              <Button outline>Edit Subscription</Button>
                              <Button>Cancel</Button>
                            </Stack>
                          </Card>
                        </Layout.Section>
                        <Layout.Section secondary>
                          <Card title="Total Revenue to Date:" sectioned>
                            <TextStyle variation="subdued">${plan.totalAmount}</TextStyle>
                          </Card>
                        </Layout.Section>
                      </Layout>
                      <br />
                      <br />
                      <Card sectioned>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Stack>
                            <img src={ClipboardSVG} />
                            <>
                              <Heading>Active Subs</Heading>
                              <p>{plan.activeSubscriptions}</p>
                            </>
                          </Stack>

                          <Stack>
                            <img src={TotalRevenueSVG} />
                            <>
                              <Heading>Total Revenue</Heading>
                              <p>${plan.totalAmount}</p>
                            </>
                          </Stack>

                          <Stack>
                            <img src={BillingFrequencySVG} />
                            <>
                              <Heading>Billing Frequency</Heading>
                              <p>{plan.intervalCount} {plan.intervalType}</p>
                            </>
                          </Stack>

                          <Stack>
                            <img src={DeliveryScheduleSVG} />
                            <>
                              <Heading>Delivery Schedule</Heading>
                              <p>{plan.deliveryIntervalCount} {plan.deliveryIntervalType}</p>
                            </>
                          </Stack>
                        </div>
                      </Card>
                      <br />
                      <Card sectioned>
                        <DataTable
                          columnContentTypes={[
                            'text',
                            'text',
                            'text',
                            'text',
                            'text',
                            'text',
                          ]}
                          headings={[
                            '',
                            'Number',
                            'Name',
                            'Date Created',
                            'Status',
                            'Total Spend',
                          ]}
                          rows={plan.orders.map(o => ['', o.name, o.customer, o.createdAt, o.displayFulfillmentStatus, `$${o.amount}`])}
                          sortable={[false, false, true, false, false, false]}
                          defaultSortDirection="descending"
                          initialSortColumnIndex={1}
                        />
                      </Card>
                    </div>
                  ))}
                </Form>
              )}
            </Formik>
          )}
        </Page>
      </Frame>
    </AppLayout>
  );
};

export default PowerView;
