import React,{useMemo,useCallback,useState,useEffect} from 'react'
import { Banner, Card, ContextualSaveBar, Form, Frame, Layout, List, Page, Spinner, Tabs, Toast, RadioButton,Button, TextField } from '@shopify/polaris';
import Discount from './HouseKeepingComponents/DiscountComponents/Discount';
import Taxes from './HouseKeepingComponents/Taxes';
import Legal from './HouseKeepingComponents/Legal';
import Translation from './HouseKeepingComponents/Translation';
import Password from './HouseKeepingComponents/Password';
import {gql,useLazyQuery,useMutation} from '@apollo/client'
import DiscountForm from './HouseKeepingComponents/DiscountComponents/DiscountForm';
import Export from './HouseKeepingComponents/ExportComponents/Export';
import ExportForm from './HouseKeepingComponents/ExportComponents/ExportForm';
import { isEmpty } from 'lodash';
const HouseKeeping = () => {

// Mutations
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

  const updatePasswordMutation = gql`
mutation ($input: UpdatePasswordInput!) {
  updatePassword(input: $input) {
      password {
          success
      }
  }
}
`;

  const [formErrors, setFormErrors] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);

  const [selectedTab, setSelectedTab] = useState(2);
  const [showForm,setShowForm]=useState(false)
  const [exportData,setExportData]=useState(null);

  const handleShowForm=useCallback(
    () => {
     setShowForm(true)
    },
    [setShowForm]
  )
  const handleCloseForm=useCallback(
    (data,filters) => {
     setShowForm(false);
     if(!isEmpty(data) && !isEmpty(filters)){
      setExportData({data:data,filters:filters})
     }
    },
    [setShowForm]
  )

  useEffect (( ) =>{
    setShowForm(false)
  },[selectedTab])
  // const handleTabChange = useCallback(
  //   (selectedTabIndex) => setSelectedTitleTab(selectedTabIndex),
  //   [setSelectedTitleTab])

  const [updateSmsSettings,{data ,error,loading}]=useMutation(updateSmsSettingQuery);

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
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [updatePassword, {data1, error1, loading:loadingPssword}] = useMutation(updatePasswordMutation)
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

  // Change pasword
  const handleChangePassword = () => {
    updatePassword({
      variables: {
        input: {
          params: {
            password, passwordConfirmation
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
    <>
      <div className="tab-section">
        <div class="tab-parent">
          <div class="tabs-sms">
            {
            process.env.APP_TYPE=="public" &&
            <>
            <input type="radio" name="tab-btn" id="tab-btn-1" value="" onChange={e=>setSelectedTab(0)} checked={selectedTab==0}  />
            <label for="tab-btn-1">Discount</label>
            <input type="radio" name="tab-btn" id="tab-btn-2" value="" onChange={e=>setSelectedTab(1)} checked={selectedTab==1} />
            <label for="tab-btn-2">Export</label>
            </>
            }
            <input type="radio" name="tab-btn" id="tab-btn-3" value="" onChange={e=>setSelectedTab(2)} checked={selectedTab==2} />
            <label for="tab-btn-3">SMS</label>
            {
            process.env.APP_TYPE=="public" &&
            <>
            <input type="radio" name="tab-btn" id="tab-btn-4" value="" onChange={e=>setSelectedTab(3)} checked={selectedTab==3} />
            <label for="tab-btn-4">Legal</label>
            <input type="radio" name="tab-btn" id="tab-btn-5" value="" onChange={e=>setSelectedTab(4)} checked={selectedTab==4} />
            <label for="tab-btn-5">Translation</label>
            </>
            }
            <input type="radio" name="tab-btn" id="tab-btn-6" value="" onChange={e=>setSelectedTab(5)} checked={selectedTab==5} />
            <label for="tab-btn-6">Password</label>
          </div>
        </div>
        <div className="content">
          {
            selectedTab==0 ?
            <>
            {
              showForm ?
              <DiscountForm handleCloseForm={handleCloseForm} />:
              <Discount handleDiscountCodeForm={handleShowForm}/>
            }
            </>
            :
            selectedTab==1?
            <>
            {
              showForm ?
              <ExportForm handleCloseForm={handleCloseForm}/>:
              <Export exportData={exportData} handleCreateExport={handleShowForm}/>
            }
            </>:
            selectedTab==2?
            <>
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
            </>:
            selectedTab==3?
            <Legal/>:
            selectedTab==4?
            <Translation/>:
            selectedTab==5?
            <>
              <Layout>
                <Layout.Section>
                  <p className="default-pass">
                    Default Password: <strong>AdminAlaska777</strong>
                  </p>
                  <div className="password-fields">
                    <TextField
                      value={password}
                      onChange={value => setPassword(value)}
                      label="Password"
                      type="password"
                    />
                    <TextField
                      value={passwordConfirmation}
                      onChange={value => setPasswordConfirmation(value)}
                      label="Confirm Password"
                      type="password"
                    />
                  </div>
                  <div class="tabs-btn">
                    <Button primary loading={loadingPssword} onClick={handleChangePassword}>Save</Button>
                    <Button type="button">Cancel</Button>
                  </div>
                </Layout.Section>
              </Layout>
            </>:""
          }
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
