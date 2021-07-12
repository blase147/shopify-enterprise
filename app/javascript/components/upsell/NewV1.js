import React, { useState, useCallback, useEffect } from 'react';
import { Formik } from 'formik';
import _ from 'lodash';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import AppLayout from '../layout/Layout';
import { gql, useMutation, useQuery } from '@apollo/client';
import offerImg from '../../../assets/images/upsell/offerImage.svg';

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
  Layout,
  Heading,
  DisplayText,
} from '@shopify/polaris';

const NewUpSellV1 = () => {
  // consts ###
  const options = [...Array(99).keys()].map((foo) => (foo + 1).toString());

  const optionsWithNone = [...options];
  optionsWithNone.unshift({ value: '', label: 'None' });

  const interOptions = [
    { label: 'Day', value: 'DAY' },
    { label: 'Week', value: 'WEEK' },
    { label: 'Month', value: 'MONTH' },
    { label: 'Year', value: 'YEAR' },
  ];

  const adjusmentOptions = [
    { label: 'None', value: '' },
    { label: 'Fixed amount discount', value: 'FIXED_AMOUNT' },
    { label: 'Percentage discount', value: 'PERCENTAGE' },
    { label: 'Manual price', value: 'PRICE' },
  ];

  const [formErrors, setFormErrors] = useState([]);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);

  const handleRemovingSellingPlan = useCallback((values, index) => {
    const plans = [...(values.sellingPlans || [])];
    plans.splice(index, 1);
    return plans;
  });

  const initialValues = {
    merchantCode: '',
    name: '',
    selector: '',
    sellingPlans: [
      {
        name: '',
        selector: '',
        description: '',
        interval: 1,
        intervalType: 'DAY',
        minFullfill: '',
        maxFullfill: '',
        adjustmentType: '',
        adjustmentValue: 0,
      },
    ],
  };

  const handleAddSellingPlan = useCallback((values) => {
    const plans = [...(values.sellingPlans || [])];
    plans.push(initialValues);

    return plans;
  });

  const validationSchema = yup.object().shape({
    merchantCode: yup.string().required().label('Internal name'),
    name: yup.string().required().label('Public name'),
    selector: yup.string().required().label('Plan selector title'),
    sellingPlans: yup.array().of(
      yup.object().shape({
        name: yup.string().required().label('Name'),
        selector: yup.string().required().label('Plan selector label'),
      })
    ),
  });

  const getSellingPlan = (values) => {
    return values.sellingPlans.map((plan) => {
      let adjustmentValue = {};

      if (plan.adjustmentType == 'PERCENTAGE') {
        adjustmentValue['percentage'] = parseInt(plan.adjustmentValue);
      } else {
        adjustmentValue['fixedValue'] = parseInt(plan.adjustmentValue);
      }

      // billing Policy
      let billingPolicy = {
        recurring: {
          interval: plan.intervalType || 'FIXED_AMOUNT',
          intervalCount: parseInt(plan.interval || 0),
        },
      };

      if (plan.minFullfill) {
        billingPolicy.recurring['minCycles'] = parseInt(plan.minFullfill);
      }

      if (plan.maxFullfill) {
        billingPolicy.recurring['maxCycles'] = parseInt(plan.maxFullfill);
      }

      let pricingPolicies = [
        {
          fixed: {
            adjustmentType: plan.adjustmentType || 'FIXED_AMOUNT',
            adjustmentValue: adjustmentValue || 0,
          },
        },
      ];

      return {
        name: plan.name,
        description: plan.description || '',
        options: [plan.selector],
        billingPolicy: billingPolicy,
        deliveryPolicy: {
          recurring: {
            interval: plan.intervalType,
            intervalCount: parseInt(plan.interval || 0),
          },
        },
        pricingPolicies: pricingPolicies,
      };
    });
  };

  const formatSellingPlanGroup = (values) => {
    const data = {
      merchantCode: values.merchantCode,
      name: values.name,
      options: [values.selector],
      sellingPlansToCreate: getSellingPlan(values),
      // sellingPlansToUpdate: update_selling_plans,
      // sellingPlansToDelete: delete_selling_plans
    };

    console.log(data);

    return { input: data };
  };

  const CREATE_SELLING_PLAN = gql`
    mutation($input: SellingPlanGroupInput!) {
      sellingPlanGroupCreate(input: $input) {
        sellingPlanGroup {
          id
          name
        }
      }
    }
  `;

  const history = useHistory();
  const [createSellingPlan] = useMutation(CREATE_SELLING_PLAN);

  return (
    <AppLayout typePage="newUpsell" tabIndex="4">
      <Frame>
        <Page
          title="Create Upsell Campaign"
          breadcrumbs={[
            {
              content: 'Upsell Campaigns',
              onAction: () => history.push('/upsell'),
            },
          ]}
        >
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting }) => {
              const variables = formatSellingPlanGroup(values);
              createSellingPlan({ variables: variables })
                .then((resp) => {
                  const data = resp.data;
                  const errors = data.errors.length
                    ? data.errors
                    : data.data.errors;

                  if (errors.length) {
                    setFormErrors(errors);
                  } else {
                    setSaveSuccess(true);
                  }

                  setSubmitting(false);
                })
                .catch((error) => {
                  setSubmitting(false);
                  setSaveSuccess(true);
                });
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

                <Card title="Upsell campaign group" sectioned>
                  <FormLayout>
                    <FormLayout.Group>
                      <TextField
                        value={values.merchantCode}
                        label="Internal name"
                        placeholder="Subscribe & Save"
                        type="text"
                        error={touched.merchantCode && errors.merchantCode}
                        onChange={(e) => setFieldValue('merchantCode', e)}
                        helpText={
                          <span>
                            Internal name of the group, used to identify it in
                            the admin
                          </span>
                        }
                      />
                      <div className="btn-group">
                        <ButtonGroup>
                          <Button primary>Save as Draft</Button>
                          <Button>Save & Public</Button>
                        </ButtonGroup>
                      </div>
                    </FormLayout.Group>
                    <FormLayout.Group>
                      <TextField
                        value={values.selector}
                        error={touched.selector && errors.selector}
                        onChange={(e) => setFieldValue('selector', e)}
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
                        value={values.name}
                        error={touched.name && errors.name}
                        onChange={(e) => setFieldValue('name', e)}
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

                <Card title="Upsell Campaign" sectioned>
                  <FormLayout>
                    <FormLayout.Group>
                      <TextField
                        value={values.merchantCode}
                        label="Name"
                        placeholder="Subscribe & Save - delivered every week"
                        type="text"
                        error={touched.merchantCode && errors.merchantCode}
                        onChange={(e) => setFieldValue('merchantCode', e)}
                        helpText={
                          <span>
                            Selling plan name displayed in the cart and during
                            checkout. It's recommended that this name includes
                            the frequency of deliveries
                          </span>
                        }
                      />
                      <TextField
                        value={values.merchantCode}
                        label="Plan selector label"
                        placeholder="1 week"
                        type="text"
                        error={touched.merchantCode && errors.merchantCode}
                        onChange={(e) => setFieldValue('merchantCode', e)}
                        helpText={
                          <span>
                            Label in the plan selector on the product page
                          </span>
                        }
                      />
                    </FormLayout.Group>
                    <FormLayout.Group>
                      <TextField
                        // value={plan.description}
                        // error={
                        //   touched.sellingPlans?.[index]?.description &&
                        //   errors.sellingPlans?.[index]?.description
                        // }
                        // onChange={(e) =>
                        //   setFieldValue(`sellingPlans[${index}].description`, e)
                        // }
                        label="Description (optional)"
                        type="text"
                        multiline={4}
                        helpText={
                          <span>
                            Detailed commitment description displayed on the
                            product page when the plan is selected
                          </span>
                        }
                      />
                      <p> </p>
                    </FormLayout.Group>
                    <TextContainer>
                      <Subheading>DISPLAY RULES</Subheading>
                      <TextStyle variation="subdued">
                        Show these offers when any of the following individual
                        criteria are met
                      </TextStyle>
                    </TextContainer>
                    <FormLayout.Group>
                      <Select label="Interval"></Select>
                      <Select label="  "></Select>
                    </FormLayout.Group>

                    <div className="when-cart">
                      <Stack>
                        <Checkbox label="When cart" />
                        <Select />
                        <p>of the following product</p>
                      </Stack>
                      <div className="search">
                        <TextField placeholder="Search for product to add"></TextField>
                      </div>
                    </div>
                    <div className="when-cart">
                      <Stack>
                        <Checkbox label="When customer" />
                        <Select />
                        <p>of the following plans</p>
                      </Stack>
                      <div className="search">
                        <TextField placeholder="Search for product to add"></TextField>
                      </div>
                    </div>

                    <div className="when-order">
                      <Checkbox label="When order value is" />
                      <Select />
                      <div className="amount">
                        <TextField prefix="$"></TextField>
                      </div>
                    </div>

                    <div className="when-order">
                      <Checkbox label="When product count is" />
                      <Select />
                      <div className="amount">
                        <Select />
                      </div>
                    </div>

                    <TextContainer>
                      <Subheading>OFFERS</Subheading>
                      <p>
                        Select a product(s) to include in this campaign and
                        customize the look.
                      </p>
                    </TextContainer>

                    <FormLayout.Group>
                      <p className="card-offer">PRODUCT</p>
                      <p className="card-offer">CUSTOMIZE</p>
                    </FormLayout.Group>

                    <FormLayout.Group>
                      <Select label="Products"></Select>
                      <Select label="Templates"></Select>
                    </FormLayout.Group>
                    <FormLayout.Group>
                      <div className="offer-left">
                        <Select label="Display Quantity ?" />
                        <TextField
                          label={<Checkbox label="Limit Quantity" />}
                        />
                        <div></div>
                      </div>

                      <div className="offer-right">
                        <div className="offer-right-select">
                          <Select label="Offer title"></Select>
                        </div>
                        <div className="offer-right-textfield">
                          <TextField
                            label="  "
                            placeholder="Wait, there’s an offer for you!"
                          ></TextField>
                        </div>
                      </div>
                    </FormLayout.Group>
                    <FormLayout.Group>
                      <div></div>
                      <div className="offer-right">
                        <div className="offer-right-select">
                          <Select label="Timer"></Select>
                        </div>
                        <div className="offer-right-textfield">
                          <TextField
                            label="Background Color"
                            placeholder="Wait, there’s an offer for you!"
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
                            <Select label="Positions"></Select>
                          </div>
                          <div className="offer-right-textfield">
                            <TextField
                              label="Button Text (Accept Offer)"
                              placeholder="Wait, there’s an offer for you!"
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
                        ></TextField>
                      </div>
                    </FormLayout.Group>

                    <div>
                      <br />
                      <DisplayText size="large">
                        Hey there! There’s an offer for you!
                      </DisplayText>
                    </div>

                    <FormLayout.Group>
                      <img className="offer-img" />

                      <div className="offer-description">
                        <p>
                          Neque risus diam arcu egestas elementum elementum.
                          Velit aliquam potenti sed pellentesque metus in
                          curabitur ac etiam. Sem lectus felis bibendum felis
                          diam integer augue. Id porta sagittis, mauris
                          penatibus arcu diam ornare. Aliquam at et consequat
                          ultrices.
                        </p>
                      </div>
                    </FormLayout.Group>
                    <p className="countdown">10:00 left to claim this offer</p>
                    <FormLayout.Group>
                      <Button fullWidth>No Thanks</Button>
                      <Button fullWidth primary>
                        Pay Now - (Total Price)
                      </Button>
                    </FormLayout.Group>
                  </FormLayout>
                </Card>
              </Form>
            )}
          </Formik>
        </Page>
      </Frame>
    </AppLayout>
  );
};

export default NewUpSellV1;
