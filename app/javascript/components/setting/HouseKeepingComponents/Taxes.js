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
import React, { useState, useEffect, handleSmsSettingSubmit } from "react";
import LoadingScreen from "../../LoadingScreen";

const Taxes = ({ setSmsData, smsData, handleSmsSettingSubmit, submitting }) => {

  const [filters, setFilters] = useState({
    searchValue: '',
    order: 'created_at',
    type: 'DESC',
    limit: 25,
    offset: 0,
  });

  const fetchSetting = gql`
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
              optIn
      }
  }`;

  const fetchQuery = gql`
    query (
      $offsetAttributes: OffsetAttributes!
      $custom: String
      $searchKey: String
      $sortColumn: String
      $sortDirection: String
    ) {
      fetchSmartyMessages(
        offsetAttributes: $offsetAttributes
        custom: $custom
        searchKey: $searchKey
        sortColumn: $sortColumn
        sortDirection: $sortDirection
      ) {
        totalCount
        smartyMessages {
          id
          title
          description
          body
          updatedAt
          createdAt
          usageCount
          status
        }
      }
    }
  `;

  const [getMessages, { loading: isloading, data: smartyMssgData, error, refetch }] = useLazyQuery(fetchQuery, {
    fetchPolicy: 'cache-and-network',
  });

  const [formData, setFormData] = useState({
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

  useEffect(() => {
    setSmsData(formData)
  }, [formData])

  const [getSetting, { loading, data }] = useLazyQuery(fetchSetting);
  useEffect(() => {
    getSetting();
    getMessages({
      variables: {
        offsetAttributes: { limit: filters.limit, offset: filters.offset },
        custom: 'false',
        searchKey: filters.searchValue,
        sortColumn: filters.order,
        sortDirection: filters.type,
      },
    });
  }, [])

  useEffect(() => {
    if (data && !loading) {
      const { fetchSmsSetting } = data;
      const { status, delayOrder, swapProduct, orderTracking, renewalReminder, updateBilling,
        skipUpdateNextCharge, oneTimeUpsells, failedRenewal, optIn,
        editQuantity, cancelSubscription, winbackFlow, deliveryStartTime, deliveryEndTime,
        renewalDuration, shopPhone, smsCount, smsChargeAmount } = fetchSmsSetting;
      setFormData({
        ...formData, delayOrder, swapProduct, orderTracking, renewalReminder, updateBilling,
        skipUpdateNextCharge, oneTimeUpsells, failedRenewal, optIn,
        editQuantity, cancelSubscription, winbackFlow, deliveryStartTime, deliveryEndTime,
        renewalDuration
      });
      setSmsData({
        status, delayOrder, swapProduct, orderTracking, renewalReminder, updateBilling,
        skipUpdateNextCharge, oneTimeUpsells, failedRenewal, optIn,
        editQuantity, cancelSubscription, winbackFlow, deliveryStartTime, deliveryEndTime,
        renewalDuration, shopPhone, smsCount, smsChargeAmount
      });
    }
  }, [data])

  console.log("smartyMssgData", smartyMssgData);
  return (
    <React.Fragment>
      <div className="sms-tab">
        <div className="sms-options">
          <Card title="SMS Options" sectioned>
            {
              isloading ?
                <LoadingScreen />
                :
                smartyMssgData?.fetchSmartyMessages?.smartyMessages?.map((msg) => {
                  return (
                    <>
                      <Checkbox name={msg?.title} label={msg?.title} checked={msg?.status} onChange={val => setFormData({ ...formData, delayOrder: val ? "true" : "false" })} />
                    </>
                  )
                })
            }
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
                      <TextField name="deliveryStartTime" value={formData.deliveryStartTime} onChange={val => setFormData({ ...formData, deliveryStartTime: val })} placeholder="09:00" />
                      <Button >Start</Button>
                    </Stack>
                  </Stack.Item>
                  <Stack.Item>
                    <Stack>
                      <TextField name="deliveryEndTime" value={formData.deliveryEndTime} onChange={val => setFormData({ ...formData, deliveryEndTime: val })} placeholder="20:00" />
                      <Button >End</Button>
                    </Stack>
                  </Stack.Item>
                </Stack>
              </Layout.Section>
              <Layout.Section oneHalf>
                <Stack>
                  <Stack.Item>
                    <DisplayText size="small">New Renewal</DisplayText>
                    <Stack>
                      <TextField name="renewalDuration" value={formData.renewalDuration} onChange={val => setFormData({ ...formData, renewalDuration: val })} placeholder="3 days" />
                      <Button loading={submitting} onClick={handleSmsSettingSubmit} >Save</Button>
                    </Stack>
                  </Stack.Item>
                </Stack>
              </Layout.Section>
            </Layout>
          </Card>
        </div>
        {/*
            (process.env.APP_TYPE=="public") &&
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
          </div> */}
      </div>
    </React.Fragment>
  );
};
export default Taxes;
