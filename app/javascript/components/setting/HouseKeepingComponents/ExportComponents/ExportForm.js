import React,{useState,useEffect,useCallback} from 'react';
import {Heading,TextStyle, Layout, DisplayText, Card, Select, Stack} from '@shopify/polaris';
import './export.css';
import ExportFilter from '../../../common/DatePicker/ExportFilter';
import { gql, useLazyQuery } from '@apollo/client';
import dayjs from 'dayjs';
import { filter, isEmpty, keyBy } from 'lodash';
import {CSVDownload} from  'react-csv';

const ExportForm = ({handleCloseForm}) => {

  const fetchCustomerReport = gql`
  query($reportType: String!, $startDate: String!, $endDate: String!) {  
    fetchReport(reportType: $reportType, startDate: $startDate, endDate: $endDate) {
        customers {
          firstName
          lastName
          email
          phone
          createdAt
          updatedAt
          acceptsMarketing
          ordersCount
          state
          totalSpent
          note
          verifiedEmail
          multipassIdentifier
          taxExempt
          acceptsMarketingUpdatedAt
        }
    }
}
  `;

  const fetchProductReport = gql`
  query($reportType: String!, $startDate: String!, $endDate: String!) {  
    fetchReport(reportType: $reportType, startDate: $startDate, endDate: $endDate) {
        products {
          title
          handle
          sellingPlanGroupCount
          createdAt
          description
          giftCardTemplateSuffix
          hasOnlyDefaultVariant
          hasOutOfStockVariants
          isGiftCard
          productType
          requiresSellingPlan
          vendor
          tracksInventory
          totalInventory
          totalVariants
        }
    }
}
  `;

  const fetchAnalyticsReport = gql`
  query($reportType: String!, $startDate: String!, $endDate: String!) {  
    fetchReport(reportType: $reportType, startDate: $startDate, endDate: $endDate) {
        reportLogs{
            reportType
            createdAt
            startDate
            endDate
        }
    }
}
  `;
  //extra 3 apis to get Data
  const revenueReport = gql`
  query($startDate: String!, $endDate: String!) {  
    fetchRevenueTrend(startDate: $startDate, endDate: $endDate) {
        totalSales {
          value
          percent
          up
        }
        recurringSales {
          value
          percent
          up
        }
        salesPerCharge {
          value
          percent
          up
        }
        mrr {
          value
          percent
          up
        }
        refunds {
          value
          percent
          up
        }
        averageCheckoutCharge {
          value
          percent
          up
        }
        averageRecurringCharge {
          value
          percent
          up
        }
        churnRate {
          value
          percent
          up
        }
        newCustomers {
          value
          percent
          up
        }
        activeCustomers {
          value
          percent
          up
        }
        newSubscriptions {
          value
          percent
          up
        }
        cancelledSubscriptions {
          value
          percent
          up
        }
        sameDayCancelled {
          value
          percent
          up
        }
    }
}
  `;
  const insightReport = gql`
  query($startDate: String!, $endDate: String!) {  
    fetchCustomerInsights(startDate: $startDate, endDate: $endDate) {
      customersCount {
        value
        percent
        up
      }
      salesPerCharge {
        value
        percent
        up
      }
      totalChurn {
        value
        percent
        up
      }
      chargePerCustomer {
        value
        percent
        up 
      }
      skipCount {
        value
        percent
        up 
      }
      swapCount {
        value
        percent
        up 
      }
      restartCount {
        value
        percent
        up 
      }
      upsellCount {
        value
        percent
        up 
      }
      dunningCount {
        value
        percent
        up 
      }
      recovered {
        value
        percent
        up 
      }
      churned {
        value
        percent
        up 
      }
      dunned {
        value
        percent
        up 
      }
    }
}
  `;
  const smartyReport = gql`
  query($startDate: String!, $endDate: String!) {  
    fetchSmsAnalytics(startDate: $startDate, endDate: $endDate) {
        swapCount {
          value
          percent
          up
        }
        skipCount {
          value
          percent
          up
        }
        delayCount {
          value
          percent
          up
        }
        cancelCount {
          value
          percent
          up
        }
        oneTimeRevenue {
          value
          percent
          up
        }
        optOutMessages {
          value
          percent
          up 
        }
    }
}
  `;
  const [filters, setFilters] = useState(null)
  const handleFiltersDates = (dates, reportType) => {
    if (!isEmpty(dates)) {
      const { start, end } = dates;
      setFilters({ startDate: dayjs(start).format("YYYY-MM-DD"), endDate: dayjs(end).format("YYYY-MM-DD"), reportType: reportType });
    }
  }

  const [getProductReport, { loading:productLoading, data:productReportData }] = useLazyQuery(fetchProductReport,{fetchPolicy:"network-only"});
  const [getCustomerReport, { loading:customerLoading, data:customerReportData }] = useLazyQuery(fetchCustomerReport,{fetchPolicy:"network-only"});

  const [getanalyticReport] = useLazyQuery(fetchAnalyticsReport,{fetchPolicy:"network-only"});
  const [getRevenueReport, {loading:revenueLoading, data:revenueReportData }] = useLazyQuery(revenueReport,{fetchPolicy:"network-only"});
  const [getInsightsReport, {loading:insightLoading, data:insightReportData }] = useLazyQuery(insightReport,{fetchPolicy:"network-only"});
  const [getSmartyReport, {loading:smartyLoading, data:smartyReportData }] = useLazyQuery(smartyReport,{fetchPolicy:"network-only"});

  useEffect(()=>{
    if(!isEmpty(filters)){
      if(filters?.reportType==="customer"){
        getCustomerReport({
          variables:{
            reportType: "customer",
            startDate: filters?.startDate,
            endDate: filters?.endDate
          }
        })
      }
      else if(filters?.reportType==="product"){
        getProductReport({
          variables:{
            reportType: "product",
            startDate: filters?.startDate,
            endDate: filters?.endDate
          }
        })
      }
      else if(filters?.reportType==="analytic"){
        getanalyticReport({
          variables:{
            reportType: "analytic",
            startDate: filters?.startDate,
            endDate: filters?.endDate
          }
        })
        //get required Data from Api's....
        getRevenueReport({
          variables:{
            startDate: filters?.startDate,
            endDate: filters?.endDate
          }
        })
        getInsightsReport({
          variables:{
            startDate: filters?.startDate,
            endDate: filters?.endDate
          }
        })
        getSmartyReport({
          variables:{
            startDate: filters?.startDate,
            endDate: filters?.endDate
          }
        })
      }
    }
  },[filters])

  const [data,setData]=useState(null);
  useEffect(()=>{
      if(!isEmpty(productReportData?.fetchReport)){
        setData(productReportData.fetchReport.products)
      }
  },[productReportData])

  useEffect(()=>{
    if(!isEmpty(customerReportData)){
      setData(customerReportData.fetchReport.customers)
    }
},[customerReportData])

  useEffect(() => {
    if(!isEmpty(revenueReportData) && !isEmpty(insightReportData) && !isEmpty(smartyReportData)){
      let first= !isEmpty(insightReportData?.fetchCustomerInsights)?insightReportData?.fetchCustomerInsights: {};
      let second = !isEmpty(revenueReportData.fetchRevenueTrend) ?revenueReportData.fetchRevenueTrend: {};
      let third =!isEmpty(smartyReportData.fetchSmsAnalytics) ?smartyReportData.fetchSmsAnalytics: {};

      let modified={};

      if(!isEmpty(first)){
        for (const [key, value] of Object.entries(first)) {
          modified[key] = value?.value || '0'; 
       }
      }
      if(!isEmpty(second)){
        for (const [key, value] of Object.entries(second)) {
          modified[key] = value?.value || '0';
        }
      }
     if(!isEmpty(third)){
      for (const [key, value] of Object.entries(third)) {
        modified[key] = value?.value || '0';
      }
     }
    
      setData([modified]);
    }
  }, [revenueReportData, insightReportData, smartyReportData])

    useEffect(()=>{
      if(!isEmpty(data))
      {
        handleCloseForm(data,filters)
      }
    },[data])

    return (
        <Layout >
          {
            !isEmpty(data) &&
           <>
           <CSVDownload data={data} />
           </>
          }
        <div className='wrapper'>
          <div className='bread-bar'>
            <a>Export</a>
            <span>{">"}</span>
            <a>Export Builder</a>
          </div>
          <div className="input-section">
          {/* <DisplayText size='medium'><strong>Select Export Type</strong></DisplayText> */}
            <ExportFilter  
              handleDates={handleFiltersDates}
              loading={productLoading || customerLoading || revenueLoading || smartyLoading || insightLoading}
            />
            </div>
          </div>
          <div className ='faq-sms'>
            <Card sectioned>
              <h1>Frequently Asked Questions </h1>
              <Stack vertical>
                <Stack.Item>
                  <Heading>
                    SHOPIFY ONLY: Are tax rates in lorem ipsum synced with tax
                    rates in Shopify?
                  </Heading>
                  <TextStyle variation='subdued'>
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
      </Layout>
    )
}

export default ExportForm
