// reactjs ##
import { gql, useLazyQuery } from '@apollo/client';
// polaris ##
import {
  Button, ButtonGroup, Card,
  DisplayText, Heading,
  Layout, Page, Stack,
  Tabs,
  TextStyle,Icon,Spinner,Popover
} from '@shopify/polaris';
import {
  CaretUpMinor,
  CaretDownMinor,
} from '@shopify/polaris-icons';
// chart ##
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import AppLayout from '../layout/Layout';
import Modals from './Modals';
import CounterUp from 'react-countup';
import { isEmpty } from 'lodash';
import DateRangePicker from '../common/DatePicker/DateRangePicker';
import dayjs from 'dayjs';
import Notification from './Notification';


const Dashboard = (props) => {
  const history = useHistory();



  const getGraphDataQuery = gql`
  query($startDate: String!, $endDate: String!) {
    fetchDashboardReport(startDate: $startDate, endDate: $endDate) {
        mrr {
          value
          percent
          up
        }
        activeSubscriptionsCount {
          value
          percent
          up
        }
        churnRate {
          value
          percent
          up
        }
        customerLifetimeValue {
          value
          percent
          up
        }
        activeCustomers {
            data {
                value
            }
            date
        }
        revenueChurn {
            date
            data {
                value
            }
        }
        arrData {
            date
            data {
                value
            }
        }
        mrrData {
            date
            data {
                value
            }
        }
        refundData {
            date
            data {
                value
            }
        }
        salesData {
            date
            data {
                value
            }
        }
        renewalData {
            date
            data {
                value
            }
        }
    }
}`;

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

  // const [isTimeButton, setIsTimeButton] = useState("daily");
  const [sectionListData, setSectionListData] = useState({
    mrr: {value:"0",up:true,percent:0},
    subscriptions: {value:"0",up:true,percent:0},
    churn_rate: {value:"0",up:true,percent:0},
    cl_value: {value:"0",up:true,percent:0}
  })
  const [chartOptions, setChartOptions] = useState({
    sale: chartCustomDaily,
    customer: chartCustomDaily,
    revenue_churn: chartCustomDaily,
    renewal_rate: chartCustomDaily,
    mrr: chartCustomDaily,
    arr: chartCustomDaily,
    refunds: chartCustomDaily,
    cmrr: chartCustomDaily
  })
  const [chartSums, setChartSums] = useState({
    sale: "$0",
    customer: "$0",
    revenue_churn: "",
    renewal_rate: "",
    mrr: "$0",
    arr: "$0",
    refunds: "$0",
    cmrr: "$0"
  })

  const [filters,setFilters]=useState({
    startDate:new Date(Date.parse(dayjs(dayjs(dayjs(dayjs(new Date()).subtract(2,"days")).subtract(30, 'days'))).format())),
    endDate:new Date(Date.parse(dayjs(new Date()).subtract(1,"days").format()))
  })
  const handleFiltersDates=(dates,span)=>{
    console.log("hahah")
    if(!isEmpty(dates)){
      const {start,end}=dates;
      setFilters({startDate:dayjs(start).format("YYYY-MM-DD"),endDate:dayjs(end).format("YYYY-MM-DD"),span:span});
    }
  }

  const [getReport,{ loading, error, data }] = useLazyQuery(getGraphDataQuery, {fetchPolicy:"network-only"});


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

  useEffect(() => {
    if (!isEmpty(data?.fetchDashboardReport)) {
      const { fetchDashboardReport } = data;
      // Section List Update
      setSectionListData(prevSecList=>({
        mrr: fetchDashboardReport.mrr || prevSecList.mrr,
        subscriptions: fetchDashboardReport.activeSubscriptionsCount || prevSecList.subscriptions,
        churn_rate: fetchDashboardReport.churnRate || prevSecList.churn_rate,
        cl_value: fetchDashboardReport.customerLifetimeValue || prevSecList.cl_value
      }))

      // fetchDashboardReport.salesData.map(parseFloat(item=>item.data.value.value))}
      // fetchDashboardReport.salesData.map(item=>item.date)
      /// Charts Update
      const { sale, customer, revenue_churn, renewal_rate, mrr, arr, refunds, cmrr } = chartOptions;
      const newSale = { ...sale, series: [{ data: fetchDashboardReport?.salesData.map(item => parseInt(item.data.value)) || [] }], xAxis: { ...sale.xAxis, categories: fetchDashboardReport?.salesData.map(item => item.date) } || [] }
      const newCustomer = { ...customer, series: [{ data: fetchDashboardReport?.activeCustomers.map(item => parseInt(item.data.value)) || [] }], xAxis: { ...customer.xAxis, categories: fetchDashboardReport?.activeCustomers.map(item => item.date) || [] } }
      const newRevenueChurn = { ...revenue_churn, series: [{ data: fetchDashboardReport?.revenueChurn.map(item => parseInt(item.data.value)) || [] }], xAxis: { ...revenue_churn.xAxis, categories: fetchDashboardReport?.revenueChurn.map(item => item.date) || [] } }
      const newRenewal = { ...renewal_rate, series: [{ data: fetchDashboardReport?.renewalData.map(item => parseInt(item.data.value)) || [] }], xAxis: { ...renewal_rate.xAxis, categories: fetchDashboardReport?.renewalData.map(item => item.date) || [] } }
      const newMMR = { ...mrr, series: [{ data: fetchDashboardReport?.mrrData.map(item => parseInt(item.data.value)) || [] }], xAxis: { ...mrr.xAxis, categories: fetchDashboardReport?.mrrData.map(item => item.date) || [] } }
      const newARR = { ...arr, series: [{ data: fetchDashboardReport?.arrData.map(item => parseInt(item.data.value)) || [] }], xAxis: { ...arr.xAxis, categories: fetchDashboardReport?.arrData.map(item => item.date) || [] } }
      const newRefunds = { ...refunds, series: [{ data: fetchDashboardReport?.refundData.map(item => parseInt(item.data.value)) || [] }], xAxis: { ...refunds.xAxis, categories: fetchDashboardReport?.refundData.map(item => item.date) || [] } }
      const newCMRR = { ...cmrr, series: [{ data: fetchDashboardReport?.salesData.map(item => parseInt(item.data.value)) || [] }], xAxis: { ...cmrr.xAxis, categories: fetchDashboardReport?.salesData.map(item => item.date) || [] } }
      //  const
      setChartOptions({
        ...chartOptions,
        sale: newSale,
        customer: newCustomer,
        revenue_churn: newRevenueChurn,
        renewal_rate: newRenewal,
        mrr: newMMR,
        arr: newARR,
        refunds: newRefunds,
        cmrr: newCMRR
      })

      setChartSums({
        ...chartSums,
        sale: `$${fetchDashboardReport.salesData.map(item => parseInt(item.data.value)).reduce((a, b) => a + b, 0)}`,
        customer: `${fetchDashboardReport.activeCustomers.map(item => parseInt(item.data.value)).reduce((a, b) => a + b, 0)}`,
        // revenue_churn: `${fetchDashboardReport.revenueChurn.map(item => parseInt(item.data.value)).reduce((a, b) => a + b, 0)}`,
        // renewal_rate: `${fetchDashboardReport.renewalData.map(item => parseInt(item.data.value)).reduce((a, b) => a + b, 0)}`,
        revenue_churn: '',
        renewal_rate: '',
        mrr: `$${fetchDashboardReport.mrrData.map(item => parseInt(item.data.value)).reduce((a, b) => a + b, 0)}`,
        arr: `$${fetchDashboardReport.arrData.map(item => parseInt(item.data.value)).reduce((a, b) => a + b, 0)}`,
        refunds: `$${fetchDashboardReport.refundData.map(item => parseInt(item.data.value)).reduce((a, b) => a + b, 0)}`,
        cmrr: `$${fetchDashboardReport.salesData.map(item => parseInt(item.data.value)).reduce((a, b) => a + b, 0)}`
      })
    }

  }, [data])


  const sectionList = [
    { section: 'MRR', amount: '0', key: "mrr" ,type:"currency" },
    { section: 'Active Subscriptions', amount: '00', key: "subscriptions"},
    { section: 'Churn Rate', amount: '0', key: "churn_rate",type:"percent" },
    { section: 'Customer Lifetime Value', amount: '0', key: "cl_value" ,type:"currency"},
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
        { id: 'arr', content: 'ARR' },
        { id: 'mrr', content: 'MRR' }

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
            {
              process.env.APP_TYPE=="public" &&
              <div className="main-header-dashboard">
                <div className="left-btns">
                  <div className="get-started" onClick={()=>setGetStartedModal(true)} >
                    <svg width="19" height="32" viewBox="0 0 19 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.5752 0.454403C9.89939 -0.151504 8.88011 -0.151442 8.20428 0.454434C6.84053 1.6769 4.37887 4.276 3.21076 7.94708C2.61531 9.81856 2.3925 12.2048 2.59949 14.4939C2.60205 14.5221 2.60504 14.55 2.60772 14.5782L0.4276 17.1233C0.0687634 17.5423 -0.0737879 18.0925 0.0364342 18.6329L0.862564 22.6828C0.94616 23.0926 1.22899 23.4273 1.61909 23.5781C2.00925 23.7289 2.44364 23.6715 2.78118 23.4245L5.08 21.7423C5.11166 21.788 5.14327 21.8337 5.1755 21.8789C5.50563 22.3416 6.04452 22.6178 6.61709 22.6177L12.1624 22.6178C12.6371 22.6178 13.0887 22.4279 13.4174 22.0993C13.485 22.0316 13.5475 21.9579 13.604 21.8789C13.6362 21.8337 13.6678 21.788 13.6995 21.7423L15.9983 23.4245C16.3359 23.6715 16.7703 23.729 17.1603 23.5782C17.3227 23.5154 17.4663 23.4209 17.5849 23.3024C17.7513 23.1359 17.8681 22.9221 17.9169 22.6828L18.743 18.6329C18.8533 18.0925 18.7107 17.5423 18.3518 17.1234L16.1717 14.5783C16.1744 14.5502 16.1774 14.5222 16.18 14.494C16.387 12.2048 16.1642 9.81859 15.5687 7.94711C14.4006 4.27588 11.9388 1.67687 10.5752 0.454403ZM17.4331 18.3657L16.6429 22.2397L14.4025 20.6002C15.0984 19.3248 15.6092 17.8856 15.9163 16.335L17.3366 17.993C17.4252 18.0964 17.4604 18.2323 17.4331 18.3657ZM12.1624 21.2809H6.61706C6.47554 21.2809 6.34342 21.2142 6.2637 21.1024C5.85322 20.5271 5.51209 19.9298 5.22863 19.3292L13.549 19.3292C13.2083 20.0502 12.8462 20.6392 12.5157 21.1024C12.4358 21.2143 12.3039 21.2809 12.1624 21.2809ZM1.44292 17.993L2.86311 16.335C3.17017 17.8857 3.68104 19.3249 4.37688 20.6003L2.13655 22.2398L1.34634 18.3657C1.31911 18.2322 1.35434 18.0964 1.44292 17.993ZM14.8486 14.3735C14.7219 15.774 14.4414 16.9758 14.0915 17.9924H4.6876C4.23241 16.6639 4.02268 15.3883 3.93092 14.3735C3.73934 12.2551 3.94119 10.0605 4.48471 8.35236C5.55671 4.98309 7.83451 2.58158 9.09667 1.44974C9.26374 1.29994 9.51576 1.29994 9.68286 1.44977C10.9451 2.58152 13.2228 4.98312 14.2948 8.35243C14.8383 10.0605 15.0401 12.2551 14.8486 14.3735Z" fill="#007EFF" />
                      <path d="M11.7519 11.7569C12.3569 11.1518 12.7318 10.3162 12.7318 9.39488C12.7319 8.50217 12.3842 7.66293 11.753 7.03172C11.1218 6.40051 10.2825 6.05286 9.38981 6.05286C7.54695 6.05283 6.04776 7.55214 6.04779 9.39488C6.04776 10.2876 6.39541 11.1269 7.02662 11.7581C7.65783 12.3893 8.49713 12.7369 9.38981 12.7369C10.3113 12.7369 11.1467 12.3623 11.7519 11.7569ZM7.38455 9.39491C7.38451 8.84207 7.6094 8.34077 7.97249 7.97768C8.33561 7.61456 8.83691 7.38967 9.38975 7.3897C9.92536 7.3897 10.4289 7.5983 10.8076 7.97702C11.1863 8.35574 11.395 8.8593 11.395 9.39491C11.395 10.5006 10.4954 11.4001 9.38972 11.4001C8.85411 11.4001 8.35055 11.1916 7.97183 10.8129C7.59311 10.4341 7.38455 9.93052 7.38455 9.39491Z" fill="#007EFF" />
                      <path d="M7.03385 28.177C7.15481 28.056 7.22965 27.8889 7.22959 27.7043L7.22959 24.618C7.22959 24.2489 6.93034 23.9496 6.56117 23.9496C6.19203 23.9496 5.89274 24.2489 5.89274 24.618L5.89277 27.7043C5.89277 28.0734 6.19203 28.3727 6.5612 28.3727C6.74575 28.3727 6.91288 28.2979 7.03385 28.177Z" fill="#007EFF" />
                      <path d="M9.39013 23.9497C9.02099 23.9497 8.7217 24.249 8.7217 24.6182L8.72173 30.5518C8.72173 30.921 9.02098 31.2202 9.39016 31.2202C9.57474 31.2202 9.74181 31.1454 9.86278 31.0244C9.98374 30.9035 10.0586 30.7364 10.0585 30.5518L10.0585 24.6182C10.0585 24.249 9.7593 23.9497 9.39013 23.9497Z" fill="#007EFF" />
                      <path d="M11.5495 24.618L11.5495 27.7043C11.5495 28.0734 11.8488 28.3727 12.2179 28.3727C12.4025 28.3727 12.5696 28.2979 12.6906 28.177C12.8115 28.056 12.8864 27.8889 12.8863 27.7043L12.8863 24.618C12.8863 24.2489 12.5871 23.9496 12.2179 23.9496C11.8488 23.9496 11.5495 24.2489 11.5495 24.618Z" fill="#007EFF" />
                    </svg>
                    <a style={{ cursor: "pointer" }}>Get Started</a>
                  </div>
                  <div className="get-started">
                    <svg width="19" height="32" viewBox="0 0 19 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.5752 0.454403C9.89939 -0.151504 8.88011 -0.151442 8.20428 0.454434C6.84053 1.6769 4.37887 4.276 3.21076 7.94708C2.61531 9.81856 2.3925 12.2048 2.59949 14.4939C2.60205 14.5221 2.60504 14.55 2.60772 14.5782L0.4276 17.1233C0.0687634 17.5423 -0.0737879 18.0925 0.0364342 18.6329L0.862564 22.6828C0.94616 23.0926 1.22899 23.4273 1.61909 23.5781C2.00925 23.7289 2.44364 23.6715 2.78118 23.4245L5.08 21.7423C5.11166 21.788 5.14327 21.8337 5.1755 21.8789C5.50563 22.3416 6.04452 22.6178 6.61709 22.6177L12.1624 22.6178C12.6371 22.6178 13.0887 22.4279 13.4174 22.0993C13.485 22.0316 13.5475 21.9579 13.604 21.8789C13.6362 21.8337 13.6678 21.788 13.6995 21.7423L15.9983 23.4245C16.3359 23.6715 16.7703 23.729 17.1603 23.5782C17.3227 23.5154 17.4663 23.4209 17.5849 23.3024C17.7513 23.1359 17.8681 22.9221 17.9169 22.6828L18.743 18.6329C18.8533 18.0925 18.7107 17.5423 18.3518 17.1234L16.1717 14.5783C16.1744 14.5502 16.1774 14.5222 16.18 14.494C16.387 12.2048 16.1642 9.81859 15.5687 7.94711C14.4006 4.27588 11.9388 1.67687 10.5752 0.454403ZM17.4331 18.3657L16.6429 22.2397L14.4025 20.6002C15.0984 19.3248 15.6092 17.8856 15.9163 16.335L17.3366 17.993C17.4252 18.0964 17.4604 18.2323 17.4331 18.3657ZM12.1624 21.2809H6.61706C6.47554 21.2809 6.34342 21.2142 6.2637 21.1024C5.85322 20.5271 5.51209 19.9298 5.22863 19.3292L13.549 19.3292C13.2083 20.0502 12.8462 20.6392 12.5157 21.1024C12.4358 21.2143 12.3039 21.2809 12.1624 21.2809ZM1.44292 17.993L2.86311 16.335C3.17017 17.8857 3.68104 19.3249 4.37688 20.6003L2.13655 22.2398L1.34634 18.3657C1.31911 18.2322 1.35434 18.0964 1.44292 17.993ZM14.8486 14.3735C14.7219 15.774 14.4414 16.9758 14.0915 17.9924H4.6876C4.23241 16.6639 4.02268 15.3883 3.93092 14.3735C3.73934 12.2551 3.94119 10.0605 4.48471 8.35236C5.55671 4.98309 7.83451 2.58158 9.09667 1.44974C9.26374 1.29994 9.51576 1.29994 9.68286 1.44977C10.9451 2.58152 13.2228 4.98312 14.2948 8.35243C14.8383 10.0605 15.0401 12.2551 14.8486 14.3735Z" fill="#007EFF" />
                      <path d="M11.7519 11.7569C12.3569 11.1518 12.7318 10.3162 12.7318 9.39488C12.7319 8.50217 12.3842 7.66293 11.753 7.03172C11.1218 6.40051 10.2825 6.05286 9.38981 6.05286C7.54695 6.05283 6.04776 7.55214 6.04779 9.39488C6.04776 10.2876 6.39541 11.1269 7.02662 11.7581C7.65783 12.3893 8.49713 12.7369 9.38981 12.7369C10.3113 12.7369 11.1467 12.3623 11.7519 11.7569ZM7.38455 9.39491C7.38451 8.84207 7.6094 8.34077 7.97249 7.97768C8.33561 7.61456 8.83691 7.38967 9.38975 7.3897C9.92536 7.3897 10.4289 7.5983 10.8076 7.97702C11.1863 8.35574 11.395 8.8593 11.395 9.39491C11.395 10.5006 10.4954 11.4001 9.38972 11.4001C8.85411 11.4001 8.35055 11.1916 7.97183 10.8129C7.59311 10.4341 7.38455 9.93052 7.38455 9.39491Z" fill="#007EFF" />
                      <path d="M7.03385 28.177C7.15481 28.056 7.22965 27.8889 7.22959 27.7043L7.22959 24.618C7.22959 24.2489 6.93034 23.9496 6.56117 23.9496C6.19203 23.9496 5.89274 24.2489 5.89274 24.618L5.89277 27.7043C5.89277 28.0734 6.19203 28.3727 6.5612 28.3727C6.74575 28.3727 6.91288 28.2979 7.03385 28.177Z" fill="#007EFF" />
                      <path d="M9.39013 23.9497C9.02099 23.9497 8.7217 24.249 8.7217 24.6182L8.72173 30.5518C8.72173 30.921 9.02098 31.2202 9.39016 31.2202C9.57474 31.2202 9.74181 31.1454 9.86278 31.0244C9.98374 30.9035 10.0586 30.7364 10.0585 30.5518L10.0585 24.6182C10.0585 24.249 9.7593 23.9497 9.39013 23.9497Z" fill="#007EFF" />
                      <path d="M11.5495 24.618L11.5495 27.7043C11.5495 28.0734 11.8488 28.3727 12.2179 28.3727C12.4025 28.3727 12.5696 28.2979 12.6906 28.177C12.8115 28.056 12.8864 27.8889 12.8863 27.7043L12.8863 24.618C12.8863 24.2489 12.5871 23.9496 12.2179 23.9496C11.8488 23.9496 11.5495 24.2489 11.5495 24.618Z" fill="#007EFF" />
                    </svg>

                    <NavLink style={{ textDecoration: "none", cursor: "pointer" }} to={'/installation'}>Installation</NavLink>
                  </div>
                </div>
              </div>
            }

          </Layout.Section>

          <Layout.Section>
            <div class="feeds-container">
            <Notification />
            </div>
          </Layout.Section>

          <div style={{width:'100%'}}>
            <Layout.Section>
            <div className="analytic-section" >

                <div className="deep-analytics">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.9227 13.2883C20.9974 9.72681 18.1611 6.76855 14.6005 6.69322C11.0392 6.61799 8.08039 9.45399 8.00506 13.015C8.00395 13.075 8.00963 13.1304 8.01019 13.1905H8.00963C8.00963 13.2085 8.01186 13.2266 8.01186 13.2458C8.0142 13.4281 8.02178 13.6114 8.03983 13.7902C8.0483 13.8854 8.06412 13.9792 8.07694 14.0732C8.09187 14.1784 8.10469 14.2826 8.12508 14.3845C8.13188 14.4212 8.13467 14.458 8.1418 14.4937C8.14459 14.4937 8.14748 14.4937 8.15105 14.4937C8.22694 14.8502 8.3259 15.1975 8.45808 15.5304C8.45406 15.5304 8.44927 15.5304 8.44537 15.5304C8.62669 15.9945 8.86328 16.4308 9.14144 16.8354C9.15069 16.8354 9.15927 16.8354 9.16919 16.8354C9.78692 17.7199 10.6191 18.4431 11.5944 18.9287C11.5696 18.9287 11.544 18.9287 11.5192 18.9287C12.2951 19.3282 13.1609 19.5749 14.081 19.6292C14.0823 19.6178 14.081 19.6032 14.081 19.5913C14.1636 19.5964 14.2441 19.6072 14.3278 19.6093C15.1031 19.6247 15.8455 19.4979 16.5405 19.2602V19.2988C17.0996 19.1086 17.6258 18.8461 18.1046 18.5165V18.4759C19.7647 17.3407 20.8763 15.4506 20.9227 13.2883ZM14.3604 17.9882C12.0826 17.9406 10.2064 16.3153 9.74034 14.182C9.72529 14.1095 9.70757 14.0382 9.69587 13.9658C9.68317 13.8878 9.67436 13.8085 9.66511 13.7304C9.64673 13.5618 9.63146 13.3921 9.63079 13.2176C9.63023 13.161 9.62455 13.1068 9.62577 13.049C9.63034 12.8238 9.65575 12.603 9.69063 12.3857C9.69286 12.3857 9.69487 12.3857 9.6971 12.3857C9.77466 11.9254 9.91608 11.4879 10.1137 11.0816C10.1074 11.0816 10.1003 11.0816 10.0942 11.0816C10.8873 9.41388 12.602 8.27303 14.5643 8.3146C15.2717 8.32965 15.9382 8.50027 16.5381 8.78634V8.82479C17.1391 9.11198 17.67 9.51941 18.1035 10.0156V9.97722C18.868 10.8541 19.3252 12.002 19.2991 13.2538C19.243 15.9209 17.027 18.0452 14.3604 17.9882ZM25 22.9698L23.5417 24.3676L18.6851 19.3011L20.1429 17.9033L25 22.9698ZM7.39469 6.92725C6.27056 6.92725 5.14632 6.92725 4.02164 6.92725C3.21101 6.92725 3.21101 5.62281 4.02164 5.62281C5.14632 5.62281 6.27056 5.62281 7.39469 5.62281C8.20588 5.62281 8.20588 6.92725 7.39469 6.92725ZM4.02164 9.03608C3.21101 9.03608 3.21101 7.73164 4.02164 7.73164C5.14632 7.73164 6.27056 7.73164 7.39469 7.73164C8.20532 7.73164 8.20532 9.03608 7.39469 9.03608C6.27056 9.03608 5.14688 9.03608 4.02164 9.03608ZM18.1045 10.9912V15.3792C17.7209 16.0109 17.1809 16.5349 16.5398 16.8982V9.47517C17.1843 9.8368 17.7224 10.362 18.1045 10.9912ZM16.5398 19.9121C17.0938 19.739 17.6167 19.4918 18.1045 19.1936V24.1417H0V0.631836H14.7407L18.1045 3.89377V7.17376C17.6121 6.87465 17.0881 6.63582 16.5398 6.46665V4.68112H13.9343V2.19683H1.56499V22.5764H16.5397V19.9121H16.5398ZM13.4799 16.8354C13.2694 16.8354 12.8393 16.8354 12.2718 16.8354C11.7259 16.5067 11.2594 16.0601 10.9094 15.5304C12.1308 15.5304 13.1223 15.5304 13.4805 15.5304C14.2902 15.531 14.2902 16.8354 13.4799 16.8354ZM3.84534 15.531C4.33402 15.531 6.00455 15.531 7.82931 15.531C7.98923 15.986 8.19485 16.4229 8.4476 16.836C6.39393 16.836 4.38896 16.836 3.84534 16.836C3.03526 16.8354 3.03526 15.531 3.84534 15.531ZM13.4799 14.4948C13.0758 14.4948 11.8574 14.4948 10.4132 14.4948C10.2799 14.0829 10.2075 13.6448 10.2075 13.1898C11.7409 13.1898 13.0554 13.1898 13.4792 13.1898C14.2902 13.1898 14.2902 14.4948 13.4799 14.4948ZM3.84534 13.1898C4.29802 13.1898 5.76461 13.1898 7.4289 13.1898C7.42834 13.6318 7.46657 14.0687 7.54658 14.4948C5.83415 14.4948 4.30816 14.4948 3.84534 14.4948C3.03526 14.4948 3.03526 13.1898 3.84534 13.1898ZM13.4799 12.3868C13.0623 12.3868 11.7851 12.3868 10.286 12.3868C10.3762 11.9208 10.5415 11.481 10.7715 11.0821C12.0556 11.0821 13.1087 11.0821 13.4799 11.0821C14.2902 11.0821 14.2902 12.3868 13.4799 12.3868ZM3.84534 11.0821C4.327 11.0821 5.95874 11.0821 7.75409 11.0821C7.62025 11.5022 7.52407 11.9379 7.47203 12.3868C5.78957 12.3868 4.30214 12.3868 3.84545 12.3868C3.03526 12.3868 3.03526 11.0821 3.84534 11.0821ZM10.1068 20.2348C9.29613 20.2348 9.29613 18.931 10.1068 18.931C10.2024 18.931 10.298 18.931 10.3936 18.931C11.371 19.6282 12.5056 20.0582 13.7095 20.1862C13.6422 20.2134 13.567 20.2349 13.4803 20.2349C12.3551 20.2348 11.2316 20.2348 10.1068 20.2348Z" fill="white"/>
                  </svg>
                  <NavLink style={{textDecoration:"none",cursor:"pointer"}} to={'/analytics'}>Dive Deep Analytics</NavLink>
                </div>

              {/* <ButtonGroup segmented>
                <Button onClick={() => setIsTimeButton("daily")} primary={isTimeButton == "daily"}>
                  Daily
              </Button>
                <Button onClick={() => setIsTimeButton("3 Month")} primary={isTimeButton == "3 Month"}>3 Months</Button>
                <Button onClick={() => setIsTimeButton("6 Month")} primary={isTimeButton == "6 Month"}>6 Months</Button>
                <Button onClick={() => setIsTimeButton("12 Month")} primary={isTimeButton == "12 Month"}>12 Months</Button>
              </ButtonGroup> */}
            </div>
            </Layout.Section>
            </div>
          {(loading || !data) ? (
            <Layout.Section>
              <Card>
                <Spinner
                  accessibilityLabel="Spinner example"
                  size="large"
                  color="teal"
                />
              </Card>
            </Layout.Section>
          ) :
          <>
          <div className='dashboard-cards' style={{width:'100%'}}>
            <Layout.Section>
              <Stack distribution="fill">
                {sectionList?.map((item, i) => (
                  <Stack.Item key={i}>
                    <div className="dashboard-card-section">
                    <Card sectioned>
                      <Stack>
                        <Stack.Item fill>
                          <TextStyle variation="strong">{item.section}</TextStyle>
                        </Stack.Item>

                        <Stack.Item>
                          <TextStyle
                          variation={sectionListData[item.key]?.up ? 'positive' : 'negative'}
                        >
                          <Icon
                            source={sectionListData[item.key]?.up ? CaretUpMinor : CaretDownMinor}
                            color={sectionListData[item.key]?.up ? 'green' : 'red'}
                          />
                          {Math.abs(sectionListData[item.key]?.percent) || 0}%
                        </TextStyle>
                        </Stack.Item>
                      </Stack>

                      <Stack>
                        <Stack.Item>
                        <DisplayText size="medium">
                            <TextStyle variation="strong">
                          {/* <DisplayText size="medium">{sectionListData[item.key] || item?.amount}</DisplayText> */}
                          <CounterUp prefix={item.type=="currency"?"$":""} suffix={item.type=="percent"?"%":""} start={0} end={Number.parseFloat(sectionListData[item.key]?.value || item?.amount).toFixed(2)} duration={1.5} decimals={item.type=="currency"?2:0} />
                       </TextStyle>
                       </DisplayText>
                        </Stack.Item>
                      </Stack>
                    </Card>
                    </div>
                  </Stack.Item>
                ))}
              </Stack>
            </Layout.Section>
            <Layout.Section>
          <Layout>
          <Layout.Section>
              <Card title="">
                <Card.Section>
                  <div className="rev-date-picker">
                    <DateRangePicker
                      start={filters.startDate}
                      end={filters.endDate}
                      span={filters.span}
                      handleDates={handleFiltersDates}
                    />
                    </div>
                </Card.Section>
              </Card>
            </Layout.Section>
          </Layout>
          </Layout.Section>
            </div>
            {listContainerChart?.map((item, i) => (
              <Layout.Section oneHalf key={i}>
                <Tabs
                  tabs={item.tabs}
                  selected={item.selected}
                  onSelect={item.handle}
                >
                  <div className="dashboard-bottom-card-section">
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
                  </div>
                </Tabs>
              </Layout.Section>
            ))}
          </>
          }
          <Modals active={getStartedModal} setActive={setGetStartedModal} domain={props.domain} />
        </Layout>
      </Page>
    </AppLayout>
  );
};
export default Dashboard;
