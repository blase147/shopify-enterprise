// reactjs ##
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import AppLayout from '../layout/Layout';
import Modals from './Modals'

// chart ##
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// polaris ##
import {
  Card,
  Select,
  TextField,
  ButtonGroup,
  Button,
  Badge,
  Link,
  Stack,
  Page,
  Tabs,
  Modal,
  Icon,
  Avatar,
  Heading,
  Subheading,
  Layout,
  TextStyle,
  DisplayText,
  TextContainer,
} from '@shopify/polaris';


import { CaretUpMinor, CaretDownMinor } from '@shopify/polaris-icons';
import getStarted from '../../../assets/images/dasboard/rocket.svg';
import searchNote from '../../../assets/images/dasboard/searchNote.svg';

import { set } from 'lodash';
import { gql, useQuery } from '@apollo/client';

const Dashboard = (props) => {
  const history = useHistory();

  const getGraphDataQuery = gql`
   query($duration: String!) {  
    fetchDashboardReport(duration: $duration) {
        mrr
        activeSubscriptionsCount
        churnRate
        activeCustomers {
            data
            date
        }
        customerLifetimeValue
        revenueChurn {
            date
            data
        }
        arrData {
            date
            data
        }
        mrrData {
            date
            data
        }
        refundData {
            date
            data
        }
        salesData {
            date
            data
        }
        renewalData {
          date
          data
      }
    } }`;

  const chartCustomDaily = {
    chart: {
      type: 'area',
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: [],
      allowDecimals: false,
      title: null,
      labels: {
        formatter: function () {
          return this.value;
        },
      },
    },
    yAxis: {
      title: null,
      labels: {
        formatter: function () {
          return this.value / 1000 + 'k';
        },
      },
    },
    plotOptions: {
      area: {
        marker: {
          pointStart: 3,
          enabled: false,
          symbol: 'circle',
          radius: 2,
          states: {
            hover: {
              enabled: true,
            },
          },
        },
      },
    },
    series: [
      {
        data: [
        ],
      },
    ],
  };

  const [isTimeButton, setIsTimeButton] = useState("daily");
  const [sectionListData,setSectionListData]=useState({
    mrr:"0",
    subscriptions:"0",
    churn_rate:"0",
    cl_value:"0"
  })
  const [chartOptions,setChartOptions]=useState({
    sale:chartCustomDaily,
    customer:chartCustomDaily,
    revenue_churn:chartCustomDaily,
    renewal_rate:chartCustomDaily,
    mrr:chartCustomDaily,
    arr:chartCustomDaily,
    refunds:chartCustomDaily,
    cmrr:chartCustomDaily
  })
  const [chartSums,setChartSums]=useState({
    sale:"$0",
    customer:"$0",
    revenue_churn:"$0",
    renewal_rate:"$0",
    mrr:"$0",
    arr:"$0",
    refunds:"$0",
    cmrr:"$0"
  })
  const { loading, error, data, refetch } = useQuery(getGraphDataQuery, {
    variables: {  "duration": isTimeButton}
  });

 useEffect(() => {
   refetch();
 }, [isTimeButton])

  useEffect(() => {
    if(data){
      const { fetchDashboardReport }=data;
      // Section List Update
      setSectionListData({
        mrr:"$"+fetchDashboardReport.mrr,
        subscriptions:fetchDashboardReport.activeSubscriptionsCount,
        churn_rate:fetchDashboardReport.churnRate+"%",
        cl_value:"$"+fetchDashboardReport.customerLifetimeValue
      })

      // fetchDashboardReport.salesData.map(parseFloat(item=>item.data))}
      // fetchDashboardReport.salesData.map(item=>item.date)
      /// Charts Update
     const {sale,customer,revenue_churn,renewal_rate, mrr, arr, refunds, cmrr } =chartOptions;
     const newSale={...sale,series:[{data:fetchDashboardReport.salesData.map(item=> parseInt(item.data))}],xAxis: {...sale.xAxis,categories:fetchDashboardReport.salesData.map(item=>item.date)}}
     const newCustomer={...customer,series:[{data:fetchDashboardReport.activeCustomers.map(item=> parseInt(item.data))}],xAxis: {...customer.xAxis,categories:fetchDashboardReport.activeCustomers.map(item=>item.date)}}
     const newRevenueChurn={...revenue_churn,series:[{data:fetchDashboardReport.revenueChurn.map(item=> parseInt(item.data))}],xAxis: {...revenue_churn.xAxis,categories:fetchDashboardReport.revenueChurn.map(item=>item.date)}}
     const newRenewal={...renewal_rate,series:[{data:fetchDashboardReport.renewalData.map(item=> parseInt(item.data))}],xAxis: {...renewal_rate.xAxis,categories:fetchDashboardReport.renewalData.map(item=>item.date)}}
     const newMMR={...mrr,series:[{data:fetchDashboardReport.mrrData.map(item=> parseInt(item.data))}],xAxis: {...mrr.xAxis,categories:fetchDashboardReport.mrrData.map(item=>item.date)}}
     const newARR={...arr,series:[{data:fetchDashboardReport.arrData.map(item=> parseInt(item.data))}],xAxis: {...arr.xAxis,categories:fetchDashboardReport.arrData.map(item=>item.date)}}
     const newRefunds={...refunds,series:[{data:fetchDashboardReport.refundData.map(item=> parseInt(item.data))}],xAxis: {...refunds.xAxis,categories:fetchDashboardReport.refundData.map(item=>item.date)}}
     const newCMRR={...cmrr,series:[{data:fetchDashboardReport.salesData.map(item=> parseInt(item.data))}],xAxis: {...cmrr.xAxis,categories:fetchDashboardReport.salesData.map(item=>item.date)}}
    //  const 
    setChartOptions({
        ...chartOptions,
        sale:newSale,
        customer:newCustomer,
        revenue_churn:newRevenueChurn,
        renewal_rate:newRenewal,
        mrr:newMMR,
        arr:newARR,
        refunds:newRefunds,
        cmrr:newCMRR
      })

      setChartSums({
        ...chartSums,
        sale:fetchDashboardReport.salesData.map(item=> parseInt(item.data)).reduce((a, b) => a + b, 0),
        customer:fetchDashboardReport.activeCustomers.map(item=> parseInt(item.data)).reduce((a, b) => a + b, 0),
        revenue_churn:fetchDashboardReport.revenueChurn.map(item=> parseInt(item.data)).reduce((a, b) => a + b, 0),
        renewal_rate:fetchDashboardReport.renewalData.map(item=> parseInt(item.data)).reduce((a, b) => a + b, 0),
        mrr:fetchDashboardReport.mrrData.map(item=> parseInt(item.data)).reduce((a, b) => a + b, 0),
        arr:fetchDashboardReport.arrData.map(item=> parseInt(item.data)).reduce((a, b) => a + b, 0),
        refunds:fetchDashboardReport.refundData.map(item=> parseInt(item.data)).reduce((a, b) => a + b, 0),
        cmrr:fetchDashboardReport.salesData.map(item=> parseInt(item.data)).reduce((a, b) => a + b, 0)
      })
    }
   
  }, [data])


  const sectionList = [
    { section: 'MRR', amount: '$0.0' , key:"mrr" },
    { section: 'Active Subscriptions', amount: '00', key:"subscriptions"},
    { section: 'Churn Rate', amount: '0%', key:"churn_rate" },
    { section: 'Customer Lifetime Value', amount: '$0', key:"cl_value" },
    // { section: 'MBR', percent: '24', up: true, amount: '$47,433' },
    // {
    //   section: 'Active Subscriptions',
    //   percent: '1',
    //   up: false,
    //   amount: '1,980',
    // },
    // { section: 'Net Revenue', percent: '2', up: true, amount: '$500,012' },
    // { section: 'Total Refunds', percent: '2', up: false, amount: '$550.12' },
  ];
  

  const [selectedTitleTab_1, setSelectedTitleTab_1] = useState(0);
  const handleTabChange_1 = useCallback(
    (selectedTabIndex) => setSelectedTitleTab_1(selectedTabIndex),
    []
  );

  const [selectedTitleTab_2, setSelectedTitleTab_2] = useState(0);
  const handleTabChange_2 = useCallback(
    (selectedTabIndex) => setSelectedTitleTab_2(selectedTabIndex),
    []
  );

  const [selectedTitleTab_3, setSelectedTitleTab_3] = useState(0);
  const handleTabChange_3 = useCallback(
    (selectedTabIndex) => setSelectedTitleTab_3(selectedTabIndex),
    []
  );

  const [selectedTitleTab_4, setSelectedTitleTab_4] = useState(0);
  const handleTabChange_4 = useCallback(
    (selectedTabIndex) => setSelectedTitleTab_4(selectedTabIndex),
    []
  );

  const listContainerChart = [
    {
      tabs: [
        { id: 'sale', content: 'Sales' },
        { id: 'customer', content: 'Customer' },
      ],
      number: '$20.24K',
      number_small: 'Jan $83.98K',
      chart: { chartDaily },
      selected: selectedTitleTab_1,
      handle: handleTabChange_1,
    },
    {
      tabs: [
        { id: 'revenue_churn', content: 'Revenue Churn' },
        { id: 'renewal_rate', content: 'Renewal Rate' },
      ],
      number: '$20.24K',
      number_small: 'Jan $83.98K',
      chart: { chartDaily },
      selected: selectedTitleTab_2,
      handle: handleTabChange_2,
    },
    {
      tabs: [
        { id: 'mrr', content: 'MRR' },
        { id: 'arr', content: 'ARR' },
      ],
      number: '$20.24K',
      number_small: 'Jan $83.98K',
      chart: { chartDaily },
      selected: selectedTitleTab_3,
      handle: handleTabChange_3,
    },
    {
      tabs: [
        { id: 'refunds', content: 'Refunds' },
        { id: 'cmrr', content: 'CMRR' },
      ],
      number: '$20.24K',
      number_small: 'Jan $83.98K',
      chart: { chartDaily },
      selected: selectedTitleTab_4,
      handle: handleTabChange_4,
    }
  ];

  const chartDaily = {
    chart: {
      type: 'area',
    },
    title: {
      text: null,
    },
    xAxis: {
      allowDecimals: false,
      title: null,
      labels: {
        formatter: function () {
          return 'Jan ' + this.value;
        },
      },
    },
    yAxis: {
      title: null,
      labels: {
        formatter: function () {
          return this.value / 1000 + 'k';
        },
      },
    },
    plotOptions: {
      area: {
        marker: {
          pointStart: 3,
          enabled: false,
          symbol: 'circle',
          radius: 2,
          states: {
            hover: {
              enabled: true,
            },
          },
        },
      },
    },
    series: [
      {
        name: 'Money',
        data: [
          null,
          null,
          null,
          1500,
          500,
          2500,
          1200,
          1600,
          1300,
          200,
          600,
          3300,
          1600,
          1300,
          800,
          2500,
          1600,
          2500,
          3500,
          4200,
          4600,
          4200,
          4600,
          2000,
          3500,
          2600,
          400,
          3900,
          null,
          null,
        ],
      },
    ],
  };



  const [getStartedModal, setGetStartedModal] = useState(false);
  const handleChange = useCallback(() => setGetStartedModal(!getStartedModal), [getStartedModal]);

  return (
    <AppLayout typePage="Dashboard" tabIndex="0">
      <Page>
        <Layout>
        <Layout.Section>
            <ButtonGroup segmented>
              <Button onClick={() => setIsTimeButton("daily")} primary={isTimeButton=="daily"}>
                Daily
              </Button>
              <Button onClick={() => setIsTimeButton("3 Month")} primary={isTimeButton=="3 Month"}>3 Months</Button>
              <Button onClick={() => setIsTimeButton("6 Month")} primary={isTimeButton=="6 Month"}>6 Months</Button>
              <Button onClick={() => setIsTimeButton("12 Month")} primary={isTimeButton=="12 Month"}>12 Months</Button>
            </ButtonGroup>
          </Layout.Section>
          
          <Layout.Section>
            <Stack distribution="fill">
              {sectionList?.map((item, i) => (
                <Stack.Item key={i}>
                  <Card sectioned>
                    <Stack>
                      <Stack.Item fill>
                        <TextStyle variation="strong">{item.section}</TextStyle>
                      </Stack.Item>

                      <Stack.Item>
                        {/* <TextStyle
                          variation={item.up ? 'positive' : 'negative'}
                        >
                          <Icon
                            source={item.up ? CaretUpMinor : CaretDownMinor}
                            color={item.up ? 'green' : 'red'}
                          />
                          {item.percent}%
                        </TextStyle> */}
                      </Stack.Item>
                    </Stack>

                    <Stack>
                      <Stack.Item>
                        <DisplayText size="medium">{sectionListData[item.key] || item?.amount}</DisplayText>
                      </Stack.Item>
                    </Stack>
                  </Card>
                </Stack.Item>
              ))}
            </Stack>
          </Layout.Section>
          <Layout.Section>
          {listContainerChart?.map((item, i) => (
              <Layout.Section oneHalf key={i}>
                <Tabs
                  tabs={item.tabs}
                  selected={item.selected}
                  onSelect={item.handle}
                >
                  <Card>
                    <Card.Section>
                      <Heading>{chartSums[item.tabs[item.selected]?.id]}</Heading>
                      {/* <Subheading className="number-below">
                        {item.number_small}
                      </Subheading> */}

                      <HighchartsReact
                        highcharts={Highcharts}
                        options={chartOptions[item.tabs[item.selected]?.id]}
                      />
                    </Card.Section>
                  </Card>
                </Tabs>
              </Layout.Section>
            ))}
          </Layout.Section>
            
          
          

          <Modals active={getStartedModal} setActive={setGetStartedModal} domain={props.domain}/>
        </Layout>
      </Page>
    </AppLayout>
  );
};
export default Dashboard;
