import { gql, useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { Banner, Card, ContextualSaveBar, Form, Frame, List, Page, Spinner, Tabs, Toast, Layout, FormLayout, TextField, Button } from '@shopify/polaris';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';
import AppLayout from '../layout/Layout';
import Billing from './Billing';
import CustomPortal from './CustomPortal';
import Dunning from './Dunning';
import EmailNotification from './EmailNotification';
import HouseKeeping from './HouseKeeping';
import Password from './HouseKeepingComponents/Password';
import Legal from './Legal';
import ProductExtention from './ProductExtention';
import StoreInfomation from './StoreInformation';





const Settings = () => {

  // form data ########################################################
  const [formData, setFormData] = useState(null);
  const [formErrors, setFormErrors] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);


  const validationSchema = yup.object().shape({
    // internalName: yup.string().required().label('Internal name'),
  });

  const confirmPasswordQuery=gql`
  query($password:String!)
    {
      confirmPassword(password:$password) {
              success
    }
  }
  `;
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
        emailService
        emailNotifications {
          id
          name
          status
          fromName
          fromEmail
          emailSubject
          emailMessage
          slug
          description
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

        showSubscription
        showDeliverySchedule
        showOrderHistory
        showAddress
        showBilling
        showAccount
        pauseSubscription
      }
    }
  `;
  let { id } = useParams();
  const { data, loading, error, refetch } = useQuery(GET_DATA, {
    fetchPolicy: 'network-only',
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
          emailService
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
            description
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

          showSubscription
          showDeliverySchedule
          showOrderHistory
          showAddress
          showBilling
          showAccount
          pauseSubscription

          designType
        }
      }
    }
  `;
  const [updateSetting] = useMutation(UPDATE_SETTING);

  useEffect(() => {
    if (data) {
      setFormData(data.fetchSetting);
    }
  }, [data]);
  const initialValues = {
    allowCancelAfter: '',
    availablePurchase: '',
    cancellationEmailContact: '',
    changeVariant: '1',
    discount: [],
    emailService:'',
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
    navigationDelivery: 'storeowner_and_customer',
    oneTimePurchase: '',
    paymentDelayRetries: '',
    paymentRetries: '',
    productToSubscription: '',
    reactiveSubscription: 'storeowner_and_customer',
    shipingAddress: 'storeowner_and_customer',
    shipment: 'storeowner_and_customer',
    styleAccountProfile: '',
    styleSidebar: '',
    styleSidebarPages: '',
    styleSubscription: '',
    styleUpsell: '',
    subscriptionCancellation: 'storeowner_and_customer',
    swapProduct: 'storeowner_and_customer',
    themes: '',
    upcomingOderDate: '',
    upcomingQuantity: 'storeowner_and_customer',

    showPromoButton: 'true',
    promoButtonContent: '',
    promoButtonUrl: '',
    contactBoxContent: '',
    promoTagline1Content: '',
    promoTagline2Content: '',

    showSubscription: '',
    showDeliverySchedule: '',
    showOrderHistory: '',
    showAddress: '',
    showBilling: '',
    showAccount: '',

    delayOrder: 'storeowner_and_customer',
    pauseSubscription: 'storeowner_and_customer',
    _destroy: false,
    designType:'one'
  };
  // form data #####################################################

  const [selectedTitleTab, setSelectedTitleTab] = useState(0);

  // Password confirmation
  const [passwordConfirmed, setPasswordConfirmed] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError,setPasswordError]=useState("")
  const [confirmPassword,{data:confirmPasswordRes,loading:passwordLoading}]=useLazyQuery(confirmPasswordQuery,{fetchPolicy:"network-only"})

  const verifyPassword =()=>{
    if(!isEmpty(password)){
      confirmPassword({
        variables:{
          password:password
        }
      })
    }
  }

  useEffect(()=>{
      if(confirmPasswordRes?.confirmPassword?.success)
      {
        setPasswordConfirmed(true);
      }else{
        setPasswordError(confirmPasswordRes?.errors[0]?.message)
      }
  },[confirmPasswordRes])

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTitleTab(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: 'house',
      content: 'House keeping',
    },
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
    // {
    //   id: 'dunning',
    //   content: 'Dunning',
    // },
    ...(process.env.APP_TYPE=="public" ? 
    [{
      id: 'store-information',
      content: 'StoreInformation',
    }]:[])
    ,
    // {
    //   id: 'legal',
    //   content: 'Legal',
    // },
    {
      id: 'product-extension',
      content: 'Product Extension',
    },
  ];
  const history = useHistory();
  useEffect(() => {
    if (saveSuccess) {
      setSaveSuccess(false);
    }
  }, [selectedTitleTab]);

  return (
    <AppLayout typePage="settings" tabIndex="8">
      <Frame>
        { passwordConfirmed
          ? (
            <Page title="Settings">
              {
                console.log("...",tabs,"hahahh")
              }
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
                      const newValues={...values,
                        navigationDelivery:values.navigationDelivery || "storeowner_and_customer",
                        reactiveSubscription:values.reactiveSubscription || 'storeowner_and_customer',
                        shipingAddress:values.shipingAddress || 'storeowner_and_customer',
                        shipment:values.shipment || 'storeowner_and_customer',
                        subscriptionCancellation:values.subscriptionCancellation || 'storeowner_and_customer',
                        swapProduct:values.swapProduct || 'storeowner_and_customer',
                        upcomingQuantity:values.upcomingQuantity ||  'storeowner_and_customer',
                        delayOrder:values.delayOrder || 'storeowner_and_customer',
                        pauseSubscription:values.pauseSubscription || 'storeowner_and_customer',
                      };

                      updateSetting({ variables: { input: { params: newValues } } })
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
                        {
                          console.log("SelectedTab..",selectedTitleTab)
                        }
                        {selectedTitleTab === 0 ? (
                          <HouseKeeping

                          />):
                        selectedTitleTab === 1 ? (
                          <Billing
                            values={values}
                            touched={touched}
                            errors={errors}
                            setFieldValue={setFieldValue}
                          />
                        ) : selectedTitleTab === 2 ? (
                          <CustomPortal
                            values={values}
                            touched={touched}
                            errors={errors}
                            setFieldValue={setFieldValue}
                            handleSubmit={handleSubmit}
                            refetch={refetch}
                            isSubmitting={isSubmitting}
                          />
                        ) : selectedTitleTab === 3 ? (
                          <div className="EmailNotification">
                            <EmailNotification
                              values={values}
                              touched={touched}
                              errors={errors}
                              setFieldValue={setFieldValue}
                              handleSubmit={handleSubmit}
                            />
                          </div>
                        ) 
                        // : selectedTitleTab === 4 ? (
                        //   <Dunning
                        //     values={values}
                        //     touched={touched}
                        //     errors={errors}
                        //     setFieldValue={setFieldValue}
                        //     handleSubmit={handleSubmit}
                        //   />
                        // ) 
                        : selectedTitleTab === (process.env.APP_TYPE=="public"?4:10) ? (
                          <div className="storeInfomation">
                            <StoreInfomation
                              values={values}
                              touched={touched}
                              errors={errors}
                              setFieldValue={setFieldValue}
                              handleSubmit={handleSubmit}
                            />
                          </div>
                        ) 
                        : selectedTitleTab === (process.env.APP_TYPE=="public"?5:4) ? (
                          <div className="storeInfomation">
                            <ProductExtention
                              values={values}
                              touched={touched}
                              errors={errors}
                              setFieldValue={setFieldValue}
                              handleSubmit={handleSubmit}
                            />
                          </div>
                        ) 
                        // : selectedTitleTab === (process.env.APP_TYPE=="public"?5:5)?(
                        //   <div className="storeInfomation">
                        //     <Legal
                        //       values={values}
                        //       touched={touched}
                        //       errors={errors}
                        //       setFieldValue={setFieldValue}
                        //       handleSubmit={handleSubmit}
                        //     />
                        //   </div>
                        // )
                        :""}
                      </Form>
                    )}
                  </Formik>
                )}
              </Tabs>
            </Page>
          ): (
            <Page title="Password protected">
              <Layout>
                <Layout.Section>
                  <Card sectioned>
                    <FormLayout>
                      <TextField
                        value={password}
                        onChange={value => setPassword(value)}
                        label="Password"
                        type="password"
                        error={passwordError && passwordError}
                      />
                      <Button primary loading={passwordLoading} onClick={verifyPassword} >Confirm</Button>
                    </FormLayout>
                  </Card>
                </Layout.Section>
              </Layout>
            </Page>
          )
        }
      </Frame>
    </AppLayout>
  );
};

export default Settings;
