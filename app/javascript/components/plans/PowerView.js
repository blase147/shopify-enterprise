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
  Modal,
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
import LoadingScreen from '../LoadingScreen';

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
          orders {
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

  const [sellingPlanIndex, setSellingPlanIndex] = useState(0);
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
  const plan = planData?.sellingPlans?.[sellingPlanIndex];

  const [cancelModal, setCancelModal] = useState(false);
  const handleCancel = () => {
    setCancelModal(!cancelModal);
  };
  const cancelBtn = <Button onClick={handleCancel}>Cancel</Button>;

  const [pauseModal, setPauseModal] = useState(false);
  const handlePause = () => {
    setPauseModal(!pauseModal);
  };
  const pauseBtn = <Button onClick={handlePause}>Pause</Button>;

  const [swapModal, setSwapModal] = useState(false);
  const handleSwap = () => {
    setSwapModal(!swapModal);
  };
  const swapBtn = (
    <Button
      primary
      onClick={() => {
        var ResourcePicker = window['app-bridge'].actions.ResourcePicker;
        var productPicker = ResourcePicker.create(window.app, {
          resourceType: ResourcePicker.ResourceType.Product,
          options: {
            actionVerb: ResourcePicker.ActionVerb.Select,
            selectMultiple: false,
          },
        });
        productPicker.dispatch(ResourcePicker.Action.OPEN);
        productPicker.subscribe(
          ResourcePicker.Action.SELECT,
          ({ selection }) => {
            if (
              selection &&
              selection.length > 0 &&
              selection[0].variants &&
              selection[0].variants.length > 0
            ) {
              fetch(`/power_plans/${plan.id}/swap`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  original_product: selectedProducts[sellingPlanIndex],
                  swap_with: selection[0].variants[0].id,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.success == true) {
                    var Toast = window['app-bridge'].actions.Toast;
                    Toast.create(window.app, {
                      message: 'Swapping',
                      duration: 5000,
                    }).dispatch(Toast.Action.SHOW);
                  }
                });
            } else {
              var Toast = window['app-bridge'].actions.Toast;
              Toast.create(window.app, {
                message: 'Select 1 variant',
                duration: 5000,
                isError: true,
              }).dispatch(Toast.Action.SHOW);
            }
          }
        );
      }}
    >
      Swap Product
    </Button>
  );
  return (
    <>
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
            <LoadingScreen />
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

                  <div className={'powerItemPlan'}>
                    <Layout>
                      <Layout.Section>
                        <Card sectioned>
                          <Stack>
                            <Stack.Item>
                              <Heading>{plan.name}</Heading>
                            </Stack.Item>
                            <Stack.Item fill></Stack.Item>
                            <Stack.Item>
                              <>
                                <TextStyle variation="strong">
                                  Selling Plan Id:
                                </TextStyle>
                                <br />
                                <TextStyle variation="subdued">
                                  {plan?.shopifyId?.match(/\d+/)?.[0]}
                                </TextStyle>
                              </>
                            </Stack.Item>
                          </Stack>
                          <br />
                          <Select
                            options={allProducts.map((product) => {
                              return {
                                label: product.title,
                                value: product.productId,
                              };
                            })}
                            value={selectedProducts[sellingPlanIndex]}
                            onChange={(e) => {
                              const temp = [...selectedProducts];
                              temp[sellingPlanIndex] = e;
                              setSelectedProducts(temp);
                            }}
                          />
                          <br />
                          <Stack>
                            <Modal
                              activator={swapBtn}
                              open={swapModal}
                              onClose={handleSwap}
                              title="This change will affect all Subscriptions that have this selling plan used."
                              primaryAction={{
                                content: 'Continue',
                                onAction: () => {
                                  fetch(`/power_plans/${plan.id}/swap`, {
                                    method: 'POST',
                                  })
                                    .then((response) => response.json())
                                    .then((data) => {
                                      if (data.success == true) {
                                        var Toast =
                                          window['app-bridge'].actions.Toast;
                                        Toast.create(window.app, {
                                          message: 'Swapping',
                                          duration: 5000,
                                        }).dispatch(Toast.Action.SHOW);
                                        handleSwap();
                                      }
                                    });
                                },
                              }}
                              secondaryActions={[
                                {
                                  content: 'Back',
                                  onAction: handleSwap,
                                },
                              ]}
                            >
                              <Modal.Section>
                                <TextContainer>
                                  <p>
                                    This will cause all Subscriptions that have
                                    this selling plan to become cancelled.
                                  </p>
                                </TextContainer>
                              </Modal.Section>
                            </Modal>

                            <Modal
                              activator={cancelBtn}
                              open={cancelModal}
                              onClose={handleCancel}
                              title="This change will affect all Subscriptions that have this selling plan used."
                              primaryAction={{
                                content: 'Continue',
                                onAction: () => {
                                  fetch(`/power_plans/${plan.id}/cancel`, {
                                    method: 'POST',
                                  })
                                    .then((response) => response.json())
                                    .then((data) => {
                                      if (data.success == true) {
                                        var Toast =
                                          window['app-bridge'].actions.Toast;
                                        Toast.create(window.app, {
                                          message: 'Cancelling',
                                          duration: 5000,
                                        }).dispatch(Toast.Action.SHOW);
                                        handleCancel();
                                      }
                                    });
                                },
                              }}
                              secondaryActions={[
                                {
                                  content: 'Back',
                                  onAction: handleCancel,
                                },
                              ]}
                            >
                              <Modal.Section>
                                <TextContainer>
                                  <p>
                                    This will cause all Subscriptions that have
                                    this selling plan to become cancelled.
                                  </p>
                                </TextContainer>
                              </Modal.Section>
                            </Modal>
                            {/* <Button
                              onClick={(e) => {
                                fetch(`/power_plans/${plan.id}/cancel`, {
                                  method: 'POST',
                                })
                                  .then((response) => response.json())
                                  .then((data) => {
                                    if (data.sucess == true) {
                                      var Toast =
                                        window['app-bridge'].actions.Toast;
                                      Toast.create(window.app, {
                                        message: 'Cancelling',
                                        duration: 5000,
                                      }).dispatch(Toast.Action.SHOW);
                                    }
                                  });
                              }}
                            >
                              Cancel
                            </Button> */}
                            <Modal
                              activator={pauseBtn}
                              open={pauseModal}
                              onClose={handlePause}
                              title="This change will affect all Subscriptions that have this selling plan used."
                              primaryAction={{
                                content: 'Continue',
                                onAction: () => {
                                  fetch(`/power_plans/${plan.id}/pause`, {
                                    method: 'POST',
                                  })
                                    .then((response) => response.json())
                                    .then((data) => {
                                      if (data.success == true) {
                                        var Toast =
                                          window['app-bridge'].actions.Toast;
                                        Toast.create(window.app, {
                                          message: 'Pausing',
                                          duration: 5000,
                                        }).dispatch(Toast.Action.SHOW);
                                        handlePause();
                                      }
                                    });
                                },
                              }}
                              secondaryActions={[
                                {
                                  content: 'Back',
                                  onAction: handlePause,
                                },
                              ]}
                            >
                              <Modal.Section>
                                <TextContainer>
                                  <p>
                                    This will cause all Subscriptions that have
                                    this selling plan to become Paused.
                                  </p>
                                </TextContainer>
                              </Modal.Section>
                            </Modal>
                            <Stack.Item fill></Stack.Item>
                            <Select
                              options={values.sellingPlans.map((sp, i) => {
                                return {
                                  label: sp.name,
                                  value: i,
                                };
                              })}
                              value={parseInt(sellingPlanIndex)}
                              onChange={setSellingPlanIndex}
                            />
                          </Stack>
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
                            <p>
                              {plan.intervalCount} {plan.intervalType}
                            </p>
                          </>
                        </Stack>

                        <Stack>
                          <img src={DeliveryScheduleSVG} />
                          <>
                            <Heading>Delivery Schedule</Heading>
                            <p>
                              {plan.deliveryIntervalCount}{' '}
                              {plan.deliveryIntervalType}
                            </p>
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
                        ]}
                        headings={[
                          'Order Number',
                          'Customer',
                          'Date Created',
                          'Status',
                          'Total Spend',
                        ]}
                        rows={plan.orders.map((o) => [
                          o.name,
                          o.customer,
                          new Date(o.createdAt).toLocaleDateString(),
                          o.displayFulfillmentStatus,
                          `$${o.amount}`,
                        ])}
                        sortable={[false, false, true, false, false, false]}
                        defaultSortDirection="descending"
                        initialSortColumnIndex={1}
                      />
                    </Card>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </Page>
      </Frame>
    </>
  );
};

export default PowerView;
