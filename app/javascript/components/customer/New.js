import {
  Layout,
  Card,
  Button,
  Form,
  FormLayout,
  Checkbox,
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
  Heading,
  Stack,
  RadioButton,
  Spinner,
} from '@shopify/polaris';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import _ from 'lodash';
import * as yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';
import AppLayout from '../layout/Layout';

import { gql, useMutation, useQuery } from '@apollo/client';
import customerIDICon from '../../../assets/images/icons/customerID.svg';
import addICon from '../../../assets/images/icons/add.svg';

const CreateCustomer = () => {
  const formRef = useRef(null);
  // consts ###
  const languageOptions = ['', 'English', 'VietNamese'];
  const countryOptions = ['', 'England', 'VietName'];
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
  const [formData, setFormData] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);

  const handleRemovingAdditionalContacts = useCallback((values, index) => {
    let customers = [...(values.additionalContacts || [])];
    customers[index]._destroy = true;
    return customers;
  });

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',

    phone: '',
    communication: '',
    subscription: '',
    status: '',
    autoCollection: false,
    language: '',

    additionalContacts: [],
    billingAddress: {
      language: '',
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      phone: '',
      address1: '',
      address2: '',
      city: '',
      zipCode: '',
    },
  };
  const initialAdditionalContactValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    _destroy: false,
  };

  const handleAdditionalContact = useCallback((values) => {
    const additionalContact = [...(values.additionalContacts || [])];
    additionalContact.push(initialAdditionalContactValues);

    return additionalContact;
  });

  const validationSchema = yup.object().shape({
    email: yup.string().required().label('Email'),
    firstName: yup.string().required().label('First name'),
    lastName: yup.string().required().label('Last name'),
    phone: yup.number().required().label('Phone'),
    communication: yup.string().label('Company'),
    language: yup.string().label('Language'),
    additionalContacts: yup.array().of(
      yup.object().shape({
        email: yup.string().label('Email'),
        firstName: yup.string().label('First name'),
        lastName: yup.string().label('Last name'),
        phone: yup.number().label('Phone'),
        companyName: yup.string().label('Company'),
      })
    ),
    billingAddress: yup.object().shape({
      language: yup.string().label('language'),
      email: yup.string().required().label('Email'),
      firstName: yup.string().label('First name'),
      lastName: yup.string().label('Last name'),
      phone: yup.number().required().label('Phone'),
      company: yup.string().label('Company'),
      address1: yup.string().required().label('Address 1'),
      address2: yup.string().label('Address 2'),
      city: yup.string().required().label('City'),
      zipCode: yup.string().label('Zip code'),
    }),
  });

  const getSellingPlan = (values) => {
    return values.sellingPlans.map((plan) => {
      let adjustmentValue = {};

      if (plan.adjustmentType == 'PERCENTAGE') {
        adjustmentValue[`${plan.adjustmentType.toLowerCase()}`] = parseInt(
          plan.adjustmentValue
        );
      } else {
        adjustmentValue['fixedValue'] = parseInt(plan.adjustmentValue);
      }

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

    return { input: data };
  };
  const GET_CUSTOMER = gql`
    query($id: ID!) {
      fetchCustomer(id: $id) {
        id
        firstName
        lastName
        email
        phone
        communication
        subscription
        status
        autoCollection
        language
        additionalContacts {
          id
          firstName
          lastName
          email
          phone
          companyName
          _destroy
        }
        billingAddress {
          id
          language
          firstName
          lastName
          email
          company
          phone
          address1
          address2
          city
          zipCode
        }
      }
    }
  `;
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_CUSTOMER, {
    variables: { id: id },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (data) {
      setFormData(data.fetchCustomer);
    }
  }, [data]);
  const CREATE_CUSTOMER = gql`
    mutation($input: AddCustomerInput!) {
      addCustomer(input: $input) {
        customer {
          id
          firstName
          lastName
          email
          phone
          communication
          subscription
          status
          autoCollection
          language
          additionalContacts {
            id
            firstName
            lastName
            email
            phone
            companyName
          }
          billingAddress {
            id
            language
            firstName
            lastName
            email
            company
            phone
            address1
            address2
            city
            zipCode
          }
        }
      }
    }
  `;
  // const UPDATE_CUSTOMER =
  const history = useHistory();
  const [createCustomer] = useMutation(CREATE_CUSTOMER);
  const UPDATE_CUSTOMER = gql`
    mutation($input: UpdateCustomerInput!) {
      updateCustomer(input: $input) {
        customer {
          id
          firstName
          lastName
          email
          phone
          communication
          subscription
          status
          autoCollection
          language
          additionalContacts {
            id
            firstName
            lastName
            email
            phone
            companyName
          }
          billingAddress {
            id
            language
            firstName
            lastName
            email
            company
            phone
            address1
            address2
            city
            zipCode
          }
        }
      }
    }
  `;
  const [updateCustomer] = useMutation(UPDATE_CUSTOMER);
  return (
    <AppLayout typePage="createCustomer" tabIndex="2">
      <Frame>
        <Page
          title={id ? 'Update a Customer' : 'Create a Customer'}
          breadcrumbs={[
            {
              content: 'Subscriptions Orders',
              onClick: () => history.push('/customers'),
            },
          ]}
          primaryAction={
            <ButtonGroup>
              <Button
                onClick={() => {
                  formRef.current.handleReset();
                }}
              >
                Dismiss
              </Button>
              {id ? (
                <Button primary onClick={() => formRef.current.handleSubmit()}>
                  Update
                </Button>
              ) : (
                <Button primary onClick={() => formRef.current.handleSubmit()}>
                  Create
                </Button>
              )}
            </ButtonGroup>
          }
        >
          {loading && id && (
            <Spinner
              accessibilityLabel="Spinner example"
              size="large"
              color="teal"
            />
          )}
          {(formData || !id) && (
            <Formik
              innerRef={formRef}
              validationSchema={validationSchema}
              initialValues={formData ? formData : initialValues}
              onSubmit={(values, { setSubmitting, setDirty }) => {
                if (id) {
                  console.log('update');
                  updateCustomer({
                    variables: {
                      input: { params: values },
                    },
                  })
                    .then((resp) => {
                      const data = resp.data;
                      const errors = data.errors;

                      if (errors) {
                        setSubmitting(false);
                        setFormErrors(errors);
                      } else {
                        // setSaveSuccess(true);
                        history.push('/customers');
                      }
                    })
                    .catch((error) => {
                      setSubmitting(false);
                      setFormErrors(error);
                    });
                } else {
                  console.log('create');
                  createCustomer({
                    variables: {
                      input: {
                        params: {
                          ...values,
                          status: 'processing',
                          subscription: 'active',
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
                        history.push('/customers');
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
                      alignContentFlush={true}
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
                  <Card sectioned>
                    <FormLayout>
                      <FormLayout.Group>
                        <TextField
                          prefix={<img src={customerIDICon}></img>}
                          // value={plan.name}
                          // error={
                          //   touched.sellingPlans?.[index]?.name &&
                          //   errors.sellingPlans?.[index]?.name
                          // }
                          // onChange={(e) =>
                          //   setFieldValue(`sellingPlans[${index}].name`, e)
                          // }
                          label="Customer ID"
                          placeholder="ID used to uniquely identify the customer"
                          type="text"
                          helpText={
                            <span>
                              Customer ID will be auto generated if not provided
                            </span>
                          }
                        />
                        <TextField
                          value={values?.email}
                          error={touched?.email && errors?.email}
                          onChange={(e) => setFieldValue(`email`, e)}
                          label="Email ID"
                          type="email"
                        />
                      </FormLayout.Group>
                      <FormLayout.Group>
                        <TextField
                          value={values?.firstName}
                          error={touched?.firstName && errors?.firstName}
                          onChange={(e) => setFieldValue(`firstName`, e)}
                          label="First Name"
                          type="text"
                        />
                        <TextField
                          value={values?.lastName}
                          error={touched?.lastName && errors?.lastName}
                          onChange={(e) => setFieldValue(`lastName`, e)}
                          label="Last Name"
                          type="text"
                        />
                      </FormLayout.Group>
                      <FormLayout.Group>
                        <TextField
                          value={values?.communication}
                          error={
                            touched?.communication && errors?.communication
                          }
                          onChange={(e) => setFieldValue(`communication`, e)}
                          label="Company"
                          type="text"
                        />
                        <TextField
                          value={values?.phone}
                          error={touched?.phone && errors?.phone}
                          onChange={(e) => setFieldValue(`phone`, e)}
                          label="Phone"
                          type="tel"
                        />
                      </FormLayout.Group>
                      {values?.additionalContacts.length === 0 && (
                        <TextContainer>
                          <Heading>Additional Contacts</Heading>
                          <TextField
                            prefix={
                              <img
                                onClick={() =>
                                  setFieldValue(
                                    'additionalContacts',
                                    handleAdditionalContact(values)
                                  )
                                }
                                src={addICon}
                              />
                            }
                            helpText={
                              <span>
                                Add team members to whom you’d like to send
                                invoice, payment, and subscription-related
                                emails.
                              </span>
                            }
                            disabled
                          />
                        </TextContainer>
                      )}
                    </FormLayout>
                  </Card>
                  {values?.additionalContacts?.map(
                    (additionalContact, index) => (
                      <div
                        className={additionalContact._destroy ? 'hidden' : ''}
                        key={index}
                      >
                        <Card
                          sectioned
                          actions={
                            index == 0
                              ? []
                              : [
                                  {
                                    content: 'Remove',
                                    onAction: () => {
                                      setFieldValue(
                                        'additionalContacts',
                                        handleRemovingAdditionalContacts(
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
                              {/* <TextField
                                prefix={<img src={customerIDICon}></img>}

                                label="Customer ID"
                                placeholder="ID used to uniquely identify the customer"
                                disabled
                                type="text"
                                helpText={
                                  <span>
                                    Customer ID will be auto generated if not
                                    provided
                                  </span>
                                }
                              /> */}

                              <TextField
                                value={additionalContact?.email}
                                error={
                                  touched?.additionalContacts?.[index]?.email &&
                                  errors?.additionalContacts?.[index]?.email
                                }
                                onChange={(e) => {
                                  setFieldValue(
                                    `additionalContacts[${index}].email`,
                                    e
                                  );
                                }}
                                label="Email ID"
                                type="email"
                              />
                              <div></div>
                            </FormLayout.Group>
                            <FormLayout.Group>
                              <TextField
                                value={additionalContact?.firstName}
                                error={
                                  touched?.additionalContacts?.[index]
                                    ?.firstName &&
                                  errors?.additionalContacts?.[index]?.firstName
                                }
                                onChange={(e) =>
                                  setFieldValue(
                                    `additionalContacts[${index}].firstName`,
                                    e
                                  )
                                }
                                label="First Name"
                                type="text"
                              />
                              <TextField
                                value={additionalContact?.lastName}
                                error={
                                  touched?.additionalContacts?.[index]
                                    ?.lastName &&
                                  errors?.additionalContacts?.[index]?.lastName
                                }
                                onChange={(e) =>
                                  setFieldValue(
                                    `additionalContacts[${index}].lastName`,
                                    e
                                  )
                                }
                                label="Last Name"
                                type="text"
                              />
                            </FormLayout.Group>
                            <FormLayout.Group>
                              <TextField
                                value={additionalContact?.companyName}
                                error={
                                  touched?.additionalContacts?.[index]
                                    ?.companyName &&
                                  errors?.additionalContacts?.[index]
                                    ?.companyName
                                }
                                onChange={(e) =>
                                  setFieldValue(
                                    `additionalContacts[${index}].companyName`,
                                    e
                                  )
                                }
                                label="Company Name"
                                type="text"
                              />
                              <TextField
                                value={additionalContact?.phone}
                                error={
                                  touched?.additionalContacts?.[index]?.phone &&
                                  errors?.additionalContacts?.[index]?.phone
                                }
                                onChange={(e) =>
                                  setFieldValue(
                                    `additionalContacts[${index}].phone`,
                                    e
                                  )
                                }
                                label="Phone"
                                type="tel"
                              />
                            </FormLayout.Group>
                            <br />

                            {index == values.additionalContacts?.length - 1 && (
                              <TextContainer>
                                <Heading>Additional Contacts</Heading>
                                <TextField
                                  prefix={
                                    <img
                                      onClick={() =>
                                        setFieldValue(
                                          'additionalContacts',
                                          handleAdditionalContact(values)
                                        )
                                      }
                                      src={addICon}
                                    />
                                  }
                                  helpText={
                                    <span>
                                      Add team members to whom you’d like to
                                      send invoice, payment, and
                                      subscription-related emails.
                                    </span>
                                  }
                                  disabled
                                />
                              </TextContainer>
                            )}
                          </FormLayout>
                        </Card>
                      </div>
                    )
                  )}

                  <div className="essentials">
                    <Card title="Essentials" sectioned>
                      <FormLayout>
                        <div className="language">
                          <Select
                            label="Language"
                            value={values?.language}
                            error={touched?.language && errors?.language}
                            onChange={(e) => setFieldValue(`language`, e)}
                            options={languageOptions}
                            helpText={
                              <span>
                                This will be the language of your checkout,
                                Self-Serve Portal, invoices and emails
                              </span>
                            }
                          />
                        </div>

                        <div className="autoCollection">
                          <TextContainer spacing="tight">
                            <Heading>Auto-collection</Heading>
                            <span>
                              Auto-collection lets you automatically attempt to
                              charge a customer’s payment method whenever an
                              invoice is created.
                            </span>
                            <Stack>
                              <RadioButton
                                label="On"
                                checked={values.autoCollection === true}
                                id="autoCollectionON"
                                name="autoCollection"
                                onChange={(e) =>
                                  setFieldValue(`autoCollection`, true)
                                }
                              />
                              <RadioButton
                                label="Off"
                                id="autoCollectionOff"
                                name="autoCollection"
                                checked={values.autoCollection === false}
                                onChange={(e) =>
                                  setFieldValue(`autoCollection`, false)
                                }
                              />
                            </Stack>
                          </TextContainer>
                        </div>
                      </FormLayout>
                    </Card>
                  </div>

                  <div className="billingAddress">
                    <Card sectioned title="Billing Address">
                      <FormLayout>
                        <FormLayout.Group>
                          <Select
                            label="Language"
                            value={values?.billingAddress?.language}
                            error={
                              touched?.billingAddress?.language &&
                              errors?.billingAddress?.language
                            }
                            onChange={(e) =>
                              setFieldValue(`billingAddress.language`, e)
                            }
                            options={countryOptions}
                          />
                          <TextField
                            value={values?.billingAddress?.firstName}
                            error={
                              touched?.billingAddress?.firstName &&
                              errors?.billingAddress?.firstName
                            }
                            onChange={(e) =>
                              setFieldValue(`billingAddress.firstName`, e)
                            }
                            label="First Name"
                            type="text"
                          />
                        </FormLayout.Group>
                        <FormLayout.Group>
                          <TextField
                            value={values?.billingAddress?.lastName}
                            error={
                              touched?.billingAddress?.lastName &&
                              errors?.billingAddress?.lastName
                            }
                            onChange={(e) =>
                              setFieldValue(`billingAddress.lastName`, e)
                            }
                            label="Last Name"
                            type="text"
                          />
                          <TextField
                            value={values?.billingAddress?.email}
                            error={
                              touched?.billingAddress?.email &&
                              errors?.billingAddress?.email
                            }
                            onChange={(e) =>
                              setFieldValue(`billingAddress.email`, e)
                            }
                            label="Email ID"
                            type="email"
                          />
                        </FormLayout.Group>
                        <FormLayout.Group>
                          <TextField
                            value={values?.billingAddress?.company}
                            error={
                              touched?.billingAddress?.company &&
                              errors?.billingAddress?.company
                            }
                            onChange={(e) =>
                              setFieldValue(`billingAddress.company`, e)
                            }
                            label="Company"
                            type="text"
                          />
                          <TextField
                            value={values?.billingAddress?.phone}
                            error={
                              touched?.billingAddress?.phone &&
                              errors?.billingAddress?.phone
                            }
                            onChange={(e) =>
                              setFieldValue(`billingAddress.phone`, e)
                            }
                            label="Phone"
                            type="tel"
                          />
                        </FormLayout.Group>
                        <FormLayout.Group>
                          <TextField
                            value={values?.billingAddress?.address1}
                            error={
                              touched?.billingAddress?.address1 &&
                              errors?.billingAddress?.address1
                            }
                            onChange={(e) =>
                              setFieldValue(`billingAddress.address1`, e)
                            }
                            label="Address 1"
                            type="text"
                          />
                          <TextField
                            value={values?.billingAddress?.address2}
                            error={
                              touched?.billingAddress?.address2 &&
                              errors?.billingAddress?.address2
                            }
                            onChange={(e) =>
                              setFieldValue(`billingAddress.address2`, e)
                            }
                            label="Address 2"
                            type="text"
                          />
                        </FormLayout.Group>
                        <FormLayout.Group>
                          <TextField
                            value={values?.billingAddress?.city}
                            error={
                              touched?.billingAddress?.city &&
                              errors?.billingAddress?.city
                            }
                            onChange={(e) =>
                              setFieldValue(`billingAddress.city`, e)
                            }
                            label="City"
                            type="text"
                          />
                          <TextField
                            value={values?.billingAddress?.zipCode}
                            error={
                              touched?.billingAddress?.zipCode &&
                              errors?.billingAddress?.zipCode
                            }
                            onChange={(e) =>
                              setFieldValue(`billingAddress.zipCode`, e)
                            }
                            label="Zip code"
                            type="text"
                          />
                        </FormLayout.Group>
                        <br />
                        {id ? (
                          <Button primary onClick={handleSubmit}>
                            Update
                          </Button>
                        ) : (
                          <Button
                            primary
                            onClick={handleSubmit}
                            loading={isSubmitting}
                          >
                            Create
                          </Button>
                        )}
                      </FormLayout>
                    </Card>
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

export default CreateCustomer;
