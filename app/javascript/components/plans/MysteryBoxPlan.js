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
  Stack,
  Spinner,
} from '@shopify/polaris';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import _ from 'lodash';
import * as yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';
import LayoutIndex from '../layout/Layout';
import AppendProductsModal from './AppendProductsModal';

import { gql, useMutation, useLazyQuery } from '@apollo/client';

import removeIcon from '../../../assets/images/subscriptionsPlans/removeProduct.svg';
import LoadingScreen from '../LoadingScreen';

const MysteryBoxPlan = () => {
  const GET_SELLING_PLAN = gql`
    query($id: ID!) {
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
          trialAdjustmentValue
          trialAdjustmentType
          trialIntervalType
          trialIntervalCount
          mysteryDuration
          mysteryDurationValue
          productImages {
            productId
            image
            _destroy
          }
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

  const optionsWithNone = [...options];
  optionsWithNone.unshift({ value: '', label: 'None' });

  const interOptions = [
    { label: 'Day(s)', value: 'DAY' },
    { label: 'Week(s)', value: 'WEEK' },
    { label: 'Month(s)', value: 'MONTH' },
    { label: 'Year(s)', value: 'YEAR' },
  ];

  const adjusmentOptions = [
    { label: 'None', value: '' },
    { label: 'Fixed amount discount', value: 'FIXED_AMOUNT' },
    { label: 'Percentage discount', value: 'PERCENTAGE' },
    { label: 'Manual price', value: 'PRICE' },
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
      setSelectedOptions(() => {
        const defaultOption = [];
        data.fetchPlanGroup.sellingPlans[0].productImages?.map(
          (image) =>
            image._destroy == false && defaultOption.push(image.productId)
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
    adjustmentType: '',
    adjustmentValue: '0',
    _destroy: false,
    trialIntervalCount: '1',
    trialIntervalType: 'DAY',
    trialAdjustmentType: '',
    trialAdjustmentValue: '0',
    mysteryDuration: '1',
    mysteryDurationValue: '',
    productImages: [],
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
    mutation($input: UpdateSellingPlanGroupInput!) {
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
    mutation($input: AddSellingPlanGroupInput!) {
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
  const [activeModal, setActiveModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleRemoveProduct = (index) => {
    setSelectedProducts(() => {
      let newSelectedProduct = [...(selectedProducts || [])];
      newSelectedProduct[index]._destroy = true;
      return newSelectedProduct;
    });
    setSelectedOptions([
      ...selectedOptions.slice(0, index),
      ...selectedOptions.slice(index + 1),
    ]);
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
  return (
    <Frame>
      <Page
        title={
          id
            ? 'Update selling plan (Mystery Box)'
            : 'Create selling plan (Mystery Box)'
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
            enableReinitialize
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
                        planType: 'mystery_box',
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
                {dirty && (
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
                        ((!id && index != 0) || (id && values.sellingPlans.filter(p => !p._destroy).length > 1))
                          ? []
                          : [
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
                            label="% Discount or amount of original price"
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
                                ?.trialAdjustmentValue &&
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

                        {/* MYSTERY BOX*/}
                        <TextContainer>
                          <Subheading>MYSTERY BOX</Subheading>
                        </TextContainer>
                        <FormLayout.Group>
                          <Select
                            label="Duration of mystery box"
                            value={plan.mysteryDuration}
                            error={
                              touched.sellingPlans?.[index]
                                ?.mysteryDuration &&
                              errors.sellingPlans?.[index]?.mysteryDuration
                            }
                            onChange={(e) =>
                              setFieldValue(
                                `sellingPlans[${index}].mysteryDuration`,
                                e
                              )
                            }
                            options={options}
                          />
                          <Select
                            options={interOptions}
                            label="  "
                            value={plan.mysteryDurationValue}
                            error={
                              touched.sellingPlans?.[index]
                                ?.mysteryDurationValue &&
                              errors.sellingPlans?.[index]
                                ?.mysteryDurationValue
                            }
                            onChange={(e) =>
                              setFieldValue(
                                `sellingPlans[${index}].mysteryDurationValue`,
                                e
                              )
                            }
                          />
                        </FormLayout.Group>

                        <div className="addSellingPlans">
                          <Button plain onClick={() => setActiveModal(true)}>
                            Append products (subscription box options)
                          </Button>
                        </div>

                        <div className="product-stack">
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
                        <AppendProductsModal
                          active={activeModal}
                          setActiveModal={setActiveModal}
                          selectedOptions={selectedOptions}
                          setSelectedOptions={setSelectedOptions}
                          selectedProducts={selectedProducts}
                          setSelectedProducts={setSelectedProducts}
                        />
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
  );
};

export default MysteryBoxPlan;
