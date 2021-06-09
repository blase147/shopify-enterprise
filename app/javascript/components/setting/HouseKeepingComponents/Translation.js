import React, { useEffect,useState,useCallback } from 'react'
import './translation.css'
import {
  Card,
  Layout,
  TextField,
  SkeletonDisplayText,
  Stack,
  Button,
  Toast,
  Spinner
} from '@shopify/polaris';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { isEmpty } from 'lodash';
const Translation = () => {

  const fetchSettingQuery=gql`
  query{
    fetchTranslation {
        id
        sidebarSubscription
        sidebarActive
        sidebarCancelled
        sidebarDeliverySchedule
        sidebarOrderHistory
        sidebarAddresses
        sidebarBilling
        sidebarAccount
        homeTabActiveSubscriptions
        homeTabNoSubscriptionsFound
        homeTabQuantity
        homeTabEdtButton
        homeTabDelayNextOrderBtn
        homeTabDeliveryScheduleBtn
        homeTabEditSubscriptionBtn
        homeTabDeliveryAddress
        homeTabEditBtn
        homeTabRecommendedForYou
        homeTabAddSubscription
        homeTabApplyDiscount
        homeTabStartDate
        homeTabEstNextDelivery
        homeTabLastCardCharge
        upsellTitle
        upsellTimeLeft
        upsellProductVariants
        upsellPayNow
        upsellNoThanks
        upsellSearchForProduct
        upsellSearch
        upsellClear
        delayPopupChooseDate
        delayPopupDelayTwoWeeks
        delayPopupDelayOneMonth
        delayPopupDelayTwoMonth
        delayPopupDelayThreeMonth
        delayPopupBack
        delayPopupApply
        deliverySchedulePopupNextOrder
        deliverySchedulePopupOrderProduct
        deliverySchedulePopupOrderAddress
        deliverySchedulePopupScheduledOrders
        deliverySchedulePopupSkip
        deliverySchedulePopupBack
        deliverySchedulePopupApply
        editSubscriptionPopupEstNextDelivery
        editSubscriptionPopupNextCardCharge
        editSubscriptionPopupUpgradeSubscription
        editSubscriptionPopupSwapSubscription
        editSubscriptionPopupAskAQuestion
        editSubscriptionPopupCancelSubscription
        swapSubscriptionPopupSwapSubscriptionTo
        swapSubscriptionPopupSwapSubscriptionButton
        upgradeSubscriptionPopupSwapSubscriptionTo
        upgradeSubscriptionPopupUpgradeSubscriptionBtn
        cancelledTabCancelledSubscriptions
        cancelledTabReactivateBtn
        cancelledTabStartDate
        cancelledTabQuantity
        cancelledLoyaltyCancelSubscription
        cancelledLoyaltyGetReward
        cancelledLoyaltyCancelAnyway
        cancelledLoyaltyKeepPoints
        cancelledNoLoyaltyCancelAnyway
        cancelledNoLoyaltyKeepSubscription
        cancelledReasonsCancelSubscription
        cancelledReasonsKeepSubscription
        cancelledReasonsCancel
        deliveryTabMyNextOrder
        deliveryTabMyScheduledOrder
        deliveryTabNoSubscriptionsFound
        deliveryTabEstDelivery
        deliveryTabOrderProduct
        deliveryTabOrderAddress
        deliveryTabSkip
        orderHistoryTabMyOrderHistory
        orderHistoryTabNoSubscriptions
        orderHistoryTabDate
        orderHistoryTabAmount
        orderHistoryTabOrderNo
        orderHistoryTabView
        orderHistoryTabInvoice
        addressTabMyAddress
        addressTabNoSubscriptionsFound
        addressTabEdit
        addressTabPhone
        addressTabCompany
        addressTabAddress
        addressTabAddAddress
        addAddressPopupFirstName
        addAddressPopupLastName
        addAddressPopupAddress1
        addAddressPopupAddress2
        addAddressPopupCompany
        addAddressPopupCity
        addAddressPopupCountry
        addAddressPopupZip
        addAddressPopupState
        addAddressPopupPhone
        addAddressPopupUpdate
        billingTabBillingInformation
        billingTabBillingNoSubscriptionsFound
        billingTabCardOnFile
        billingTabUpdate
        billingTabEdit
        billingTabPhone
        billingTabCompany
        billingTabAddress
        updatePaymentPopupCardName
        updatePaymentPopupCardNumber
        updatePaymentPopupExpMonth
        updatePaymentPopupExpDate
        updatePaymentPopupCvv
        updatePaymentPopupUpdateCard
        accountTabMyAccountDetail
        accountTabNoSubscriptionsFound
        accountTabFirstName
        accountTabLastName
        accountTabEmail
        accountTabSaveButton
        delayShipmentPopupTitle
        delayShipmentPopupBack
        delayShipmentPopupApply
    }
}
  `;

  const updateSettingQuery=gql`
  mutation ($input: UpdateTranslationInput!) {
    updateTranslation(input: $input) {
        translation {
            id
            sidebarSubscription
            sidebarActive
            sidebarCancelled
            sidebarDeliverySchedule
            sidebarOrderHistory
            sidebarAddresses
            sidebarBilling
            sidebarAccount
            homeTabActiveSubscriptions
            homeTabNoSubscriptionsFound
            homeTabQuantity
            homeTabEdtButton
            homeTabDelayNextOrderBtn
            homeTabDeliveryScheduleBtn
            homeTabEditSubscriptionBtn
            homeTabDeliveryAddress
            homeTabEditBtn
            homeTabRecommendedForYou
            homeTabAddSubscription
            homeTabApplyDiscount
            homeTabStartDate
            homeTabEstNextDelivery
            homeTabLastCardCharge
            upsellTitle
            upsellTimeLeft
            upsellProductVariants
            upsellPayNow
            upsellNoThanks
            upsellSearchForProduct
            upsellSearch
            upsellClear
            delayPopupChooseDate
            delayPopupDelayTwoWeeks
            delayPopupDelayOneMonth
            delayPopupDelayTwoMonth
            delayPopupDelayThreeMonth
            delayPopupBack
            delayPopupApply
            deliverySchedulePopupNextOrder
            deliverySchedulePopupOrderProduct
            deliverySchedulePopupOrderAddress
            deliverySchedulePopupScheduledOrders
            deliverySchedulePopupSkip
            deliverySchedulePopupBack
            deliverySchedulePopupApply
            editSubscriptionPopupEstNextDelivery
            editSubscriptionPopupNextCardCharge
            editSubscriptionPopupUpgradeSubscription
            editSubscriptionPopupSwapSubscription
            editSubscriptionPopupAskAQuestion
            editSubscriptionPopupCancelSubscription
            swapSubscriptionPopupSwapSubscriptionTo
            swapSubscriptionPopupSwapSubscriptionButton
            upgradeSubscriptionPopupSwapSubscriptionTo
            upgradeSubscriptionPopupUpgradeSubscriptionBtn
            cancelledTabCancelledSubscriptions
            cancelledTabReactivateBtn
            cancelledTabStartDate
            cancelledTabQuantity
            cancelledLoyaltyCancelSubscription
            cancelledLoyaltyGetReward
            cancelledLoyaltyCancelAnyway
            cancelledLoyaltyKeepPoints
            cancelledNoLoyaltyCancelAnyway
            cancelledNoLoyaltyKeepSubscription
            cancelledReasonsCancelSubscription
            cancelledReasonsKeepSubscription
            cancelledReasonsCancel
            deliveryTabMyNextOrder
            deliveryTabMyScheduledOrder
            deliveryTabNoSubscriptionsFound
            deliveryTabEstDelivery
            deliveryTabOrderProduct
            deliveryTabOrderAddress
            deliveryTabSkip
            orderHistoryTabMyOrderHistory
            orderHistoryTabNoSubscriptions
            orderHistoryTabDate
            orderHistoryTabOrderNo
            orderHistoryTabAmount
            orderHistoryTabView
            orderHistoryTabInvoice
            addressTabMyAddress
            addressTabNoSubscriptionsFound
            addressTabEdit
            addressTabPhone
            addressTabCompany
            addressTabAddress
            addressTabAddAddress
            addAddressPopupFirstName
            addAddressPopupLastName
            addAddressPopupAddress1
            addAddressPopupAddress2
            addAddressPopupCompany
            addAddressPopupCity
            addAddressPopupCountry
            addAddressPopupZip
            addAddressPopupState
            addAddressPopupPhone
            addAddressPopupUpdate
            billingTabBillingInformation
            billingTabBillingNoSubscriptionsFound
            billingTabCardOnFile
            billingTabUpdate
            billingTabEdit
            billingTabPhone
            billingTabCompany
            billingTabAddress
            updatePaymentPopupCardName
            updatePaymentPopupCardNumber
            updatePaymentPopupExpMonth
            updatePaymentPopupExpDate
            updatePaymentPopupCvv
            updatePaymentPopupUpdateCard
            accountTabMyAccountDetail
            accountTabNoSubscriptionsFound
            accountTabFirstName
            accountTabLastName
            accountTabEmail
            accountTabSaveButton
            delayShipmentPopupTitle
            delayShipmentPopupBack
            delayShipmentPopupApply
        }
    }
}
  `;

  const [formData,setFormData]=useState({
        sidebarSubscription:"",
        sidebarActive:"",
        sidebarCancelled:"",
        sidebarDeliverySchedule:"",
        sidebarOrderHistory:"",
        sidebarAddresses:"",
        sidebarBilling:"",
        sidebarAccount:"",
        homeTabActiveSubscriptions:"",
        homeTabNoSubscriptionsFound:"",
        homeTabQuantity:"",
        homeTabEdtButton:"",
        homeTabDelayNextOrderBtn:"",
        homeTabDeliveryScheduleBtn:"",
        homeTabEditSubscriptionBtn:"",
        homeTabDeliveryAddress:"",
        homeTabEditBtn:"",
        homeTabRecommendedForYou:"",
        homeTabAddSubscription:"",
        homeTabApplyDiscount:"",
        homeTabStartDate:"",
        homeTabEstNextDelivery:"",
        homeTabLastCardCharge:"",
        upsellTitle:"",
        upsellTimeLeft:"",
        upsellProductVariants:"",
        upsellPayNow:"",
        upsellNoThanks:"",
        upsellSearchForProduct:"",
        upsellSearch:"",
        upsellClear:"",
        delayPopupChooseDate:"",
        delayPopupDelayTwoWeeks:"",
        delayPopupDelayOneMonth:"",
        delayPopupDelayTwoMonth:"",
        delayPopupDelayThreeMonth:"",
        delayPopupBack:"",
        delayPopupApply:"",
        deliverySchedulePopupNextOrder:"",
        deliverySchedulePopupOrderProduct:"",
        deliverySchedulePopupOrderAddress:"",
        deliverySchedulePopupScheduledOrders:"",
        deliverySchedulePopupSkip:"",
        deliverySchedulePopupBack:"",
        deliverySchedulePopupApply:"",
        editSubscriptionPopupEstNextDelivery:"",
        editSubscriptionPopupNextCardCharge:"",
        editSubscriptionPopupUpgradeSubscription:"",
        editSubscriptionPopupSwapSubscription:"",
        editSubscriptionPopupAskAQuestion:"",
        editSubscriptionPopupCancelSubscription:"",
        swapSubscriptionPopupSwapSubscriptionTo:"",
        swapSubscriptionPopupSwapSubscriptionButton:"",
        upgradeSubscriptionPopupSwapSubscriptionTo:"",
        upgradeSubscriptionPopupUpgradeSubscriptionBtn:"",
        cancelledTabCancelledSubscriptions:"",
        cancelledTabReactivateBtn:"",
        cancelledTabStartDate:"",
        cancelledTabQuantity:"",
        cancelledLoyaltyCancelSubscription:"",
        cancelledLoyaltyGetReward:"",
        cancelledLoyaltyCancelAnyway:"",
        cancelledLoyaltyKeepPoints:"",
        cancelledNoLoyaltyCancelAnyway:"",
        cancelledNoLoyaltyKeepSubscription:"",
        cancelledReasonsCancelSubscription:"",
        cancelledReasonsKeepSubscription:"",
        cancelledReasonsCancel:"",
        deliveryTabMyNextOrder:"",
        deliveryTabMyScheduledOrder:"",
        deliveryTabNoSubscriptionsFound:"",
        deliveryTabEstDelivery:"",
        deliveryTabOrderProduct:"",
        deliveryTabOrderAddress:"",
        deliveryTabSkip:"",
        orderHistoryTabMyOrderHistory:"",
        orderHistoryTabNoSubscriptions:"",
        orderHistoryTabDate:"",
        orderHistoryTabOrderNo:"",
        orderHistoryTabAmount:"",
        orderHistoryTabView:"",
        orderHistoryTabInvoice:"",
        addressTabMyAddress:"",
        addressTabNoSubscriptionsFound:"",
        addressTabEdit:"",
        addressTabPhone:"",
        addressTabCompany:"",
        addressTabAddress:"",
        addressTabAddAddress:"",
        addAddressPopupFirstName:"",
        addAddressPopupLastName:"",
        addAddressPopupAddress1:"",
        addAddressPopupAddress2:"",
        addAddressPopupCompany:"",
        addAddressPopupCity:"",
        addAddressPopupCountry:"",
        addAddressPopupZip:"",
        addAddressPopupState:"",
        addAddressPopupPhone:"",
        addAddressPopupUpdate:"",
        billingTabBillingInformation:"",
        billingTabBillingNoSubscriptionsFound:"",
        billingTabCardOnFile:"",
        billingTabUpdate:"",
        billingTabEdit:"",
        billingTabPhone:"",
        billingTabCompany:"",
        billingTabAddress:"",
        updatePaymentPopupCardName:"",
        updatePaymentPopupCardNumber:"",
        updatePaymentPopupExpMonth:"",
        updatePaymentPopupExpDate:"",
        updatePaymentPopupCvv:"",
        updatePaymentPopupUpdateCard:"",
        accountTabMyAccountDetail:"",
        accountTabNoSubscriptionsFound:"",
        accountTabFirstName:"",
        accountTabLastName:"",
        accountTabEmail:"",
        accountTabSaveButton:"",
        delayShipmentPopupTitle:"",
        delayShipmentPopupBack:"",
        delayShipmentPopupApply:""
  })
  const setField=(name,data)=>{
    setFormData({...formData,[name]:data});
  }

  const [fetchSetting, { data:setting, loading: fetchLoading }] = useLazyQuery(fetchSettingQuery);
  const [updateSetting, { loading: updateLoading }] = useMutation(updateSettingQuery);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);
  // Showing Data
  useEffect(()=>{
    fetchSetting()
  },[])
  useEffect(()=>{
    if(!isEmpty(setting?.fetchTranslation)){
      console.log("Translation setting",setting);
      setFormData({...setting?.fetchTranslation})
    }
  },[setting])
  //Saving Data...
  const handleSubmit=()=>{
    if(!isEmpty(formData)){
      updateSetting({
        variables:{
          input: {
            params: {
               ...formData
            }
        }
        }
      }).then((resp) => {
        const data = resp?.data;
        const errors = data?.errors;
        if (!errors)
          setSaveSuccess(true);
      })
    }
  }
  useEffect(() => {
    if(!fetchLoading){
      var coll = document.getElementsByClassName("collapsible-translatoin");
      var i;
      for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
          this.classList.toggle("active-collpase");
          var content = this.nextElementSibling;
          if (content.style.maxHeight){
            content.style.maxHeight = null;
          } else {
            content.style.maxHeight = content.scrollHeight + "px";
          } 
        });
      }
    }

  }, [fetchLoading])

  const [expandAll,setExpandAll]=useState(false)
  const handleExpand=()=>{
    var coll = document.getElementsByClassName("collapsible-translatoin");
    for (let i = 0; i < coll.length; i++) {
        if(!expandAll){
          coll[i].classList.add("active-collpase");
        }
        
        if(expandAll){
          coll[i].classList.remove("active-collpase");
        }
        
        var content = coll[i].nextElementSibling;
        if (!expandAll){
          setExpandAll(true);
          content.style.maxHeight = content.scrollHeight + "px";
        }else if(expandAll){
          setExpandAll(false);
          content.style.maxHeight = null;
        } 
      }
    }

    return (
        <>
        <Layout>
        
        {fetchLoading ? (
        <Card>
          <Spinner
            accessibilityLabel="Spinner example"
            size="large"
            color="teal"
          />
        </Card>
      ) :
          <div className='translation-page'>
            <p className='customer-see'>Update the text that your customers see.</p>
            <div class="expend-all">
              <strong className="checkout-text">Customer Portal Translation</strong>
              <p style={{cursor:"pointer"}} onClick={handleExpand} >{expandAll ?"Collapse All":"Expand All"}</p>
            </div>

            <div className="collapse-section">
              <div className="collapsible-translatoin">
              <Button className="collapsible-translatoin">Sidebar Navigation </Button>
              </div>
              
              <div className="content-forms">
                <div className="content-collapse">
                  <TextField label="Subscription" placeholder ="Subscription" onChange={e=>setField("sidebarSubscription",e)} value={formData.sidebarSubscription} />
                  <TextField label="Active" placeholder ="Active" onChange={e=>setField("sidebarActive",e)} value={formData.sidebarActive} />
                  <TextField label="Canceled " placeholder ="Canceled " onChange={e=>setField("sidebarCancelled",e)} value={formData.sidebarCancelled} />
                  <TextField label="Delivery Schedule" placeholder ="Delivery Schedule" onChange={e=>setField("sidebarDeliverySchedule",e)} value={formData.sidebarDeliverySchedule} />
                  <TextField label="Order History" placeholder ="Order History" onChange={e=>setField("sidebarOrderHistory",e)} value={formData.sidebarOrderHistory} />
                  <TextField label="Addresses" placeholder ="Addresses" onChange={e=>setField("sidebarAddresses",e)} value={formData.sidebarAddresses} />
                  <TextField label="Billing " placeholder ="Billing " onChange={e=>setField("sidebarBilling",e)} value={formData.sidebarBilling} />
                  <TextField label="Account" placeholder ="Account" onChange={e=>setField("sidebarAccount",e)} value={formData.sidebarAccount} />
                </div>
              </div>
              {/*Account Setting */}
              <div className="collapsible-translatoin">
              <Button className="collapsible-translatoin">Subscription Home Tab</Button>
              </div>
              <div className="content-forms">
                <div className="content-collapse">
                {/* <p>Login to an Existing Account </p> */}
                  <TextField label="My Active Subscriptions" placeholder ="My Active Subscriptions" onChange={e=>setField("homeTabActiveSubscriptions",e)} value={formData.homeTabActiveSubscriptions} />
                  <TextField label="No Active Subscription Message " onChange={e=>setField("homeTabNoSubscriptionsFound",e)} value={formData.homeTabNoSubscriptionsFound} placeholder ="No Subscription have been found for your Account" />
                  <TextField label="Quantity" placeholder ="Quantity" onChange={e=>setField("homeTabQuantity",e)} value={formData.homeTabQuantity} />
                  <TextField label="Edit Button" placeholder ="Edit Button" onChange={e=>setField("homeTabEdtButton",e)} value={formData.homeTabEdtButton} />
                  <TextField label="Delay Next Order Button" placeholder ="Delay Next Order Button" onChange={e=>setField("homeTabDelayNextOrderBtn",e)} value={formData.homeTabDelayNextOrderBtn} />
                  <TextField label="Delivery Schedule Button" placeholder ="Delivery Schedule Button" onChange={e=>setField("homeTabDeliveryScheduleBtn",e)} value={formData.homeTabDeliveryScheduleBtn} />
                  <TextField label="Edit Subscription Button" placeholder ="Edit Subscription Button" onChange={e=>setField("homeTabEditSubscriptionBtn",e)} value={formData.homeTabEditSubscriptionBtn} />
                  <TextField label="Delivery Address " placeholder ="Delivery Address " onChange={e=>setField("homeTabDeliveryAddress",e)} value={formData.homeTabDeliveryAddress} />
                  <TextField label="Edit Button" placeholder ="Edit Button" onChange={e=>setField("homeTabEditBtn",e)} value={formData.homeTabEditBtn} />
                  <TextField label="Recommended For You" placeholder ="Recommended For You" onChange={e=>setField("homeTabRecommendedForYou",e)} value={formData.homeTabRecommendedForYou} />
                  <TextField label="Add Subscription" placeholder ="Add Subscription" onChange={e=>setField("homeTabAddSubscription",e)} value={formData.homeTabAddSubscription} />
                  <TextField label="Apply Discount to your Next Order" placeholder ="Apply Discount to your Next Order" onChange={e=>setField("homeTabApplyDiscount",e)} value={formData.homeTabApplyDiscount} />
                  <TextField label="Start Date" placeholder ="Start Date" onChange={e=>setField("homeTabStartDate",e)} value={formData.homeTabActiveSubscriptions} />
                  <TextField label="Est. Next Delivery" placeholder ="Est. Next Delivery" onChange={e=>setField("homeTabEstNextDelivery",e)} value={formData.homeTabActiveSubscriptions} />
                  <TextField label="Last Card Charge " placeholder ="Last Card Charge " onChange={e=>setField("homeTabLastCardCharge",e)} value={formData.homeTabLastCardCharge} />
                  {/* <TextField label="Est. Next Delivery" placeholder ="Est. Next Delivery" onChange={e=>setField("",e)} value={} /> */}
                  <p>Subscriber + Upsell</p>
                  <TextField label="Hey there! There’s an offer for you!" placeholder ="Hey there! There’s an offer for you!" onChange={e=>setField("upsellTitle",e)} value={formData.upsellTitle} />
                  <TextField label="10:00 left to claim this offer" placeholder ="10:00 left to claim this offer" onChange={e=>setField("upsellTimeLeft",e)} value={formData.upsellTimeLeft} />
                  <TextField label="Product Variants" placeholder ="Product Variants" onChange={e=>setField("upsellProductVariants",e)} value={formData.upsellProductVariants} />
                  <TextField label="Pay Now" placeholder ="Pay Now" onChange={e=>setField("upsellPayNow",e)} value={formData.upsellPayNow} />
                  <TextField label="No Thanks" placeholder ="No Thanks" onChange={e=>setField("upsellNoThanks",e)} value={formData.upsellNoThanks} />
                  <TextField label="Search for Products" placeholder ="Search for Products" onChange={e=>setField("upsellSearchForProduct",e)} value={formData.upsellSearchForProduct} />
                  <TextField label="Search" placeholder ="Search" onChange={e=>setField("upsellSearch",e)} value={formData.upsellSearch} />
                  <TextField label="Clear" placeholder ="Clear" onChange={e=>setField("upsellClear",e)} value={formData.upsellClear} />
                  
                  <p>Delay Next Order Popup</p>
                  <TextField label="Choose Dates" placeholder ="Choose Dates" onChange={e=>setField("delayPopupChooseDate",e)} value={formData.delayPopupChooseDate} />
                  <TextField label="Delay 2 Weeks" placeholder ="Delay 2 Weeks" onChange={e=>setField("delayPopupDelayTwoWeeks",e)} value={formData.delayPopupDelayTwoWeeks} />
                  <TextField label="Delay 1 Month" placeholder ="Delay 1 Month" onChange={e=>setField("delayPopupDelayOneMonth",e)} value={formData.delayPopupDelayTwoMonth} />
                  <TextField label="Delay 2 Months" placeholder ="Delay 2 Months" onChange={e=>setField("delayPopupDelayTwoMonth",e)} value={formData.delayPopupDelayTwoMonth} />
                  <TextField label="Delay 3 Months" placeholder ="Delay 3 Months" onChange={e=>setField("delayPopupDelayThreeMonth",e)} value={formData.delayPopupDelayThreeMonth} />
                  <TextField label="Back" placeholder ="Back" onChange={e=>setField("delayPopupBack",e)} value={formData.delayPopupBack} />
                  <TextField label="Apply" placeholder ="Apply" onChange={e=>setField("delayPopupApply",e)} value={formData.delayPopupApply} />
                  <p>Delay Next Shipment Popup</p>
                  <TextField label="Delay your Next Shipment" placeholder ="Delay your Next Shipment" onChange={e=>setField("delayShipmentPopupTitle",e)} value={formData.delayShipmentPopupTitle} />
                  <TextField label="Back" placeholder ="Back" onChange={e=>setField("delayShipmentPopupBack",e)} value={formData.delayShipmentPopupBack} />
                  <TextField label="Apply" placeholder ="Apply" onChange={e=>setField("delayShipmentPopupApply",e)} value={formData.delayShipmentPopupApply} />
                  <p>Delivery Schedule popup</p>
                  <TextField label="My Next Order" placeholder ="My Next Order" onChange={e=>setField("deliverySchedulePopupNextOrder",e)} value={formData.deliverySchedulePopupNextOrder} />
                  <TextField label="Order Product" placeholder ="Order Product" onChange={e=>setField("deliverySchedulePopupOrderProduct",e)} value={formData.deliverySchedulePopupOrderProduct} />
                  <TextField label="Order Address" placeholder ="Order Address" onChange={e=>setField("deliverySchedulePopupOrderAddress",e)} value={formData.deliverySchedulePopupOrderAddress} />
                  <TextField label="My Scheduled Orders" placeholder ="My Scheduled Orders" onChange={e=>setField("deliverySchedulePopupScheduledOrders",e)} value={formData.deliverySchedulePopupScheduledOrders} />
                  <div className="trnaslation-grid">
                    <TextField label="Skip" placeholder ="Skip" onChange={e=>setField("deliverySchedulePopupSkip",e)} value={formData.deliverySchedulePopupSkip} />
                    <TextField label="Back" placeholder ="Back" onChange={e=>setField("deliverySchedulePopupBack",e)} value={formData.deliverySchedulePopupBack} />
                  </div>
                  <TextField label="Apply" placeholder ="Apply" onChange={e=>setField("deliverySchedulePopupApply",e)} value={formData.deliverySchedulePopupApply} />
                  <p>Edit Subscription Popup</p>
                  <TextField label="Est. Next Delivery" placeholder ="Est. Next Delivery" onChange={e=>setField("editSubscriptionPopupEstNextDelivery",e)} value={formData.editSubscriptionPopupEstNextDelivery} />
                  <TextField label="Next Card Charge" placeholder ="Next Card Charge" onChange={e=>setField("editSubscriptionPopupNextCardCharge",e)} value={formData.editSubscriptionPopupNextCardCharge} />
                  <TextField label="Upgrade Subscription" placeholder ="Upgrade Subscription" onChange={e=>setField("editSubscriptionPopupUpgradeSubscription",e)} value={formData.editSubscriptionPopupUpgradeSubscription} />
                  <TextField label="Swap Subscription" placeholder ="Swap Subscription" onChange={e=>setField("editSubscriptionPopupSwapSubscription",e)} value={formData.editSubscriptionPopupSwapSubscription} />
                  <TextField label="Ask a Question" placeholder ="Ask a Question" onChange={e=>setField("editSubscriptionPopupAskAQuestion",e)} value={formData.editSubscriptionPopupAskAQuestion} />
                  <TextField label="Cancel Subscription" placeholder ="Cancel Subscription" onChange={e=>setField("editSubscriptionPopupCancelSubscription",e)} value={formData.editSubscriptionPopupCancelSubscription} />
                  <p>Swap Subscription Popup</p>
                  <TextField label="Swap {Product} Subscription to:" placeholder ="Swap {Product} Subscription to:" onChange={e=>setField("swapSubscriptionPopupSwapSubscriptionTo",e)} value={formData.swapSubscriptionPopupSwapSubscriptionTo} />
                  <TextField label="Swap Subscription Button" placeholder ="Swap Subscription Button" onChange={e=>setField("swapSubscriptionPopupSwapSubscriptionButton",e)} value={formData.swapSubscriptionPopupSwapSubscriptionButton} />
                  <p>Upgrade Subscription Popup</p>
                  <TextField label="Upgrade {Product} Subscription to:" placeholder ="Upgrade {Product} Subscription to:" onChange={e=>setField("upgradeSubscriptionPopupSwapSubscriptionTo",e)} value={formData.upgradeSubscriptionPopupSwapSubscriptionTo} />
                  <TextField label="Upgrade Subscription Button" placeholder ="Upgrade Subscription Button" onChange={e=>setField("upgradeSubscriptionPopupUpgradeSubscriptionBtn",e)} value={formData.upgradeSubscriptionPopupUpgradeSubscriptionBtn} />
                </div>
              </div>

   
              <div className="collapsible-translatoin">
              <Button className="collapsible-translatoin">Cancelled Subscriptions Tab </Button>
              </div>
              <div className="content-forms">
                <div className="content-collapse">
                  <TextField label="My Canceled Subscriptions" placeholder ="My Canceled Subscriptions" onChange={e=>setField("cancelledTabCancelledSubscriptions",e)} value={formData.cancelledTabCancelledSubscriptions} />
                  <TextField label="Reactivate Button " placeholder ="Reactivate Button" onChange={e=>setField("cancelledTabReactivateBtn",e)} value={formData.cancelledTabReactivateBtn} />
                  <TextField label="Start Date" placeholder ="Start Date" onChange={e=>setField("cancelledTabStartDate",e)} value={formData.cancelledTabStartDate} />
                  <TextField label="Quantity " placeholder ="Quantity " onChange={e=>setField("cancelledTabQuantity",e)} value={formData.cancelledTabQuantity} />
                    <p>My Canceled Subscriptions with Loyalty Programs</p>
                  <TextField label="Cancel {product} Subscription" placeholder ="Cancel {product} Subscription" onChange={e=>setField("cancelledLoyaltyCancelSubscription",e)} value={formData.cancelledLoyaltyCancelSubscription} />
                  <TextField label="Get Reward" placeholder ="Get Reward" onChange={e=>setField("cancelledLoyaltyGetReward",e)} value={formData.cancelledLoyaltyGetReward} />
                  <TextField label="Cancel Anyway" placeholder ="Cancel Anyway" onChange={e=>setField("cancelledLoyaltyCancelAnyway",e)} value={formData.cancelledLoyaltyCancelAnyway} />
                  <TextField label="Keep Points" placeholder ="Keep Points" onChange={e=>setField("cancelledLoyaltyKeepPoints",e)} value={formData.cancelledLoyaltyKeepPoints} />
                    <p>My Canceled Subscriptions without Loyalty Programs</p>
                  <TextField label="Cancel Anyway " placeholder ="Cancel Anyway " onChange={e=>setField("cancelledNoLoyaltyCancelAnyway",e)} value={formData.cancelledNoLoyaltyCancelAnyway} />
                  <TextField label="Keep Subscription" placeholder ="Keep Subscription" onChange={e=>setField("cancelledNoLoyaltyKeepSubscription",e)} value={formData.cancelledNoLoyaltyKeepSubscription} />
                    <p>Cancel Subscriptions with Reasons</p>
                  <TextField label="Cancel {product} Subscription" placeholder ="Cancel {product} Subscription" onChange={e=>setField("cancelledReasonsCancelSubscription",e)} value={formData.cancelledReasonsCancelSubscription} />
                  <TextField label="Keep Subscription" placeholder ="Keep Subscription" onChange={e=>setField("cancelledReasonsKeepSubscription",e)} value={formData.cancelledReasonsKeepSubscription} />
                  <TextField label="Cancel" placeholder ="Cancel" onChange={e=>setField("cancelledReasonsCancel",e)} value={formData.cancelledReasonsCancel} />
                </div>
              </div>
              <div className="collapsible-translatoin">
              <Button className="collapsible-translatoin">Delivery Schedule tab</Button>
              </div>
              <div className="content-forms">
                <div className="content-collapse">
                  <TextField label="My Next Order" placeholder ="My Next Order" onChange={e=>setField("deliveryTabMyNextOrder",e)} value={formData.deliveryTabMyNextOrder} />
                  <TextField label="My Scheduled Order" placeholder ="My Scheduled Order" onChange={e=>setField("deliveryTabMyScheduledOrder",e)} value={formData.deliveryTabMyScheduledOrder} />
                  <TextField label="No Subscription have been found for your Account" onChange={e=>setField("deliveryTabNoSubscriptionsFound",e)} value={formData.deliveryTabNoSubscriptionsFound} placeholder ="No Subscription have been found for your Account" />
                  <TextField label="Est. Delivery " placeholder ="Est. Delivery " onChange={e=>setField("deliveryTabEstDelivery",e)} value={formData.deliveryTabEstDelivery} />
                  <TextField label="Order Product" placeholder ="Order Product" onChange={e=>setField("deliveryTabOrderProduct",e)} value={formData.deliveryTabOrderProduct} />
                  <TextField label="Order Address" placeholder ="Order Address" onChange={e=>setField("deliveryTabOrderAddress",e)} value={formData.deliveryTabOrderAddress} />
                  <TextField label="Skip" placeholder ="Skip" onChange={e=>setField("deliveryTabSkip",e)} value={formData.deliveryTabSkip} />
                </div>
              </div>
              <div className="collapsible-translatoin">
              <Button className="collapsible-translatoin">Order History Tab</Button>
              </div>
              <div className="content-forms">
                <div className="content-collapse">
                  <TextField label="My Order History" placeholder ="My Order History" onChange={e=>setField("orderHistoryTabMyOrderHistory",e)} value={formData.orderHistoryTabMyOrderHistory} />
                  <TextField label="No Subscription have been found for your Account" onChange={e=>setField("orderHistoryTabNoSubscriptions",e)} value={formData.orderHistoryTabNoSubscriptions} placeholder ="No Subscription have been found for your Account" />
                  <TextField label="Order #" placeholder ="Order #" onChange={e=>setField("orderHistoryTabOrderNo",e)} value={formData.orderHistoryTabOrderNo} />
                  <TextField label="Date " placeholder ="Date " onChange={e=>setField("orderHistoryTabDate",e)} value={formData.orderHistoryTabDate} />
                  <TextField label="Amount" placeholder ="Amount" onChange={e=>setField("orderHistoryTabAmount",e)} value={formData.orderHistoryTabAmount} />
                  <TextField label="View" placeholder ="View" onChange={e=>setField("orderHistoryTabView",e)} value={formData.orderHistoryTabView} />
                  <TextField label="Invoice" placeholder ="Invoice" onChange={e=>setField("orderHistoryTabInvoice",e)} value={formData.orderHistoryTabInvoice} />
                </div>
              </div>
              <div className="collapsible-translatoin">
              <Button className="collapsible-translatoin">Addresses Tab</Button>
              </div>
              <div className="content-forms">
                <div className="content-collapse">
                  <TextField label="My Address" placeholder ="My Address" onChange={e=>setField("addressTabMyAddress",e)} value={formData.addressTabMyAddress} />
                  <TextField label="No Subscription have been found for your Account" onChange={e=>setField("addressTabNoSubscriptionsFound",e)} value={formData.addressTabNoSubscriptionsFound} placeholder ="No Subscription have been found for your Account" />
                  <TextField label="Edit " placeholder ="Edit" onChange={e=>setField("addressTabEdit",e)} value={formData.addressTabEdit} />
                  <TextField label="Phone " placeholder ="Phone" onChange={e=>setField("addressTabPhone",e)} value={formData.addressTabPhone} />
                  <TextField label="Company" placeholder ="Company" onChange={e=>setField("addressTabCompany",e)} value={formData.addressTabCompany} />
                  <TextField label="Address" placeholder ="Address" onChange={e=>setField("addressTabAddress",e)} value={formData.addressTabAddress} />
                  <TextField label="Add Address" placeholder ="Add Address" onChange={e=>setField("addressTabAddAddress",e)} value={formData.addressTabAddAddress} />
                    <p>Add Address Pop Up</p>
                    <TextField label="First Name " placeholder ="First Name" onChange={e=>setField("addAddressPopupFirstName",e)} value={formData.addAddressPopupFirstName} />
                    <TextField label="Last Name " placeholder ="Last Name " onChange={e=>setField("addAddressPopupLastName",e)} value={formData.addAddressPopupLastName} />
                    <TextField label="Address 1" placeholder ="Address 1" onChange={e=>setField("addAddressPopupAddress1",e)} value={formData.addAddressPopupAddress1} />
                    <TextField label="Address 2" placeholder ="Address 2" onChange={e=>setField("addAddressPopupAddress2",e)} value={formData.addAddressPopupAddress2} />
                    <div className='trnaslation-grid'>
                      <TextField label="Company" placeholder ="Company" onChange={e=>setField("addAddressPopupCompany",e)} value={formData.addAddressPopupCompany} />
                      <TextField label="City" placeholder ="City" onChange={e=>setField("addAddressPopupCity",e)} value={formData.addAddressPopupCity} />
                      <TextField label="Country " placeholder ="Country" onChange={e=>setField("addAddressPopupCountry",e)} value={formData.addAddressPopupCountry} />
                      <TextField label="Zip/Postal Code " placeholder ="Zip/Postal Code " onChange={e=>setField("addAddressPopupZip",e)} value={formData.addAddressPopupZip} />
                      <TextField label="State/Province" placeholder ="State/Province" onChange={e=>setField("addAddressPopupState",e)} value={formData.addAddressPopupState} />
                      <TextField label="Phone" placeholder ="Phone" onChange={e=>setField("addAddressPopupPhone",e)} value={formData.addAddressPopupPhone} />
                    </div>
                    <TextField label="Update" placeholder ="Update" onChange={e=>setField("addAddressPopupUpdate",e)} value={formData.addAddressPopupUpdate} />
                </div>
              </div>
              <div className="collapsible-translatoin">
              <Button className="collapsible-translatoin">Billing Tab</Button>
              </div>
              <div className="content-forms">
                <div className="content-collapse">
                  <TextField label="My Billing Information" placeholder ="My Billing Information" onChange={e=>setField("billingTabBillingInformation",e)} value={formData.billingTabBillingInformation} />
                  <TextField label="No Subscription have been found for your Account" onChange={e=>setField("billingTabBillingNoSubscriptionsFound",e)} value={formData.billingTabBillingNoSubscriptionsFound} placeholder ="No Subscription have been found for your Account" />
                  <TextField label="Card on File" placeholder ="Card on File" onChange={e=>setField("billingTabCardOnFile",e)} value={formData.billingTabCardOnFile} />
                  <TextField label="Update" placeholder ="Update" onChange={e=>setField("billingTabUpdate",e)} value={formData.billingTabUpdate} />
                  <TextField label="Edit" placeholder ="Edit" onChange={e=>setField("billingTabEdit",e)} value={formData.billingTabEdit} />
                  <TextField label="Phone" placeholder ="Phone" onChange={e=>setField("billingTabPhone",e)} value={formData.billingTabPhone} />
                  <TextField label="Company" placeholder ="Company" onChange={e=>setField("billingTabCompany",e)} value={formData.billingTabCompany} />
                  <TextField label="Address" placeholder ="Address" onChange={e=>setField("billingTabAddress",e)} value={formData.billingTabAddress} />
                    <p>Update Payment Pop Up</p>
                    <TextField label="Name on Card" placeholder ="Name on Card" onChange={e=>setField("updatePaymentPopupCardName",e)} value={formData.updatePaymentPopupCardName} />
                    <TextField label="Card Number" placeholder ="Card Number" onChange={e=>setField("updatePaymentPopupCardNumber",e)} value={formData.updatePaymentPopupCardNumber} />
                    <TextField label="Exp. Month" placeholder ="Exp. Month" onChange={e=>setField("updatePaymentPopupExpMonth",e)} value={formData.updatePaymentPopupExpMonth} />
                    <TextField label="Exp. Date" placeholder ="Exp. Date" onChange={e=>setField("updatePaymentPopupExpDate",e)} value={formData.updatePaymentPopupExpDate} />
                    <TextField label="CVV" placeholder ="CVV" onChange={e=>setField("updatePaymentPopupCvv",e)} value={formData.updatePaymentPopupCvv} />
                    <TextField label="Update Card" placeholder ="Update Card" onChange={e=>setField("updatePaymentPopupUpdateCard",e)} value={formData.updatePaymentPopupUpdateCard} />
                </div>
              </div>
              <div className="collapsible-translatoin">
              <Button className="collapsible-translatoin">Account Tab</Button>
              </div>
              <div className="content-forms">
                <div className="content-collapse">
                  <TextField label="My Account Details" placeholder ="My Account Details" onChange={e=>setField("accountTabMyAccountDetail",e)} value={formData.accountTabMyAccountDetail} />
                  <TextField label="No Subscription have been found for your Account" onChange={e=>setField("accountTabNoSubscriptionsFound",e)} value={formData.accountTabNoSubscriptionsFound} placeholder ="No Subscription have been found for your Account" />
                  <TextField label="First Name" placeholder ="First Name" onChange={e=>setField("accountTabFirstName",e)} value={formData.accountTabFirstName} />
                  <TextField label="Last Name" placeholder ="Last Name" onChange={e=>setField("accountTabLastName",e)} value={formData.accountTabLastName} />
                  <TextField label="Email" placeholder ="Email" onChange={e=>setField("accountTabEmail",e)} value={formData.accountTabEmail} />
                  <TextField label="Save Button" placeholder ="Save" onChange={e=>setField("accountTabSaveButton",e)} value={formData.accountTabSaveButton} />
                  <p>Update Payment Pop Up</p>
                    <TextField label="Name on Card" placeholder ="Name on Card" onChange={e=>setField("updatePaymentPopupCardName",e)} value={formData.updatePaymentPopupCardName} />
                    <TextField label="Card Number" placeholder ="Card Number" onChange={e=>setField("updatePaymentPopupCardNumber",e)} value={formData.updatePaymentPopupCardNumber} />
                    <TextField label="Exp. Month" placeholder ="Exp. Month" onChange={e=>setField("updatePaymentPopupExpMonth",e)} value={formData.updatePaymentPopupExpMonth} />
                    <TextField label="Exp. Date" placeholder ="Exp. Date" onChange={e=>setField("updatePaymentPopupExpDate",e)} value={formData.updatePaymentPopupExpDate} />
                    <TextField label="CVV" placeholder ="CVV" onChange={e=>setField("updatePaymentPopupCvv",e)} value={formData.updatePaymentPopupCvv} />
                    <TextField label="Update Card" placeholder ="Update Card" onChange={e=>setField("updatePaymentPopupUpdateCard",e)} value={formData.updatePaymentPopupUpdateCard} />
                </div>
              </div>
              {/*Account Setting */}

            </div>
            <div className="translation-btn">


              <Layout.Section>
                <Stack>
                  <div className="save-btn">
                  <Stack.Item>
                    <Button primary loading={updateLoading} onClick={handleSubmit} >Save Changes </Button>
                  </Stack.Item>
                  </div>
                </Stack>
              </Layout.Section>
            </div>
          </div>
        }
          {saveSuccess && (
            <Toast
              content="Setting is saved"
              onDismiss={hideSaveSuccess}
            />
          )}
        </Layout>
        </>
    )
}

export default Translation
