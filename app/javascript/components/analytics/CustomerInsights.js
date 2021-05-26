import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { gql, useLazyQuery } from '@apollo/client';
import CounterUp from 'react-countup';
import { FilterContext } from './../common/Contexts/AnalyticsFilterContext';
import {
  Card,
  FormLayout,
  Icon,
  Layout,
  Page,
  Stack,
  Button,
  Select,
  TextField,
  DisplayText,
  TextStyle,
  Heading,
  DataTable,
  TextContainer,
  DatePicker,
} from '@shopify/polaris';
import {
  DropdownMinor,
  CaretUpMinor,
  CaretDownMinor,
} from '@shopify/polaris-icons';
import { Form } from 'formik';
import { isEmpty } from 'lodash';
import { data } from 'jquery';
import DateRangePicker from '../common/DatePicker/DateRangePicker';
import dayjs from 'dayjs';

const CustomerInsights = () => {

  const fetchReport = gql`
  query($startDate: String!, $endDate: String!) {  
    fetchCustomerInsights(startDate: $startDate, endDate: $endDate) {
      activeCustomersPercentage
      cancelledCustomersPercentage
      dunnedCustomersPercentage
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
      dunningData {
          date
          data {
              value
          }
      }
      dunningRecoveredData {
          date
          data {
              value
          }
      }
      dunningChurnData {
          date
          data {
              value
          }
      }
      skipCustomers {
          activeCustomers
          churnedCustomers
      }
      swapCustomers {
          activeCustomers
          churnedCustomers
      }
      restartCustomers {
          activeCustomers
          churnedCustomers
      }
      upsellCustomers {
          activeCustomers
          churnedCustomers
      }
      skuByCustomers {
          sku
          value
      }
      billingFrequency {
          billingPolicy
          value
      }
      cancellationReasons {
          cancellationReason
          value
      }
    }
}
  `;


  //insight Chart
  const insightChart = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      height: '400px',
      // width: '720px',
    },
    colors: ['#007EFF', '#57AAFF', '#979797', '#FFCC00', '#E77320', '#FF0000', '#FF5C00', '#212B36', '#979797', '#007EFF', '#00A023', '#8000A0', '#A0007D', '#F4EC19'],
    title: {
      // text: '2021-02-09',
      align: 'center',
      verticalAlign: 'middle',
      // y: 60,
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          distance: -50,
          style: {
            fontWeight: 'bold',
            color: 'white',
          },
        },

        center: ['50%', '50%'],
        size: '110%',
      },
    },
    series: [
      {
        type: 'pie',
        // name: 'Browser share',
        innerSize: '50%',
        showInLegend: true,
        data: [
          ['60%', 60],
          ['18%', 18],
          ['19%', 19],
        ],
      },
    ],
  };
  const skuCustomersChart = {
    colors: ["#0D91AE", "#6B97C5", "#FFF500", "#FFCC00", "#E77320", "#FF0000", "#FF5C00", "#979797", "#007EFF", "#00A023", "#8000A0", "#A0007D", "#F4EC19"],
    title: {
      text: 'Top SKUs by Customer Count'
    },
    xAxis: {
      categories: ['SKU 001', 'SKU 002', 'SKU 003', 'SKU 004', 'SKU 005', 'SKU 006', 'SKU 007', 'SKU 008', 'SKU 009', 'SKU 010', 'SKU 011', 'SKU 012', 'SKU 013', 'SKU 014']
    },
    yAxis: {
      title: {
        text: 'Number of Customers'
      },
      labels: {
        formatter: function () {
          return this.value;
        }
      },
    },
    series: [{
      type: 'column',
      colorByPoint: true,
      data: [2078, 44000, 12333, 5666, 9000, 2333, 1111, 23333, 45555, 2222, 2211, 11111, 7999, { y: 123216.4, marker: { fillColor: '#000', radius: 10 } }],
      showInLegend: false
    }]
  }
  const customerSubscriptionsChart = {
    colors: ["#007EFF","#007EFF","#007EFF","#007EFF","#212B36","#212B36","#212B36","#212B36" ],
    chart: {
      type: 'column',
    },
    title: {
      text: 'Active Subscriptions vs Churned Subscriptions',
    },
    xAxis: {
      categories: ['SKips', 'Swaps', 'Upsells', 'Reactivations','SKips', 'Swaps', 'Upsells', 'Reactivations'],
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Number of Customers',
      },
    },
    legend: {
      align: 'center',
      alignColumns: true,
      verticalAlign: 'bottom',
      shadow: false,
      squareSymbol: true,
      symbolRadius: 0
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        // dataLabels: {
        //   enabled: true,
        // },
      },
    },
    series: [
      {
        color:"#fff",
        name: 'Active Subscriptions',
        data: [0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        color:"#000",
        name: 'Churned Subscriptions',
        data: [0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };
  const cancellationReasonsChart={
		colors:["#979797"],
    title: {
        text: 'Top Cancellation Reasons'
    },
    xAxis: {
        categories: []
    },
    yAxis: {
    title: {
        text: 'Customers'
    		},
    labels: {
        formatter: function() {
            return this.value;
        }
    	},
		},
     series: [{
        type: 'column',
        colorByPoint: true,
        data: [],
        showInLegend: false
    }] 
}
  // Subscriptions Chart
  const DunningChart = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Subscriptions in Dunning',
    },
    xAxis: {
      categories: ['1', '2', '3'],
    },
    yAxis: {
      allowDecimals: false,
      title: {
        text: 'Subscription in Dunning',
      },
    },
    exporting: {
      enabled: false,
    },
    series: [
      {
        name: 'Charge Attempts',
        data: [50, 130, 0],
        color: '#258AFF',
      },
    ],
  };
  const ActiveChart = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Dunned Subscription - Recovered',
    },
    xAxis: {
      categories: ['1', '2', '3'],
    },
    yAxis: {
      allowDecimals: false,
      title: {
        text: 'Subscription Dunned No Credit Card Risk',
      },
    },
    exporting: {
      enabled: false,
    },
    series: [
      {
        name: 'Charge Attempts',
        data: [130, 75, 0],
        color: '#258AFF',
      },
    ],
  };
  const ChurnChart = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Dunned Subscription - Churn',
    },
    xAxis: {
      categories: ['1', '2', '3'],
    },
    yAxis: {
      allowDecimals: false,
      title: {
        text: 'Subscription Dunned Passive Churn',
      },
    },
    exporting: {
      enabled: false,
    },
    series: [
      {
        name: 'Charge Attempts',
        data: [0, 0, 180],
        color: '#258AFF',
      },
    ],
  };
  //customer Action chart
  const CustomerActionChart_1 = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Customers by Skip Count -Active vs Churned',
    },
    xAxis: {
      categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'],
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Number of Customers',
      },
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        // dataLabels: {
        //   enabled: true,
        // },
      },
    },
    series: [
      {
        name: 'Active Customers',
        data: [2600, 300, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Churned Customers',
        data: [2600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };
  

  const customerListKeys=[
    {section:"Customer Count",key:"customerCount"},
    {section:"Sales Per Charge",key:"salesPerCharge",prefix:"$"},
    {section:"Charges Per Customer",key:"chargePerCustomer"},
    {section:"Total Churn %",key:"totalChurn",suffix:"%"}
  ]
  const [sectionCustomerList,setSectionCustomerList] = useState({
    customerCount:{
      section: 'Customer Count',
      percent: 0,
      up: true,
      value: '0',
    },
    salesPerCharge:{
      section: 'Sales Per Charge',
      percent: 0,
      up: true,
      value: '0'
    },
    chargePerCustomer:{
      section: 'Charges Per Customer',
      percent: 0,
      up: true,
      value: '0',
    },
    totalChurn:{
      section: 'Total Churn %',
      percent: 0,
      up: true,
      value: '0'
    }
  });
  const purchaseListKeys=[
    {section:"Total Dunning & Dunned Subs",key:"dunned",suffix:"%"},
    {section:"% Dunning",key:"dunningCount",suffix:"%"},
    {section:"% Recovered",key:"recovered",suffix:"%"},
    {section:"% Churn",key:"churned",suffix:"%"}
  ]
  //Purchase Items (Subscriptions)
  const [sectionPurchaseItemList,setSectionPurchaseItemList] = useState({
    dunned:{
      section: 'Total Dunning & Dunned Subs',
      percent: 0,
      up: true,
      amount: '0'
    },
    dunningCount:{
      section: '% Dunning',
      percent: 0,
      up: true,
      amount: '0'
    },
    recovered:{
      section: '% Recovered',
      percent: 0,
      up: true,
      amount: '0'
    },
    churned:{
      section: '% Churn',
      percent: 0,
      up: true,
      amount: '0'
    },
  });
  //Customer Actions
  const customerActionListKeys=[
    {section:"Skips",key:"skipCount"},
    {section:"Swaps",key:"swapCount"},
    {section:"Upsells",key:"upsellCount"},
    {section:"Reactivations",key:"restartCount"},
    
  ]
  const [sectionCustomerActionList,setSectionCustomerActionList] = useState({
    skipCount:{
      percent: 0,
      up: true,
      amount: '0',
    },
    swapCount:{
      section: 'Swaps',
      percent: 0,
      up: true,
      amount: '0',
    },
    upsellCount:{
      section: 'Upsells',
      percent: 0,
      up: true,
      amount: '0',
    },
    restartCount:{
      section: 'Reactivations',
      percent: 0,
      up: true,
      amount: '0',
    },
  });

  const rows_Churn = [
    [' ', 'At Least One Swap', 'Y', 'N'],
    [' ', 'At Least One Skip', '-', '-'],
    ['1', 'Y', '0', '250'],
    ['2', 'N', '$125,200', '2'],
  ];

  const [chartOptions,setChartOptions]=useState({
    insightsChart:insightChart,
    skuCustomersChart:skuCustomersChart,
    customerSubscriptionsChart:customerSubscriptionsChart,
    cancellationReasonsChart:cancellationReasonsChart,
    dunningChart:DunningChart,
    dunningRecovered:ActiveChart,
    dunningChurn:ChurnChart
  })

  const [filters]=useContext(FilterContext)
  // const [filters,setFilters]=useState({startDate:dayjs(new Date()).subtract(30,'days').format("YYYY-MM-DD"),endDate:dayjs(new Date()).format("YYYY-MM-DD")})
  // const handleFiltersDates=(dates)=>{
  //   if(!isEmpty(dates)){
  //     const {start,end}=dates;
  //     setFilters({startDate:dayjs(start).format("YYYY-MM-DD"),endDate:dayjs(end).format("YYYY-MM-DD")});
  //   }
  // }
  const [getReport, { loading, data:reportData }] = useLazyQuery(fetchReport,{fetchPolicy:"network-only"});

  const getReportData = useCallback(() => {
    getReport({
      variables:{
        startDate:filters.startDate,
        endDate:filters.endDate
      }
    })
  }, [filters,getReport])

  useEffect(() => {
    getReportData()
  }, [filters])

  useEffect(()=>{
    if(!isEmpty(reportData)){
      const {
        customersCount,
        salesPerCharge,
        chargePerCustomer,
        totalChurn,
        dunned,
        dunningCount,
        recovered,
        churned,
        skipCount,
        swapCount,
        upsellCount,
        restartCount,
        
        //Pie Data
        activeCustomersPercentage,
        cancelledCustomersPercentage,
        dunnedCustomersPercentage,

        //Charts Data
        skuByCustomers,
        cancellationReasons,
        dunningData,
        dunningRecoveredData,
        dunningChurnData,
        //
        skipCustomers,
        swapCustomers,
        upsellCustomers,
        restartCustomers
      }=reportData.fetchCustomerInsights;
      //Set Sections Data
      setSectionCustomerList(prevData=>(
        {
          customerCount:customersCount || prevData.customerCount,
          salesPerCharge:salesPerCharge || prevData.salesPerCharge,
          chargePerCustomer:chargePerCustomer || prevData.chargePerCustomer,
          totalChurn:totalChurn || prevData.totalChurn
        }
      ))
      setSectionPurchaseItemList(prevData=>(
        {
          dunned:dunned || prevData.dunned,
          dunningCount:dunningCount || prevData.dunningCount,
          recovered:recovered || prevData.recovered,
          churned:churned || prevData.churned
        }
      ))
      setSectionCustomerActionList(prevData=>(
        {
          skipCount:skipCount || prevData.skipCount,
          swapCount:swapCount || prevData.swapCount,
          upsellCount:upsellCount || prevData.upsellCount,
          restartCount:restartCount || prevData.restartCount
        }
      ))

      //Charts Data
      const { insightsChart, skuCustomersChart, customerSubscriptionsChart, cancellationReasonsChart, dunningChart, dunningRecovered, dunningChurn } = chartOptions;

      const insightChartOptions = {
        ...insightsChart, series: [{
          type: 'pie', innerSize: '50%', showInLegend: true, data: [
            [`${activeCustomersPercentage || '0'}%`, parseInt(activeCustomersPercentage) || 0],
            [`${dunnedCustomersPercentage || '0'}%`, parseInt(dunnedCustomersPercentage) || 0],
            [`${cancelledCustomersPercentage || '0'}%`, parseInt(cancelledCustomersPercentage) || 0],],
        }]
      }

      const newSkuCustomersChart = {
        ...skuCustomersChart, xAxis: { categories: skuByCustomers.map(sku => sku.sku) || [] },
        series: [{
          type: 'column',
          colorByPoint: true,
          data: skuByCustomers.map(sku => parseInt(sku.value || 0)) || [],
          showInLegend: false
        }]
      }

      const newCustomerSubscriptionsChart = {
        ...customerSubscriptionsChart,
        series: [{
          type: 'column',
          colorByPoint: true,
          data: [skipCustomers.activeCustomers, swapCustomers.activeCustomers, upsellCustomers.activeCustomers, restartCustomers.activeCustomers, skipCustomers.churnedCustomers, swapCustomers.churnedCustomers, upsellCustomers.churnedCustomers, restartCustomers.churnedCustomers],
          showInLegend: false
        }]
      };

      const newCancellationReasonsChart = {
        ...cancellationReasonsChart, xAxis: { categories: cancellationReasons.map(val => val.cancellationReason) || [] },
        series: [{
          type: 'column',
          colorByPoint: true,
          data: cancellationReasons.map(val => parseInt(val.value || 0)) || [],
          showInLegend: false
        }]
      };

      const newDunningChart = {
        ...dunningChart, xAxis: { categories: dunningData.map(data => data.date) || [], },
        series: [
          {
            name: 'Charge Attempts',
            data: dunningData.map(data => parseInt(data.data.value) || 0) || [],
            color: '#258AFF',
          },
        ],
      }

      const newDunningRecovered = {
        ...dunningRecovered, xAxis: { categories: dunningRecoveredData.map(data => data.date) || [], },
        series: [
          {
            name: 'Charge Attempts',
            data: dunningRecoveredData.map(data => parseInt(data.data.value) || 0) || [],
            color: '#258AFF',
          },
        ],
      }
      const newDunningChurn = {
        ...dunningChurn, xAxis: { categories: dunningChurnData.map(data => data.date) || [], },
        series: [
          {
            name: 'Charge Attempts',
            data: dunningChurnData.map(data => parseInt(data.data.value) || 0) || [],
            color: '#258AFF',
          },
        ],
      }

      setChartOptions({
        ...chartOptions,
        insightsChart:insightChartOptions,
        skuCustomersChart:newSkuCustomersChart,
        customerSubscriptionsChart:newCustomerSubscriptionsChart,
        cancellationReasonsChart:newCancellationReasonsChart,
        dunningChart:newDunningChart,
        dunningRecovered:newDunningRecovered,
        dunningChurn:newDunningChurn
      })

    }

  },[reportData])


  return (
    <FormLayout>
      
      {/* <Layout>
        <Layout.Section>
        </Layout.Section>
        <Layout.Section>
          <DateRangePicker
            start={filters.startDate}
            endDate={filters.endDate}
            handleDates={handleFiltersDates}
          />
        </Layout.Section>
      </Layout> */}
      <Stack vertical spacing="extraLoose">
        <Layout>
          {/* <Layout.Section secondary> */}
          <div className="container-left">
            <Layout.Section>
              <Stack vertical distribution="equalSpacing">
                {customerListKeys?.map((item, i) => (
                  <Stack.Item key={i}>
                    <Card sectioned>
                      <Stack
                        distribution="equalSpacing"
                        // spacing="extraTight"
                      >
                        <Stack.Item>
                          <TextStyle variation="strong">
                            {item.section}
                          </TextStyle>
                        </Stack.Item>
                        <Stack.Item>
                          <TextStyle
                            variation={sectionCustomerList[item.key]?.up ? 'positive' : 'negative'}
                          >
                            <Icon
                              source={sectionCustomerList[item.key]?.up ? CaretUpMinor : CaretDownMinor}
                              color={sectionCustomerList[item.key]?.up ? 'green' : 'red'}
                            />
                            {(sectionCustomerList[item.key]?.up===false && sectionCustomerList[item.key]?.percent==0)?100:sectionCustomerList[item.key].percent}%
                          </TextStyle>
                        </Stack.Item>
                      </Stack>
                      <Stack>
                        <Stack.Item>
                          <DisplayText size="medium">
                            <TextStyle variation="strong">
                            <CounterUp prefix={item?.prefix || ""} suffix={item?.suffix || ""} start={0} end={Number.parseFloat(sectionCustomerList[item.key]?.value).toFixed(2)} duration={1.5} decimals={2} />
                            </TextStyle>
                          </DisplayText>
                        </Stack.Item>
                      </Stack>
                    </Card>
                  </Stack.Item>
                ))}
              </Stack>
            </Layout.Section>
          </div>
          {/* </Layout.Section> */}
          <div className="container-right">
            <Layout.Section>
              <div className="card-chart">
                <Card>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions.insightsChart}
                  />
                </Card>
              </div>
            </Layout.Section>
          </div>
        </Layout>
        <Layout>
          <Layout.Section>
            <Card>
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions.skuCustomersChart}
              />
            </Card>
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section>
            <Card>
              <Card.Section>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={chartOptions.insightsChart}
                />
              </Card.Section>
            </Card>
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section>
            <Card>
              <Card.Section>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={chartOptions.customerSubscriptionsChart}
                />
              </Card.Section>
            </Card>
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section>
            <DisplayText size="medium">
              Purchase Items (Subscriptions)
            </DisplayText>

            <Stack distribution="fill" wrap={false}>
              {purchaseListKeys?.map((item, i) => (
                <Stack.Item key={i}>
                  <Card sectioned>
                    <Stack>
                      <Stack.Item fill>
                        <TextStyle variation="strong">{item.section}</TextStyle>
                      </Stack.Item>

                      <Stack.Item>
                        <TextStyle
                          variation={sectionPurchaseItemList[item.key]?.up ? 'positive' : 'negative'}
                        >
                          <Icon
                            source={sectionPurchaseItemList[item.key]?.up ? CaretUpMinor : CaretDownMinor}
                            color={sectionPurchaseItemList[item.key]?.up ? 'green' : 'red'}
                          />
                          {(sectionPurchaseItemList[item.key]?.up===false && sectionPurchaseItemList[item.key]?.percent==0)?100:sectionPurchaseItemList[item.key].percent}%
                        </TextStyle>
                      </Stack.Item>
                    </Stack>

                    <Stack>
                      <Stack.Item>
                        <DisplayText size="medium">
                          <TextStyle variation="strong">
                          <CounterUp prefix={item?.prefix || ""} suffix={item?.suffix || ""} start={0} end={Number.parseFloat(sectionPurchaseItemList[item.key]?.value).toFixed(2)} duration={1.5} decimals={2} />
                          </TextStyle>
                        </DisplayText>
                      </Stack.Item>
                    </Stack>
                  </Card>
                </Stack.Item>
              ))}
            </Stack>
          </Layout.Section>
          <Layout.Section>
            <Card>
              <div className="subscription-chart">
                <FormLayout.Group>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions.dunningChart}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions.dunningRecovered}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions.dunningChurn}
                  />
                </FormLayout.Group>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section>
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions.cancellationReasonsChart}
            />
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section>
            <DisplayText>Customer Actions</DisplayText>
          </Layout.Section>
          <div className="last">
            {/* <Layout.Section secondary> */}
            <div className="container-left">
              <Layout.Section>
                <Stack vertical distribution="equalSpacing">
                  {customerActionListKeys?.map((item, i) => (
                    <Stack.Item key={i}>
                      <Card sectioned>
                        <Stack
                          distribution="equalSpacing"
                          // spacing="extraTight"
                        >
                          <Stack.Item>
                            <TextStyle variation="strong">
                              {item.section}
                            </TextStyle>
                          </Stack.Item>
                          <Stack.Item>
                            <TextStyle
                              variation={sectionCustomerActionList[item.key]?.up ? 'positive' : 'negative'}
                            >
                              <Icon
                                source={sectionCustomerActionList[item.key]?.up ? CaretUpMinor : CaretDownMinor}
                                color={sectionCustomerActionList[item.key]?.up ? 'green' : 'red'}
                              />
                              {(sectionCustomerActionList[item.key]?.up===false && sectionCustomerActionList[item.key]?.percent==0)?100:sectionCustomerActionList[item.key].percent}%
                            </TextStyle>
                          </Stack.Item>
                        </Stack>
                        <Stack>
                          <Stack.Item>
                            <DisplayText size="medium">
                              <TextStyle variation="strong">
                              <CounterUp prefix={item?.prefix || ""} suffix={item?.suffix || ""} start={0} end={Number.parseFloat(sectionCustomerActionList[item.key]?.value).toFixed(2)} duration={1.5} decimals={2} />
                              </TextStyle>
                            </DisplayText>
                          </Stack.Item>
                        </Stack>
                      </Card>
                    </Stack.Item>
                  ))}
                </Stack>
              </Layout.Section>
            </div>
            {/* </Layout.Section> */}
            {/* <div className="container-right">
              <Layout.Section>
                <Card>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={CustomerActionChart_1}
                  />
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={CustomerActionChart_2}
                  />
                </Card>
              </Layout.Section>
            </div> */}
          </div>
        </Layout>
        <Layout>
          <Layout.Section>
            <Stack wrap={false} distribution="trailing">
              <Layout.Section>
                <DisplayText size="small">
                  Skips and Swap - Churned Customers
                </DisplayText>
                <DataTable
                  columnContentTypes={['numeric', 'text', 'text', 'text']}
                  headings={['', '', '', '']}
                  rows={rows_Churn}
                  hideScrollIndicator={true}
                />
              </Layout.Section>
              <Layout.Section>
                <DisplayText size="small">
                  Skips and Swap - Churned Customers
                </DisplayText>
                <DataTable
                  columnContentTypes={['numeric', 'text', 'text', 'text']}
                  headings={['', '', '', '']}
                  rows={rows_Churn}
                  hideScrollIndicator={true}
                />
              </Layout.Section>
            </Stack>
          </Layout.Section>
        </Layout>
      </Stack>
    </FormLayout>
  );
};

export default CustomerInsights;
