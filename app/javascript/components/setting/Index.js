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
// import Legal from './Legal';
import ProductExtention from './ProductExtention';
import StoreInfomation from './StoreInformation';
import Translation from './HouseKeepingComponents/Translation';
import Legal from './HouseKeepingComponents/Legal';
//Settings Images
import SettingImage from '../../../assets/images/settings/setting.svg'
import BillingImage from '../../../assets/images/settings/billing.svg'
import CustomerImage from '../../../assets/images/settings/customer.svg'
import DiscountImage from '../../../assets/images/settings/discount.svg'
import EmailImage from '../../../assets/images/settings/email.svg'
import ExportImage from '../../../assets/images/settings/export.svg'
import InformationImage from '../../../assets/images/settings/information.svg'
import LegalImage from '../../../assets/images/settings/legal.svg'
import PasswordImage from '../../../assets/images/settings/password.svg'
import SMSImage from '../../../assets/images/settings/sms.svg'
import TranslationImage from '../../../assets/images/settings/translation.svg'



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
        designType

        recurringChargeStatus
        chargeConfirmationLink
      }
    }
  `;
  let { id } = useParams();
  const [getData,{ data, loading, error, refetch }] = useLazyQuery(GET_DATA, {
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
  const [selectedSetting,setSelectedSetting]=useState('');
  const handleBackSetting=useCallback(()=>{
    setSelectedSetting('');
  },[setSelectedSetting])

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
    if(passwordConfirmed){
      getData();
    }
  },[passwordConfirmed])


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
  const settings=[
    {
      key:"product_extention",
      title:"Product Extension",
      img:SettingImage,
      desc:"Manage your product extentions."
    },
    {
      key:"email_notification",
      title:"Email Notifications",
      img:EmailImage,
      desc:"Manage email notifications sent to you and your customers."
    },
    ...(process.env.APP_TYPE=="public" ?
    [{
      key:"store_information",
      title:"Store Information",
      img:InformationImage,
      desc:"Manage the information your customers can view on your store."
    },
    {
      key:"discount",
      title:"Discount",
      img:DiscountImage,
      desc:"Enable and manage your store's discount."
    }]:[]),
    {
      key:"billing",
      title:"Billing",
      img:BillingImage,
      desc:"Manage your billing information and view your invoices."
    },
    ...(process.env.APP_TYPE=="public" ?
    [
    {
      key:"legal",
      title:"Legal",
      img:LegalImage,
      desc:"Manage your store's legal pages."
    },
    {
      key:"export",
      title:"Export",
      img:ExportImage,
      desc:"Enable and manage your store's discount."
    }]:[]),
    {
      key:"sms",
      title:"SMS",
      img:SMSImage,
      desc:"View and update your store details."
    },
    ...(process.env.APP_TYPE=="public" ?
    [
    {
      key:"translation",
      title:"Translation",
      img:TranslationImage,
      desc:"View and update your customer’s portal details."
    }]:[]),
    {
      key:"password",
      title:"Password",
      img:PasswordImage,
      desc:"Manage your Password information."
    },
    {
      key:"customer-portal",
      title:"Customer Portal",
      img:CustomerImage,
      desc:"Manage your customer information."
    }
  ]
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
            // <Page title="Settings">
            //   <Tabs
            //     tabs={tabs}
            //     selected={selectedTitleTab}
            //     onSelect={handleTabChange}
            //   >
            <>
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
                      delete values.recurringChargeStatus;
                      delete values.chargeConfirmationLink;
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
                        <>
                          {/* new settings bar */}
                          {!selectedSetting &&
                            <>
                              <div class="setting-grid">
                                {settings.map(setting => (
                                  <div key={Math.random()} class="tabs-parents pointer" onClick={()=>setSelectedSetting(setting.key)}>
                                    <div class="icon-sec">
                                      <img src={setting.img} />
                                    </div>
                                    <div class="tab-info">
                                      <h4>{setting.title}</h4>
                                      <p>{setting.desc}</p>
                                    </div>
                                  </div>
                                ))
                                }
                              </div>
                            </>
                          }
                          {/* settings layout */}
                        {
                          selectedSetting &&
                          <>
                            {selectedSetting === 'house_keeping' ? (
                              <HouseKeeping

                              />) :
                              selectedSetting === 'billing' ? (
                                <Billing
                                  values={values}
                                  touched={touched}
                                  errors={errors}
                                  setFieldValue={setFieldValue}
                                  handleBack={handleBackSetting}
                                />
                              ) : selectedSetting === 'customer-portal' ? (
                                <CustomPortal
                                  values={values}
                                  touched={touched}
                                  errors={errors}
                                  setFieldValue={setFieldValue}
                                  handleSubmit={handleSubmit}
                                  refetch={refetch}
                                  isSubmitting={isSubmitting}
                                  handleBack={handleBackSetting}
                                />
                              ) : selectedSetting === 'email_notification' ? (
                                <div className="EmailNotification">
                                  <EmailNotification
                                    values={values}
                                    touched={touched}
                                    errors={errors}
                                    setFieldValue={setFieldValue}
                                    handleSubmit={handleSubmit}
                                    handleBack={handleBackSetting}
                                  />
                                </div>
                              ): selectedSetting === 'store_information' ? (
                                  <div className="storeInfomation">
                                    <StoreInfomation
                                      values={values}
                                      touched={touched}
                                      errors={errors}
                                      setFieldValue={setFieldValue}
                                      handleSubmit={handleSubmit}
                                      handleBack={handleBackSetting}
                                    />
                                  </div>
                                ): selectedSetting === 'product_extention' ? (
                                    <div className="storeInfomation">
                                      <ProductExtention
                                        values={values}
                                        touched={touched}
                                        errors={errors}
                                        setFieldValue={setFieldValue}
                                        handleSubmit={handleSubmit}
                                        handleBack={handleBackSetting}
                                      />
                                    </div>
                                  ):selectedSetting === 'discount' ? (
                                    <>
                                    </>
                                  )
                                  :selectedSetting === 'export' ? (
                                    <>
                                    </>
                                  )
                                  :selectedSetting === 'sms' ? (
                                    <>
                                    </>
                                  )
                                  :selectedSetting === 'legal' ? (
                                    <>
                                    <Legal
                                    handleBack={handleBackSetting}
                                    />
                                    </>
                                  )
                                  :selectedSetting === 'translation' ? (
                                    <>
                                    <Translation
                                    handleBack={handleBackSetting}
                                     />
                                    </>
                                  )
                                  :selectedSetting === 'password' ? (
                                    <>
                                    <Password
                                    handleBack={handleBackSetting}
                                    />
                                    </>
                                  ): ""}
                          </>
                        }
                        </>

                      </Form>
                    )}
                  </Formik>
                )}

              {/* </Tabs>
            </Page> */}
            </>
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
