import React,{useMemo,useCallback,useState,useEffect} from 'react'
import { Banner, Card, ContextualSaveBar, Form, Frame, Layout, List, Page, Spinner, Tabs, Toast, RadioButton,Button } from '@shopify/polaris';
import Discount from './HouseKeepingComponents/Discount';
import Export from './HouseKeepingComponents/Export';
import Taxes from './HouseKeepingComponents/Taxes';
import Legal from './Legal';
import Translation from './HouseKeepingComponents/Translation';
import Password from './HouseKeepingComponents/Password';
import {gql,useLazyQuery,useMutation} from '@apollo/client'
const HouseKeeping = () => {

  const updateSmsSettingQuery=gql`
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
  const tabs = useMemo(()=>([
    {
      id: 'discount',
      content: 'Discount',
    },
    {
      id: 'export',
      content: 'Export',
    },
    {
      id: 'sms',
      content: 'SMS',
    },
    {
      id: 'legal',
      content: 'Legal',
    },
    {
      id: 'translation',
      content: 'Translation',
    },
    {
      id: 'password',
      content: 'Password',
    }
  ]),[])

  const [formErrors, setFormErrors] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);
  const [selectedTitleTab, setSelectedTitleTab] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTitleTab(selectedTabIndex),
    [setSelectedTitleTab])

  const [updateSmsSettings,{data ,error,loading}]=useMutation(updateSmsSettingQuery);
  useEffect(() => {
    if(data && !error)
      console.log("Data.. Updated",data)
  }, [data])
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
    const handleSmsChange=(updated)=>{
      setSmsData({...smsData,...updated})
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
      else{
        setFormErrors(res.data.errors);
      }
    }).catch((error) => {
      setFormErrors(error);
    });
  }
  return (
      // <Tabs
      //   tabs={tabs}
      //   selected={selectedTitleTab}
      //   onSelect={handleTabChange}
      // >
      //   {
      //     selectedTitleTab === 0 ? <Discount /> :
      //       selectedTitleTab === 1 ? <Export /> :
      //         selectedTitleTab === 2 ? <Taxes /> :
      //           selectedTitleTab === 3 ? <Legal /> :
      //             selectedTitleTab === 4 ? <Translation /> :
      //               selectedTitleTab === 5 ? <Password /> : ""
      //   }
      // </Tabs>
      <>
      <div className="tab-section">
        <div class="tab-parent">
          <div class="tabs">
            <input type="radio" name="tab-btn" id="tab-btn-1" value=""  />
            <label for="tab-btn-1">Discount</label>
            <input type="radio" name="tab-btn" id="tab-btn-2" value="" />
            <label for="tab-btn-2">Export</label>
            <input type="radio" name="tab-btn" id="tab-btn-3" value="" checked />
            <label for="tab-btn-3">SMS</label>
            <input type="radio" name="tab-btn" id="tab-btn-4" value=""  />
            <label for="tab-btn-4">Legal</label>
            <input type="radio" name="tab-btn" id="tab-btn-5" value=""  />
            <label for="tab-btn-5">Translation</label>
            <input type="radio" name="tab-btn" id="tab-btn-6" value=""  />
            <label for="tab-btn-6">Password</label>
            <div id="content-1">
              Content 1...
          </div>
            <div id="content-2">
              Content 2...
          </div>
            <div id="content-3">

              <Layout>
                <Layout.Section>
                  <div class="tabs-btn">
                    <Button primary loading={loading} onClick={handleSmsSettingSubmit} >Save</Button>
                    <Button type="button">Cancel</Button>
                  </div>
                  <div className="smarty-sms-number">
                    <div className="action-smarty">
                      <p>Your SmartySMS Number is {smsData.shopPhone}</p>
                      <RadioButton label="Activate SmartySMS"  onChange={val=>setSmsData({...smsData,status:"active"})} checked={smsData.status=="active"} name="status" value="active" />
                      <RadioButton label="Disable SmartySMS"   onChange={val=>setSmsData({...smsData,status:"disable"})}  name="status" checked={smsData.status=="disable"} value="disable" />
                    </div>
                    <div className="sms-usage">
                      <p> SmartySMS Usage:</p>
                      <p>{smsData.smsCount} SMS  <span>${smsData.smsChargeAmount}</span></p>
                    </div>
                  </div>
                </Layout.Section>
              </Layout>
              <Taxes submitting={loading} setSmsData={handleSmsChange} handleSmsSettingSubmit={handleSmsSettingSubmit} />
            </div>
            <div id="content-4">
              Content 3...
          </div>
          <div id="content-5">
              Content 4...
          </div>
          <div id="content-6">
              Content 5...
          </div>
          </div>
         
        </div>
      </div>
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
            )}
      </>
  )
}

export default HouseKeeping
