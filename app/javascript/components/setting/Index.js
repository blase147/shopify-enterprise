import ReactDOM from 'react-dom';
import AppLayout from '../layout/Layout';
import Billing from './Billing';
import CustomPortal from './CustomPortal';
import EmailNotification from './EmailNotification';
import Dunning from './Dunning';
import StoreInfomation from './StoreInformation';
import Legal from './Legal';

import {
  Page,
  EmptyState,
  Frame,
  CalloutCard,
  Card,
  Icon,
  Stack,
  Badge,
  DisplayText,
  Tabs,
  FormLayout,
  Select,
  TextStyle,
  ChoiceList,
  Checkbox,
  Button,
} from '@shopify/polaris';

import {
  Form,
  ContextualSaveBar,
  Toast,
  Banner,
  List,
  Spinner,
} from '@shopify/polaris';

import React, { useState, useCallback, useEffect } from 'react';
import { Formik } from 'formik';
import _ from 'lodash';
import * as yup from 'yup';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Link, useHistory, useParams } from 'react-router-dom';

const Settings = () => {
  // form data ########################################################
  const [formData, setFormData] = useState(null);
  const [formErrors, setFormErrors] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);

  const validationSchema = yup.object().shape({
    // internalName: yup.string().required().label('Internal name'),
  });

  const GET_DATA = gql`
    query {
      fetchSetting {
        paymentRetries
        paymentDelayRetries

        styleAccountProfile
        styleSidebar
        styleSubscription
        styleUpsell
        styleSidebarPages
        navigationDelivery
        shipingAddress
        upcomingOderDate
        upcomingQuantity
        productToSubscription
        changeVariant
        swapProduct
        shipment
        frequency
        facingFrequencyOption
        oneTimePurchase
        availablePurchase
        discount
        subscriptionCancellation
        cancellationEmailContact
        allowCancelAfter
        reactiveSubscription
        reasonsCancels {
          id
          title
          returnContent
          _destroy
        }

        emailNotifications {
          id
          name
          status
          fromName
          fromEmail
          emailSubject
          emailMessage
          slug
          descripton
        }
        additionalSendAccountAfterCheckout
        bbcStoreowner
        ccStoreowner
        sendShopifyReceipt
        sendFullfillment

        activateDunningForCards
        dunningPeriod
        retryFrequency
        happensToSubscriptions
        happensToInvoices
        activateDunningDirectDebit
        directDebitSubscription
        directDebitInvoice
        dunningOfflineConfigure
        dunningOfflinePeiod
        dunningOfflineSubscription
        dunningOfflineInvoice
        dunningCardConfigure
        chooseAutomaticRetryMode

        storeName
        storeEmail
        storefrontPassword

        checkoutSubscriptionTerms
        emailSubscriptionTerms
        applePaySubscriptionTerms
        showPromoButton
        promoButtonContent
        promoButtonUrl
        contactBoxContent
        promoTagline1Content
        promoTagline2Content
      }
    }
  `;
  let { id } = useParams();
  const { data, loading, error, refetch } = useQuery(GET_DATA, {
    fetchPolicy: 'no-cache',
  });

  const UPDATE_SETTING = gql`
    mutation($input: UpdateSettingInput!) {
      updateSetting(input: $input) {
        setting {
          paymentRetries
          paymentDelayRetries
          styleAccountProfile
          styleSidebar
          styleSubscription
          styleUpsell
          styleSidebarPages
          navigationDelivery
          shipingAddress
          upcomingOderDate
          upcomingQuantity
          productToSubscription
          changeVariant
          swapProduct
          shipment
          frequency
          facingFrequencyOption
          oneTimePurchase
          availablePurchase
          discount
          subscriptionCancellation
          cancellationEmailContact
          allowCancelAfter
          reactiveSubscription
          reasonsCancels {
            id
            title
            returnContent
            _destroy
          }

          emailNotifications {
            name
            status
            fromName
            fromEmail
            emailSubject
            emailMessage
            slug
            descripton
          }
          additionalSendAccountAfterCheckout
          bbcStoreowner
          ccStoreowner
          sendShopifyReceipt
          sendFullfillment

          activateDunningForCards
          dunningPeriod
          retryFrequency
          happensToSubscriptions
          happensToInvoices
          dunningFutureTrialSubscriptions
          dunningOneTimeInvoice
          activateDunningDirectDebit
          directDebitSubscription
          directDebitInvoice
          dunningOfflineConfigure
          dunningOfflinePeiod
          dunningOfflineSubscription
          dunningOfflineInvoice
          dunningCardConfigure
          chooseAutomaticRetryMode

          storeName
          storeEmail
          storefrontPassword

          checkoutSubscriptionTerms
          emailSubscriptionTerms
          applePaySubscriptionTerms
          showPromoButton
          promoButtonContent
          promoButtonUrl
          contactBoxContent
          promoTagline1Content
          promoTagline2Content
        }
      }
    }
  `;
  const [updateSetting] = useMutation(UPDATE_SETTING);

  useEffect(() => {
    if (data) {
      console.log('mnmnmnmnm', data.fetchSetting);
      setFormData(data.fetchSetting);
    }
  }, [data]);
  const initialValues = {
    allowCancelAfter: '',
    availablePurchase: '',
    cancellationEmailContact: '',
    changeVariant: '1',
    discount: [],
    emailNotifications: [
      {
        emailMessage: '',
        emailSubject: '',
        fromEmail: '',
        fromName: '',
        name: 'Subscription Activation',
        slug: 'customer',
        status: true,
        __typename: 'EmailNotification',
      },
      {
        emailMessage: '',
        emailSubject: '',
        fromEmail: '',
        fromName: '',
        name: 'Subscription Activation',
        slug: 'customer',
        status: true,
        __typename: 'EmailNotification',
      },
      {
        emailMessage: '',
        emailSubject: '',
        fromEmail: '',
        fromName: '',
        name: 'Subscription Activation',
        slug: 'store_owner',
        status: true,
        __typename: 'EmailNotification',
      },
      {
        emailMessage: '',
        emailSubject: '',
        fromEmail: '',
        fromName: '',
        name: 'Subscription Activation',
        slug: 'store_owner',
        status: true,
        __typename: 'EmailNotification',
      },
    ],
    facingFrequencyOption: '',
    frequency: '',
    navigationDelivery: '',
    oneTimePurchase: '',
    paymentDelayRetries: '',
    paymentRetries: '',
    productToSubscription: '',
    reactiveSubscription: '',
    shipingAddress: '',
    shipment: '',
    styleAccountProfile: '',
    styleSidebar: '',
    styleSidebarPages: '',
    styleSubscription: '',
    styleUpsell: '',
    subscriptionCancellation: '',
    swapProduct: '',
    themes: '',
    upcomingOderDate: '',
    upcomingQuantity: '',
    
    showPromoButton: 'true',
    promoButtonContent: '',
    promoButtonUrl: '',
    contactBoxContent: '',
    promoTagline1Content: '',
    promoTagline2Content: '',
    _destroy: false,
  };
  // form data #####################################################

  const [selectedTitleTab, setSelectedTitleTab] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTitleTab(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: 'billing',
      content: 'Billing',
    },
    {
      id: 'customer-portal',
      content: 'Customer Portal',
    },
    {
      id: 'email-notification',
      content: 'Email Notification',
    },
    {
      id: 'dunning',
      content: 'Dunning',
    },
    {
      id: 'store-information',
      content: 'StoreInformation',
    },
    {
      id: 'legal',
      content: 'Legal',
    },
  ];
  const history = useHistory();
  useEffect(() => {
    if (saveSuccess) {
      setSaveSuccess(false);
    }
  }, [selectedTitleTab]);

  return (
    <AppLayout typePage="settings" tabIndex="6">
      <Frame>
        <Page title="Settings">
          <Tabs
            tabs={tabs}
            selected={selectedTitleTab}
            onSelect={handleTabChange}
          >
            {loading && (
              <Card>
                <Spinner
                  accessibilityLabel="Spinner example"
                  size="large"
                  color="teal"
                />
              </Card>
            )}
            {formErrors.length > 0 && (
              <>
                <Banner title="Setting could not be saved" status="critical">
                  <List type="bullet">
                    {formErrors.map((message, index) => (
                      <List.Item key={index}>{message.message}</List.Item>
                    ))}
                  </List>
                </Banner>
                <br />
              </>
            )}

            {formData && (
              <Formik
                validationSchema={validationSchema}
                initialValues={formData ? formData : initialValues}
                enableReinitialize
                onSubmit={(
                  values,
                  { setSubmitting, setDirty, resetForm, touched }
                ) => {
                  updateSetting({ variables: { input: { params: values } } })
                    .then((resp) => {
                      const data = resp.data;
                      const errors = data.errors;

                      if (errors) {
                        setFormErrors(errors);
                      } else {
                        setSaveSuccess(true);
                        console.log('oke');
                        refetch();
                        setDirty(false);
                        // resetForm({});
                        console.log('kxjckxjck');
                      }

                      setSubmitting(false);
                    })
                    .catch((error) => {
                      setSubmitting(false);
                      setFormErrors(error);
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
                  setDirty,
                  formik,
                  /* and other goodies */
                }) => (
                  <Form onSubmit={handleSubmit}>
                    {dirty && (
                      <ContextualSaveBar
                        alignContentFlush={true}
                        message="Unsaved changes"
                        saveAction={{
                          onAction: () => handleSubmit(),
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
                        content="Setting is saved"
                        onDismiss={hideSaveSuccess}
                      />
                    )}

                    {selectedTitleTab === 0 ? (
                      <Billing
                        values={values}
                        touched={touched}
                        errors={errors}
                        setFieldValue={setFieldValue}
                      />
                    ) : selectedTitleTab === 1 ? (
                      <CustomPortal
                        values={values}
                        touched={touched}
                        errors={errors}
                        setFieldValue={setFieldValue}
                        handleSubmit={handleSubmit}
                        refetch={refetch}
                        isSubmitting={isSubmitting}
                      />
                    ) : selectedTitleTab === 2 ? (
                      <div className="EmailNotification">
                        <EmailNotification
                          values={values}
                          touched={touched}
                          errors={errors}
                          setFieldValue={setFieldValue}
                          handleSubmit={handleSubmit}
                        />
                      </div>
                    ) : selectedTitleTab === 3 ? (
                      <Dunning
                        values={values}
                        touched={touched}
                        errors={errors}
                        setFieldValue={setFieldValue}
                        handleSubmit={handleSubmit}
                      />
                    ) : selectedTitleTab === 4 ? (
                      <div className="storeInfomation">
                        <StoreInfomation
                          values={values}
                          touched={touched}
                          errors={errors}
                          setFieldValue={setFieldValue}
                          handleSubmit={handleSubmit}
                        />
                      </div>
                    ) : (
                      <div className="storeInfomation">
                        <Legal
                          values={values}
                          touched={touched}
                          errors={errors}
                          setFieldValue={setFieldValue}
                          handleSubmit={handleSubmit}
                        />
                      </div>
                    )}
                  </Form>
                )}
              </Formik>
            )}
          </Tabs>
        </Page>
      </Frame>
    </AppLayout>
  );
};

export default Settings;
