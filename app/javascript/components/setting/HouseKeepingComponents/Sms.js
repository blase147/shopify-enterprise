import React,{useMemo,useCallback,useState,useEffect} from 'react'
import { Banner, Card, ContextualSaveBar, Form, Frame, Layout, List, Page, Spinner, Tabs, Toast, RadioButton,Button, TextField,Stack } from '@shopify/polaris';
import {gql,useMutation} from '@apollo/client';
import Taxes from './Taxes';
const Sms = ({handleBack}) => {

    const updateSmsSettingQuery = gql`
  mutation ($input: UpdateSmsSettingInput!) {
    updateSmsSetting(input: $input) {
      smsSetting {
        status
        delayOrder
        swapProduct
        orderTracking
        renewalReminder
        updateBilling
        skipUpdateNextCharge
        oneTimeUpsells
        failedRenewal
        editQuantity
        cancelSubscription
        winbackFlow
        deliveryStartTime
        deliveryEndTime
        renewalDuration
        updatedAt
        shopPhone
        smsCount
        smsChargeAmount
        optIn
      }
    }
  }
`;

    const [formErrors, setFormErrors] = useState([]);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);

    const [updateSmsSettings, { data, error, loading }] = useMutation(updateSmsSettingQuery);

    const [smsData, setSmsData] = useState({
        status: "",
        shopPhone: "",
        smsCount: "",
        smsChargeAmount: "",
        delayOrder: "",
        swapProduct: "",
        orderTracking: "",
        renewalReminder: "",
        updateBilling: "",
        skipUpdateNextCharge: "",
        oneTimeUpsells: "",
        failedRenewal: "",
        optIn: "",
        editQuantity: "",
        cancelSubscription: "",
        winbackFlow: "",
        deliveryStartTime: "",
        deliveryEndTime: "",
        renewalDuration: "",
    })

    const handleSmsChange = (updated) => {
        setSmsData({ ...smsData, ...updated })
    }
    const handleSmsSettingSubmit = () => {
        const { status, delayOrder, swapProduct, orderTracking, renewalReminder, updateBilling,
            skipUpdateNextCharge, oneTimeUpsells, failedRenewal, optIn, cancelSubscription,
            winbackFlow, deliveryStartTime, deliveryEndTime, renewalDuration } = smsData;
        updateSmsSettings({
            variables: {
                input: {
                    params: {
                        status, delayOrder, swapProduct, orderTracking, renewalReminder, updateBilling,
                        skipUpdateNextCharge, oneTimeUpsells, failedRenewal, optIn, cancelSubscription,
                        winbackFlow, deliveryStartTime, deliveryEndTime, renewalDuration
                    }
                }
            }
        }).then(res => {
            if (!res.data.errors) {
                setSaveSuccess(true);
            }
            else {
                setFormErrors(res.data.errors);
            }
        }).catch((error) => {
            setFormErrors(error);
        });
    }

    return (
        <>
        <Layout>
          <Layout.Section>
            <Stack>
              <Stack.Item >
                <p className="pointer" onClick={handleBack}>{'< Back'}</p>
              </Stack.Item>
            </Stack>
          </Layout.Section>
          </Layout>
            <Layout>
                <Layout.Section>
                    <div class="tabs-btn">
                        <Button primary loading={loading} onClick={handleSmsSettingSubmit} >Save</Button>
                        <Button type="button">Cancel</Button>
                    </div>
                    <div className="smarty-sms-number">
                        <div className="action-smarty">
                            <p>Your SmartySMS Number is {smsData.shopPhone}</p>
                            <RadioButton label="Activate SmartySMS" onChange={val => setSmsData({ ...smsData, status: "active" })} checked={smsData.status == "active"} name="status" value="active" />
                            <RadioButton label="Disable SmartySMS" onChange={val => setSmsData({ ...smsData, status: "disable" })} name="status" checked={smsData.status == "disable"} value="disable" />
                        </div>
                        <div className="sms-usage">
                            <p> SmartySMS Usage:</p>
                            <p>{smsData.smsCount} SMS  <span>${smsData.smsChargeAmount}</span></p>
                        </div>
                    </div>
                </Layout.Section>
            </Layout>
            <Taxes submitting={loading} setSmsData={handleSmsChange} handleSmsSettingSubmit={handleSmsSettingSubmit} />
            {/* Banners */}
            {saveSuccess && (
                <Toast
                    content="Setting is saved"
                    onDismiss={hideSaveSuccess}
                />
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
            )
            }
    </>
    )
}

export default Sms
