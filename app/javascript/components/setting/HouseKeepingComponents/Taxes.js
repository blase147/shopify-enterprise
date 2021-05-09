import { useLazyQuery, gql } from "@apollo/client";
import {
    Button,
    Card,
    DisplayText,
    Heading,
    Layout,
    RadioButton,
    Stack,
    TextField,
    TextStyle,
    Checkbox
  } from "@shopify/polaris";
  import React,{useState,useEffect,handleSmsSettingSubmit} from "react";

  const Taxes = ({setSmsData,smsData,handleSmsSettingSubmit}) => {
  const fetchSetting=gql`
  query{
    fetchSmsSetting {
            status
            delayOrder
            swapProduct
            orderTracking
            renewalReminder
            updateBilling
            skipUpdateNextCharge
            oneTimeUpsells
            failedRenewal
            cancelReactivateSubscription
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
    }
}`;
const [formData,setFormData]=useState({
    delayOrder:"",
    swapProduct:"",
    orderTracking:"",
    renewalReminder:"",
    updateBilling:"",
    skipUpdateNextCharge:"",
    oneTimeUpsells:"",
    failedRenewal:"",
    cancelReactivateSubscription:"",
    editQuantity:"",
    cancelSubscription:"",
    winbackFlow:"",
    deliveryStartTime:"",
    deliveryEndTime:"",
    renewalDuration:"",
  })

  useEffect(() => {
      setSmsData(formData)
      console.log("changes---",formData)
  }, [formData])

const [getSetting, { loading, data }] = useLazyQuery(fetchSetting);
    useEffect(()=>{
      getSetting();
    },[])

      useEffect(() => {
          console.log("Data Settings:", data)
          if (data && !loading) {
              const { fetchSmsSetting } = data;
              const { status, delayOrder, swapProduct, orderTracking, renewalReminder, updateBilling,
                  skipUpdateNextCharge, oneTimeUpsells, failedRenewal, cancelReactivateSubscription,
                  editQuantity, cancelSubscription, winbackFlow, deliveryStartTime, deliveryEndTime,
                  renewalDuration, shopPhone, smsCount, smsChargeAmount } = fetchSmsSetting;
              setFormData({
                  ...formData, delayOrder, swapProduct, orderTracking, renewalReminder, updateBilling,
                  skipUpdateNextCharge, oneTimeUpsells, failedRenewal, cancelReactivateSubscription,
                  editQuantity, cancelSubscription, winbackFlow, deliveryStartTime, deliveryEndTime,
                  renewalDuration
              });
              setSmsData({
                  status, delayOrder, swapProduct, orderTracking, renewalReminder, updateBilling,
                  skipUpdateNextCharge, oneTimeUpsells, failedRenewal, cancelReactivateSubscription,
                  editQuantity, cancelSubscription, winbackFlow, deliveryStartTime, deliveryEndTime,
                  renewalDuration, shopPhone, smsCount, smsChargeAmount
              });
          }
      }, [data])
      
      

    return (
      <React.Fragment>
            <div className="sms-tab">
                <div className="sms-options">
          <Card title="SMS Options" sectioned>
          <Checkbox name="delayOrder" label="Delay Order" checked={formData.delayOrder=="true"} onChange={val=>setFormData({...formData,delayOrder:val?"true":"false"})}  />
          <Checkbox name="swapProduct" label="Swap product"  checked={formData.swapProduct=="true"} onChange={val=>setFormData({...formData,swapProduct:val?"true":"false"})}  />
          <Checkbox name="orderTracking" label="Order tracking"  checked={formData.orderTracking=="true"} onChange={val=>setFormData({...formData,orderTracking:val?"true":"false"})} />
          <Checkbox name="renewalReminder" label="Renewal Reminder"  checked={formData.renewalReminder=="true"} onChange={val=>setFormData({...formData,renewalReminder:val?"true":"false"})} />

          <Checkbox name="updateBilling" label="Update Billing"  checked={formData.updateBilling=="true"} onChange={val=>setFormData({...formData,updateBilling:val?"true":"false"})} />
          <Checkbox name="skipUpdateNextCharge" label="Skip/Update next charge"  checked={formData.skipUpdateNextCharge=="true"} onChange={val=>setFormData({...formData,skipUpdateNextCharge:val?"true":"false"})} />
          <Checkbox name="oneTimeUpsells" label="One-time upsells"  checked={formData.oneTimeUpsells=="true"} onChange={val=>setFormData({...formDataata,oneTimeUpsells:val?"true":"false"})} />
          <Checkbox name="failedRenewal" label="Failed Renewal"  checked={formData.failedRenewal=="true"} onChange={val=>setFormData({...formData,failedRenewal:val?"true":"false"})} />

          <Checkbox name="cancelReactivateSubscription" label="Cancel/Reactive subscription"  checked={formData.cancelReactivateSubscription=="true"} onChange={val=>setFormData({...formData,cancelReactivateSubscription:val?"true":"false"})} />
          <Checkbox name="editQuantity" label="Edit quantity"  checked={formData.editQuantity=="true"} onChange={val=>setFormData({...formData,editQuantity:val?"true":"false"})} />
          <Checkbox name="cancelSubscription" label="Cancel subscrition"  checked={formData.cancelSubscription=="true"} onChange={val=>setFormData({...formData,cancelSubscription:val?"true":"false"})} />
          <Checkbox name="winbackFlow" label="Windback flow"  checked={formData.winbackFlow=="true"} onChange={val=>setFormData({...formData,winbackFlow:val?"true":"false"})} />

          </Card>
        </div>
            <div className="sms-config">
            <Card title="SMS Configuration" sectioned>
            <DisplayText size="small">SMS Delivery Timeline (24 Hour format in PST):</DisplayText>
              <Layout>
                <Layout.Section oneHalf>
                  <Stack>
                    <Stack.Item>
                      <Stack>
                        <TextField name="deliveryStartTime" value={formData.deliveryStartTime} onChange={val=>setFormData({...formData,deliveryStartTime:val})} placeholder="09:00" />
                        <Button onClick={handleSmsSettingSubmit} >Start</Button>
                      </Stack>
                    </Stack.Item>
                    <Stack.Item>
                      <Stack>
                        <TextField name="deliveryEndTime" value={formData.deliveryEndTime} onChange={val=>setFormData({...formData,deliveryEndTime:val})} placeholder="20:00" />
                        <Button onClick={handleSmsSettingSubmit} >End</Button>
                      </Stack>
                    </Stack.Item>
                  </Stack>
                </Layout.Section>
                <Layout.Section oneHalf>
                  <Stack>
                    <Stack.Item>
                      <DisplayText size="small">New Renewel</DisplayText>
                      <Stack>
                        <TextField name="renewalDuration" value={formData.renewalDuration} onChange={val=>setFormData({...formData,renewalDuration:val})} placeholder="3 days" />
                        <Button onClick={handleSmsSettingSubmit} >Save</Button>
                      </Stack>
                    </Stack.Item>
                  </Stack>
                </Layout.Section>
              </Layout>
            </Card>
            </div>
            <div className ="faq-sms">
            <Card sectioned>
              <h1>Frequently Asked Questions </h1>
              <Stack vertical>
                <Stack.Item>
                  <Heading>
                    SHOPIFY ONLY: Are tax rates in lorem ipsum synced with tax
                    rates in Shopify?
                  </Heading>
                  <TextStyle variation="subdued">
                    {" "}
                    When you first install lorem, our system will sync the
                    province taxes to match the settings in Shopify once. Going
                    forward, if this is edited in Shopify, it will not sync
                    automatically with loreme, it must be updated independently
                    through th
                  </TextStyle>
                </Stack.Item>
                <Stack.Item>
                  <Heading>
                    SHOPIFY ONLY: Are tax rates in lorem ipsum synced with tax
                    rates in Shopify?
                  </Heading>
                  <TextStyle variation="subdued">
                    {" "}
                    When you first install lorem, our system will sync the
                    province taxes to match the settings in Shopify once. Going
                    forward, if this is edited in Shopify, it will not sync
                    automatically with loreme, it must be updated independently
                    through th
                  </TextStyle>
                </Stack.Item>
                <Stack.Item>
                  <Heading>
                    SHOPIFY ONLY: Are tax rates in lorem ipsum synced with tax
                    rates in Shopify?
                  </Heading>
                  <TextStyle variation="subdued">
                    {" "}
                    When you first install lorem, our system will sync the
                    province taxes to match the settings in Shopify once. Going
                    forward, if this is edited in Shopify, it will not sync
                    automatically with loreme, it must be updated independently
                    through th
                  </TextStyle>
                </Stack.Item>
              </Stack>
            </Card>
          </div>
          </div>
      </React.Fragment>
    );
  };
  export default Taxes;