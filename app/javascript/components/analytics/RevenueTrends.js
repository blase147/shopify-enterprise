import { gql, useLazyQuery } from '@apollo/client';
import {
  Button, Card,
  DataTable, DisplayText, FormLayout,
  Heading, Layout,
  Select, Stack,
  TextField,
  TextStyle,
  Icon,
  Spinner,
  ButtonGroup
} from '@shopify/polaris';
import {
  DropdownMinor,
  CaretUpMinor,
  CaretDownMinor,
} from '@shopify/polaris-icons';
import dayjs from 'dayjs';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState, useContext } from 'react';
import CounterUp from 'react-countup';
import DateRangePicker from '../common/DatePicker/DateRangePicker';
import LoadingScreen from '../LoadingScreen';
import { FilterContext } from './../common/Contexts/AnalyticsFilterContext';

const RevenueTrends = () => {
  const [expandedFilter, setExpandedFilter] = useState(false);

  const [selected_1, setSelected_1] = useState('today');
  const handleSelectChange_1 = useCallback((value) => setSelected_1(value), []);

  // const [filters,setFilters,productCharts,setProductCharts]=useContext(FilterContext)
  const [filters, setFilters] = useState({
    startDate: new Date(Date.parse(dayjs(dayjs(dayjs(dayjs(new Date()).subtract(1, "days")).subtract(30, 'days'))).format())),
    endDate: new Date(Date.parse(dayjs(new Date()).subtract(1, "days").format())),
    reload: false
  })
  const handleFiltersDates = (dates, span) => {
    if (!isEmpty(dates)) {
      const { start, end } = dates;
      setFilters({ startDate: dayjs(start).format("YYYY-MM-DD"), endDate: dayjs(end).format("YYYY-MM-DD"), span: span, refresh: false });
    }
  }
  const handleForceUpdates = (dates, span) => {
    if (!isEmpty(dates)) {
      const { start, end } = dates;
      setFilters({ startDate: dayjs(start).format("YYYY-MM-DD"), endDate: dayjs(end).format("YYYY-MM-DD"), span: span, refresh: true });
    }
  }

  const selectOptions = useMemo(() => ([
    { label: 'Day', value: 'day' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' }
  ]), [])


  ///Graph Query...
  const fetchReport = gql`
  query($startDate: String, $endDate: String) {  
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
        activeVsChurnedData {
            date
            data {
                activeCustomers
                churnedCustomers
            }
        }
        totalSalesData {
            date
            data {
                value
                chargeCount
            }
        }
        refundsData {
            date
            data {
                value
                refundsCount
            }
        }
        activeCustomersData {
            date
            data {
                value
            }
        }
        newVsCancelledData {
            date
            data {
                newSubscriptionsCount
                cancelledSubscriptionsCount
            }
        }
        recurringVsCheckout {
            date
            data {
                recurringSales
                oneTimeSales
            }
        }
        skuBySubscriptions {
            sku
            value
        }
        skuByRevenue {
            sku
            value
        }
        skuByCustomers {
          sku
          value
        }
        billingFrequencyRevenue {
            billingPolicy
            value
        }
        skuByFrequency {
            billingPolicy
            skus {
                sku
                value
            }
        }
        estimatedSevenDays
        estimatedThirtyDays
        estimatedNinetyDays
        historicalSevenDaysRevenue
        historicalThirtyDaysRevenue
        historicalNinetyDaysRevenue
        sevenDaysErrorRevenue
        thirtyDaysErrorRevenue
        ninetyDaysErrorRevenue
        sevenDaysUpcomingCharge
        thirtyDaysUpcomingCharge
        ninetyDaysUpcomingCharge
        sevenDaysErrorCharge
        thirtyDaysErrorCharge
        ninetyDaysErrorCharge
    }
}
  `;

  // subscriptions chart
  const SubscriptionsChart = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'New Subscriptions vs Cancellations',
    },
    xAxis: {
      categories: [],
    },
    yAxis: {
      title: {
        text: 'Number of Subscription',
      },
    },
    exporting: {
      enabled: false,
    },
    plotOptions: {
      column: {
        stacking: 'normal',
      },
    },
    series: [
      {
        name: 'New Subscriptions',
        data: [],
        color: '#007ffa',
      },
      {
        name: 'Cancellations',
        data: [],
        color: '#202b35',
      },
    ],
  };
  //active customer chart
  const CustomerChart = {
    chart: {
      height: '400px',
    },
    title: {
      text: 'Active Customers',
    },

    yAxis: {
      title: {
        text: 'Active Customers',
      },
    },

    xAxis: {
      categories: [],
    },
    exporting: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },

    series: [
      {
        name: '',
        data: [],
        color: '#202b35',
      },
    ],
  };
  const skuRevenue = {
    colors: ["#0D91AE", "#6B97C5", "#FFF500", "#FFCC00", "#E77320", "#FF0000", "#FF5C00", "#979797", "#000000", "#00A023", "#8000A0", "#A0007D", "#F4EC19"],
    title: {
      text: 'Top 14 SKUs by Recurring Revenue (Subscriptions)'
    },
    tooltip: {
      pointFormat: '<b>{point.y}</b>',
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: 'Recurring Revenue ($)'
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
      data: [],
      showInLegend: false
    }]
  }
  const skuSubscriptions = {
    colors: ["#0D91AE", "#6B97C5", "#FFF500", "#FFCC00", "#E77320", "#FF0000", "#FF5C00", "#979797", "#000000", "#00A023", "#8000A0", "#A0007D", "#F4EC19"],
    title: {
      text: 'Top 14 SKUs by Subscriptions'
    },
    tooltip: {
      pointFormat: '<b>{point.y}</b>',
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: 'Subscriptions'
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
      data: [],
      showInLegend: false
    }]
  }
  const insightChart = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      height: '400px',
      // width: '720px',
    },
    colors: ['#000000', '#57AAFF', '#979797', '#FFCC00', '#E77320', '#FF0000', '#FF5C00', '#212B36', '#979797', '#000000', '#00A023', '#8000A0', '#A0007D', '#F4EC19'],
    title: {
      text: 'Revenue by Subscription Frequency',
      // align: 'center',
      // verticalAlign: 'middle',
      // // y: 60,
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
          format: '{point.y} %',
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
  // Refunds chart
  const RefundChart = {
    chart: {
      zoomType: 'xy',
    },
    title: {
      text: 'Refunds',
    },
    xAxis: [
      {
        categories: categories,
        crosshair: true,
      },
    ],
    yAxis: [
      {
        // Primary yAxis
        labels: {
          format: '{value}',
          style: {
            color: '#202b35',
          },
        },
        title: {
          text: 'Refund Count',
          style: {
            color: '#202b35',
          },
        },
      },
      {
        // Secondary yAxis
        title: {
          text: 'Refund Amount',
          style: {
            color: '#202b35',
          },
        },
        labels: {
          format: '{value}',
          style: {
            color: '#202b35',
          },
        },
        opposite: true,
      },
    ],
    exporting: {
      enabled: false,
    },
    tooltip: {
      shared: true,
    },
    series: [
      {
        name: 'Refund Count',
        type: 'column',
        yAxis: 1,
        data: [],
        color: '#202b35',
        fillOpacity: 0.4,
      },
      {
        name: 'Refund amount',
        type: 'spline',
        data: [],
        color: '#959595',
        fillOpacity: 0.4,
      },
    ],
  };
  //Sales Chart 
  const SaleChart = {
    chart: {
      zoomType: 'xy',
    },
    title: {
      text: 'Subscriptions Revenue (incl. refunds)',
    },
    xAxis: [
      {
        categories: [],
        crosshair: true,
        angle: 90,
      },
    ],
    yAxis: [
      {
        // Primary yAxis
        labels: {
          format: '{value}',
          style: {
            color: '#202b35',
          },
        },
        title: {
          text: 'Revenue ($)',
          style: {
            color: '#202b35',
          },
        },
      },
      {
        // Secondary yAxis
        title: {
          text: 'Charge Count',
          style: {
            color: '#202b35',
          },
        },
        labels: {
          format: '{value}',
          style: {
            color: '#202b35',
          },
        },
        opposite: true,
      },
    ],
    exporting: {
      enabled: false,
    },
    tooltip: {
      shared: true,
    },
    series: [
      {
        name: 'Charge Count',
        type: 'spline',
        yAxis: 1,
        data: [],
        color: '#00a030',
      },
      {
        name: 'Subscriptions revenue',
        type: 'column',
        data: [],
        color: '#007ffa',
      },
    ],
  };
  //ActiveVsChurnedChart
  const Active_Churned_CustomerChart = {
    chart: {
      type: 'area'
    },
    title: {
      text: 'Active Customers vs Churned Customers'
    },
    xAxis: {
      allowDecimals: false,
      labels: {
        formatter: function () {
          return this.value;
        }
      },
      categories: []
    },
    yAxis: {
      title: {
        text: 'Number of Customers'
      },
      labels: {
        formatter: function () {
          return this.value;
        }
      }
    },
    tooltip: {
      pointFormat: '{series.name} : {point.y}'
    },
    plotOptions: {
      area: {
        marker: {
          enabled: false,
          symbol: 'circle',
          radius: 2,
          states: {
            hover: {
              enabled: true
            }
          }
        }
      }
    },
    series: [{
      name: 'Active Customers',
      data: []
    }, {
      name: 'Churned Customers',
      data: []
    }]
  };
  // estimated chart
  const EstimatedChart = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Total Estimated Revenue vs Total Historical Revenue',
    },
    xAxis: {
      categories: ['7 Days', '30 Days', '90 Days'],
    },
    exporting: {
      enabled: false,
    },
    series: [
      {
        name: 'Total Estimated Revenue',
        data: [],
        color: '#007ffa',
      },
      {
        name: 'Total Historical Revenue',
        data: [],
        color: '#202b35',
      },
    ],
  };
  // Checkout Chart
  const CheckoutChart = {
    chart: {
      type: 'area',
      height: '260px',
    },
    // chartHeight: '300px',
    title: {
      text: 'Total Sales(Inc. Refunds) Recurring vs Checkout',
    },
    xAxis: {
      allowDecimals: false,
      labels: {
        formatter: function () {
          return this.value; // clean, unformatted number for year
        },
      },
      accessibility: {
        rangeDescription: '',
      },
    },
    yAxis: {
      title: {
        text: 'Total Sales',
      },
      labels: {
        formatter: function () {
          return this.value / 1000 + 'k';
        },
      },
    },
    exporting: {
      enabled: false,
    },
    tooltip: {
      pointFormat:
        '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}',
    },
    plotOptions: {
      area: {
        // pointStart: 1940,
        marker: {
          enabled: false,
          symbol: 'circle',
          radius: 1,
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
        name: 'Recurring',
        data: [],
      },
      {
        name: 'Checkout',
        data: [],
      },
    ],
  };
  // Estimated Recurring Revenue Table
  const rows_Revenue = [
    ['Estimated Revenue', '7', '30', '90'],
    ['Queued Revenue', '$0', '$0', '$0'],
    ['Error Revenue', '$0', '$0', '$0'],
    ['Total Revenue', '$0', '$0', '$0'],
  ];
  //Estimated Recurring Charges Table
  const rows_Charges = [
    ['Estimated Revenue', '7', '30', '90'],
    ['Queued Charges', '$0', '$0', '$0'],
    ['Error Charges', '$0', '$0', '$0'],
    ['Total Charges', '$0', '$0', '$0'],
  ];
  /// Functionality
  const [cardData, setCardData] = useState({
    totalSales: { value: "0", up: true, percent: 0 },
    recurringSales: { value: "0", up: true, percent: 0 },
    mrr: { value: "0", up: true, percent: 0 },
    refunds: { value: "0", up: true, percent: 0 },
    averageCheckoutCharge: { value: "0", up: true, percent: 0 },
    averageRecurringCharge: { value: "0", up: true, percent: 0 },
    churnRate: { value: "0", up: true, percent: 0 },
    activeCustomers: { value: "0", up: true, percent: 0 },
    newCustomers: { value: "0", up: true, percent: 0 },
    newSubscriptions: { value: "0", up: true, percent: 0 },
    cancelledSubscriptions: { value: "0", up: true, percent: 0 },
    sameDayCancelled: { value: "0", up: true, percent: 0 },
    estimatedNinetyDays: "0",
    estimatedSevenDays: "0",
    estimatedThirtyDays: "0",
  })

  const [chartOptions, setChartOptions] = useState({
    subscriptionsChart: SubscriptionsChart,
    activeCustomerChart: CustomerChart,
    refundChart: RefundChart,
    saleChart: SaleChart,
    activeChurnedCustomerChart: Active_Churned_CustomerChart,
    estimatedChart: EstimatedChart,
    checkoutChart: CheckoutChart,

    skuRevenueChart: skuRevenue,
    skuSubscriptionsChart: skuSubscriptions,
    insightChart: insightChart
  })

  const [tableData, setTableData] = useState({
    revenueTable: rows_Revenue,
    chargesTable: rows_Charges
  })

  // const {loading,data, refetch}=useQuery(fetchReport,{
  //   variables:{granularity:filters.granularity,dataPeriodFor:filters.dataPeriodFor,dataByPeriod:filters.dataByPeriod}
  // })
  const [getReport, { loading, data }] = useLazyQuery(fetchReport);

  const getReportData = useCallback(() => {
    getReport({
      variables: {
        startDate: filters.startDate,
        endDate: filters.endDate,
      }
    })
  }, [filters, getReport])

  useEffect(() => {
    getReportData()
  }, [filters])

  useEffect(() => {

    if (data) {
      const {
        totalSales,
        recurringSales,
        salesPerCharge,
        mrr,
        refunds,
        averageCheckoutCharge,
        averageRecurringCharge,
        churnRate,
        activeCustomers,
        newCustomers,
        newSubscriptions,
        cancelledSubscriptions,
        sameDayCancelled,

        estimatedNinetyDays,
        estimatedSevenDays,
        estimatedThirtyDays,
        historicalNinetyDaysRevenue,
        historicalSevenDaysRevenue,
        historicalThirtyDaysRevenue,
        //charts Data
        newVsCancelledData,
        activeCustomersData,
        refundsData,
        totalSalesData,
        activeVsChurnedData,
        recurringVsCheckout,

        skuByRevenue,
        skuBySubscriptions,
        skuByCustomers,
        skuByFrequency,
        billingFrequencyRevenue,
        ////tablesData
        //Revenue table
        sevenDaysErrorRevenue,
        thirtyDaysErrorRevenue,
        ninetyDaysErrorRevenue,
        //Charges Table
        sevenDaysUpcomingCharge,
        thirtyDaysUpcomingCharge,
        ninetyDaysUpcomingCharge,
        sevenDaysErrorCharge,
        thirtyDaysErrorCharge,
        ninetyDaysErrorCharge
      } = data.fetchRevenueTrend;

      // //Setting charts for product page
      // setProductCharts({
      //   skuByRevenue,
      //   skuBySubscriptions,
      //   skuByCustomers,
      //   skuByFrequency,
      //   hasData:true
      // })

      //setting cards data ....
      setCardData({
        ...cardData,
        totalSales: totalSales,
        recurringSales: recurringSales,
        mrr: mrr,
        refunds: refunds,
        averageCheckoutCharge: averageCheckoutCharge,
        averageRecurringCharge: averageRecurringCharge,
        churnRate,
        activeCustomers,
        newCustomers,
        newSubscriptions,
        cancelledSubscriptions,
        sameDayCancelled,
        estimatedNinetyDays,
        estimatedSevenDays,
        estimatedThirtyDays
      })

      // setting chart Options

      const newvsCalcelledSubscription = {
        ...chartOptions.subscriptionsChart,
        xAxis: { categories: newVsCancelledData.map(data => data.date), },
        series: [
          {
            name: 'New Subscriptions',
            data: newVsCancelledData.map(data => parseInt(data.data.newSubscriptionsCount || 0)),
            color: '#007ffa',
          },
          {
            name: 'Cancellations',
            data: newVsCancelledData.map(data => -Math.abs(parseInt(data.data.cancelledSubscriptionsCount || 0))),
            color: '#202b35',
          },
        ]
      }

      const newActiveCustomers = {
        ...chartOptions.activeCustomerChart,
        xAxis: { categories: activeCustomersData.map(data => data.date), },
        series: [
          {
            name: '',
            data: activeCustomersData.map(data => parseInt(data.data.value || 0)),
            color: '#202b35',
          }
        ]
      }

      const newRefundsData = {
        ...chartOptions.refundChart,
        xAxis: { categories: refundsData.map(data => data.date), },
        series: [
          {
            name: 'Refund amount',
            type: 'column',
            yAxis: 1,
            data: refundsData.map(data => parseInt(data.data.value)),
            color: '#959595',
            fillOpacity: 0.4,
          },
          {
            name: 'Refund Count',
            type: 'spline',
            data: refundsData.map(data => parseInt(data.data.refundsCount)),
            color: '#202b35',
            fillOpacity: 0.4,
          },
        ]
      }

      const newSalesData = {
        ...chartOptions.saleChart,
        xAxis: { categories: totalSalesData.map(data => data.date), crosshair: true, angle: 90, },

        series: [
          {
            name: 'Charge Count',
            type: 'spline',
            yAxis: 1,
            data: totalSalesData.map(data => parseInt(data.data?.chargeCount || "0")),
            color: '#00a030',
          },
          {
            name: 'Subscriptions revenue',
            type: 'column',
            data: totalSalesData.map(data => parseInt(data.data.value)),
            color: '#007ffa',
          },
          // {
          //   name: 'Charge Count',
          //   type: 'column',
          //   yAxis: 1,
          //   data: totalSalesData.map(data=>parseInt(data.data?.chargeCount || "0")),
          //   color: '#007ffa',
          // },
          // {
          //   name: 'Total Sales',
          //   type: 'spline',
          //   data: totalSalesData.map(data=>parseInt(data.data.value)),
          //   color: '#00a030',
          // },
        ]
      }

      const newActiveVsChurnedData = {
        ...chartOptions.activeChurnedCustomerChart,
        xAxis: {
          ...chartOptions.activeChurnedCustomerChart.xAxis,
          categories: activeVsChurnedData.map(data => data.date)
        },
        series: [
          {
            name: 'Active Customers',
            data: activeVsChurnedData.map(data => parseInt(data.data.activeCustomers)),
          },
          {
            name: 'Churned Customers',
            data: activeVsChurnedData.map(data => parseInt(data.data.churnedCustomers)),
          },
        ]
      }

      const newEstimatedData = {
        ...chartOptions.estimatedChart,
        series: [
          {
            name: 'Total Estimated Revenue',
            data: [parseInt(estimatedSevenDays), parseInt(estimatedThirtyDays), parseInt(estimatedNinetyDays)],
            color: '#007ffa',
          },
          {
            name: 'Total Historical Revenue',
            data: [parseInt(historicalSevenDaysRevenue), parseInt(historicalThirtyDaysRevenue), parseInt(historicalNinetyDaysRevenue)],
            color: '#202b35',
          },
        ]
      }

      const newCheckoutChartData = {
        ...chartOptions.checkoutChart,
        xAxis: { ...chartOptions.checkoutChart.xAxis, categories: recurringVsCheckout.map(data => data.date) },
        series: [
          {
            name: 'Recurring',
            data: recurringVsCheckout.map(data => parseInt(data.data.recurringSales)),
          },
          {
            name: 'Checkout',
            data: recurringVsCheckout.map(data => parseInt(data.data.oneTimeSales)),
          },
        ]
      }
      const newSkuRevenue = {
        ...chartOptions.skuRevenueChart, xAxis: { categories: skuByRevenue.map(sku => sku.sku) || [] },
        series: [{
          type: 'column',
          colorByPoint: true,
          data: skuByRevenue.map(sku => parseInt(sku.value || 0)) || [],
          showInLegend: false
        }]
      }
      const newSkuSubscriptions = {
        ...chartOptions.skuSubscriptionsChart, xAxis: { categories: skuBySubscriptions.map(sku => sku.sku) || [] },
        series: [{
          type: 'column',
          colorByPoint: true,
          data: skuBySubscriptions.map(sku => parseInt(sku.value || 0)) || [],
          showInLegend: false
        }]
      }
      const insightChartOptions = {
        ...chartOptions.insightsChart, series: [{
          type: 'pie', innerSize: '50%', showInLegend: true, data: billingFrequencyRevenue.map(f => [f.billingPolicy, parseFloat(f.value) || 0])
        }]
      }
      //// set New Chart Options
      setChartOptions({
        ...chartOptions,
        subscriptionsChart: newvsCalcelledSubscription,
        activeCustomerChart: newActiveCustomers,
        refundChart: newRefundsData,
        saleChart: newSalesData,
        activeChurnedCustomerChart: newActiveVsChurnedData,
        estimatedChart: newEstimatedData,
        checkoutChart: newCheckoutChartData,
        skuRevenueChart: newSkuRevenue,
        skuSubscriptionsChart: newSkuSubscriptions,
        insightChart: insightChartOptions
      });
      // tables Data
      const newRevenueTable = [
        ['Estimated Revenue', '7', '30', '90'],
        ['Queued Revenue', estimatedSevenDays, estimatedThirtyDays, estimatedNinetyDays],
        ['Error Revenue', sevenDaysErrorRevenue, thirtyDaysErrorRevenue, ninetyDaysErrorRevenue],
        ['Total Revenue', parseInt(estimatedSevenDays) + parseInt(sevenDaysErrorRevenue),
          parseInt(estimatedThirtyDays) + parseInt(thirtyDaysErrorRevenue),
          parseInt(estimatedNinetyDays) + parseInt(ninetyDaysErrorRevenue)],
      ]
      const newChargesTable = [
        ['Estimated Revenue', '7', '30', '90'],
        ['Queued Charges', sevenDaysUpcomingCharge, thirtyDaysUpcomingCharge, ninetyDaysUpcomingCharge],
        ['Error Charges', sevenDaysErrorCharge, thirtyDaysErrorCharge, ninetyDaysErrorCharge],
        ['Total Charges', parseInt(sevenDaysUpcomingCharge) + parseInt(sevenDaysErrorCharge),
          parseInt(thirtyDaysUpcomingCharge) + parseInt(thirtyDaysErrorCharge),
          parseInt(ninetyDaysUpcomingCharge) + parseInt(ninetyDaysErrorCharge)],
      ]

      setTableData({ ...tableData, revenueTable: newRevenueTable, chargesTable: newChargesTable })

    }
  }, [data])


  const options_1 = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 days', value: 'lastWeek' },
  ];

  const sectionRevenueList = [
    { section: 'Total Sales', percent: '24', up: true, key: "totalSales", prefix: "$" },
    {
      section: 'Recurring Sales',
      percent: '1',
      up: false,
      key: "recurringSales",
      suffix: "%"
    },
    { section: 'MRR', percent: '2', up: true, key: "mrr", prefix: "$" },
    { section: 'Total Refunds', percent: '2', up: false, key: "refunds", prefix: "$" },
  ];

  const sectionSummaryList = [
    {
      section: 'Total MRR',
      percent: '24',
      up: true,
      amount: '$47,433',
      amount_change: '$11,386',
    },
    {
      section: 'Active Paid Subscriber',
      percent: '1',
      up: false,
      amount: '8370',
      amount_change: '83',
    },
    {
      section: 'Av. Revenue/customer',
      percent: '2',
      up: true,
      amount: '$50.12',
      amount_change: '$1',
    },
    {
      section: 'Net Dollar Expansion',
      percent: '2',
      up: false,
      amount: '$50.12',
      amount_change: '$1',
    },
  ];
  const sectionMonth2DateList = [
    {
      section: 'New MRR',
      percent: '24',
      up: true,
      amount: '$47,433',
      amount_change: '$11,386',
    },
    {
      section: 'Gross MRR Churn',
      percent: '1',
      up: false,
      amount: '$11,680',
      amount_change: '$5,750',
    },
    {
      section: 'Net MRR Growth',
      percent: '2',
      up: true,
      amount: '$136,910',
      amount_change: '$1,710',
    },
    {
      section: 'Net MRR Churn Rate',
      percent: '9.22',
      up: false,
      amount: '0.02%',
      amount_change: '0.00',
    },
  ];
  const sectionAvgList = [
    {
      section: 'Avg. Checkout Charge',
      percent: '24',
      up: true,
      key: "averageCheckoutCharge"
    },
    {
      section: 'Avg. Recurring Charge',
      percent: '24',
      up: true,
      key: 'averageRecurringCharge',
    },
  ];
  const sectionActiveCustomerList = [
    {
      section: 'Churn Rate',
      percent: '4',
      up: true,
      key: 'churnRate',
      type: "percent"
    },
    {
      section: 'New Customers',
      percent: '17',
      up: true,
      key: 'newCustomers',
    },
    {
      section: 'Active Customers',
      percent: '5',
      up: true,
      key: 'activeCustomers',
    },
  ];
  const sectionSubscriptionList = [
    {
      section: 'New Subs',
      percent: '4',
      up: true,
      key: 'newSubscriptions',
      type: "currency"
    },
    {
      section: 'New Cancel',
      percent: '17',
      up: true,
      key: 'cancelledSubscriptions',
    },
    {
      section: 'Same Day Cancel',
      percent: '5',
      up: true,
      key: 'sameDayCancelled',
    },
  ];
  const sectionFutureRevenuePlanningList = [
    {
      section: 'Est. Revenue',
      percent: '7',
      up: true,
      key: 'estimatedSevenDays',
    },
    {
      section: 'Est. Revenue',
      percent: '30',
      up: true,
      key: 'estimatedThirtyDays',
    },
    {
      section: 'Est. Revenue',
      percent: '90',
      up: true,
      key: 'estimatedNinetyDays',
    },
  ];

  //Sale Chart
  let categories = [
    '2020-10-11',
    '2020-10-12',
    '2020-10-13',
    '2020-10-14',
    '2020-10-15',
    '2020-10-16',
    '2020-10-17',
    '2020-10-18',
    '2020-10-19',
    '2020-10-20',
    '2020-10-21',
    '2020-10-22',
    '2020-10-23',
    '2020-10-24',
    '2020-10-25',
    '2020-10-26',
    '2020-10-27',
    '2020-10-28',
    '2020-10-29',
    '2020-10-30',
    '2020-10-31',
    '2020-11-11',
    '2020-11-12',
    '2020-11-13',
    '2020-11-14',
    '2020-11-15',
  ];

  return (
    <>
      {loading ? (
        <Card>
          <LoadingScreen />
        </Card>
      ) :
        <FormLayout>
          <Stack vertical spacing="extraLoose">
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
                        handleForceUpdates={handleForceUpdates}
                      />

                    </div>

                  </Card.Section>
                </Card>
              </Layout.Section>
            </Layout>

            <Layout>
              <Layout.Section>
                <DisplayText size="medium">Revenue</DisplayText>

                <Stack distribution="fill" wrap={false}>
                  {sectionRevenueList?.map((item, i) => (
                    <Stack.Item key={i}>
                      <Card sectioned>
                        <Stack>
                          <Stack.Item fill>
                            <TextStyle variation="strong">
                              {item.section}
                            </TextStyle>
                          </Stack.Item>
                          <Stack.Item>
                            <TextStyle
                              variation={cardData[item.key]?.up ? 'positive' : 'negative'}
                            >
                              <Icon
                                source={cardData[item.key]?.up ? CaretUpMinor : CaretDownMinor}
                                color={cardData[item.key]?.up ? 'green' : 'red'}
                              />
                              {Math.abs(cardData[item.key]?.percent) || 0}%
                            </TextStyle>
                          </Stack.Item>
                        </Stack>

                        <Stack>
                          <Stack.Item>
                            <DisplayText size="medium">
                              <TextStyle variation="strong">
                                <CounterUp prefix={item.prefix || ''} suffix={item.suffix || ''} start={0} end={Number.parseFloat(cardData[item.key]?.value || 0).toFixed(2)} duration={1.5} decimals={2} />
                              </TextStyle>
                            </DisplayText>
                          </Stack.Item>
                        </Stack>
                      </Card>
                    </Stack.Item>
                  ))}
                </Stack>
              </Layout.Section>
            </Layout>
            {/* <Layout>
            <Layout.Section>
              <DisplayText size="medium">Summary</DisplayText>

              <Stack distribution="fill">
                {sectionSummaryList?.map((item, i) => (
                  <Stack.Item key={i}>
                    <Card sectioned>
                      <Stack distribution="equalSpacing" spacing="extraTight">
                        <Stack.Item>
                          <TextStyle variation="strong">
                            {item.section}
                          </TextStyle>
                        </Stack.Item>

                        <Stack.Item>
                          <TextStyle
                            variation={item.up ? 'positive' : 'negative'}
                          >
                            <Icon
                              source={item.up ? CaretUpMinor : CaretDownMinor}
                              color={item.up ? 'green' : 'red'}
                            />
                            {item.percent}%
                          </TextStyle>
                        </Stack.Item>
                      </Stack>

                      <Stack>
                        <Stack.Item>
                          <DisplayText size="medium">
                            <TextStyle variation="strong">
                              {item.amount}
                            </TextStyle>
                          </DisplayText>
                          <TextStyle
                            variation={item.up ? 'positive' : 'negative'}
                          >
                            <Icon
                              source={item.up ? CaretUpMinor : CaretDownMinor}
                              color={item.up ? 'green' : 'red'}
                            />
                            {item.amount_change}
                          </TextStyle>
                        </Stack.Item>
                      </Stack>
                    </Card>
                  </Stack.Item>
                ))}
              </Stack>
            </Layout.Section>
          </Layout> */}
            {/* <Layout>
            <Layout.Section>
              <TextStyle variation="strong">
                Metrics indicate changes of this month vs last month, on a
                month-to-date basis
              </TextStyle>
              <Stack distribution="fill" wrap={false}>
                {sectionMonth2DateList?.map((item, i) => (
                  <Stack.Item key={i}>
                    <Card sectioned>
                      <Stack distribution="equalSpacing" spacing="extraTight">
                        <Stack.Item>
                          <TextStyle variation="strong">
                            {item.section}
                          </TextStyle>
                        </Stack.Item>

                        <Stack.Item>
                          <TextStyle
                            variation={item.up ? 'positive' : 'negative'}
                          >
                            <Icon
                              source={item.up ? CaretUpMinor : CaretDownMinor}
                              color={item.up ? 'green' : 'red'}
                            />
                            {item.percent}%
                          </TextStyle>
                        </Stack.Item>
                      </Stack>

                      <Stack>
                        <Stack.Item>
                          <DisplayText size="medium">
                            <TextStyle variation="strong">
                              {item.amount}
                            </TextStyle>
                          </DisplayText>
                          <TextStyle
                            variation={item.up ? 'positive' : 'negative'}
                          >
                            <Icon
                              source={item.up ? CaretUpMinor : CaretDownMinor}
                              color={item.up ? 'green' : 'red'}
                            />
                            {item.amount_change}
                          </TextStyle>
                        </Stack.Item>
                      </Stack>
                    </Card>
                  </Stack.Item>
                ))}
              </Stack>
            </Layout.Section>
          </Layout> */}
            <Layout>
              <Layout.Section>
                <Heading>{'  '}</Heading>
                <HighchartsReact highcharts={Highcharts} options={chartOptions.saleChart} />
              </Layout.Section>
            </Layout>

            <Layout>
              <div className="sales-section">
                <Layout.Section secondary>
                  <Stack vertical distribution="equalSpacing">
                    {sectionAvgList?.map((item, i) => (
                      <Stack.Item key={i}>
                        <Card sectioned>
                          <Stack distribution="equalSpacing" spacing="extraTight">
                            <Stack.Item>
                              <TextStyle variation="strong">
                                {item.section}
                              </TextStyle>
                            </Stack.Item>
                            <Stack.Item>
                              <TextStyle
                                variation={cardData[item.key]?.up ? 'positive' : 'negative'}
                              >
                                <Icon
                                  source={cardData[item.key]?.up ? CaretUpMinor : CaretDownMinor}
                                  color={cardData[item.key]?.up ? 'green' : 'red'}
                                />
                                {Math.abs(cardData[item.key]?.percent) || 0}%
                              </TextStyle>
                            </Stack.Item>
                          </Stack>
                          <Stack>
                            <Stack.Item>
                              <DisplayText size="medium">
                                <TextStyle variation="strong">
                                  <CounterUp prefix="$" start={0} end={Number.parseFloat(cardData[item.key]?.value || 0).toFixed(2)} duration={1.5} decimals={2} />
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
              <Layout.Section>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={chartOptions.checkoutChart}
                />
              </Layout.Section>
            </Layout>
            <Layout>
              <Layout.Section>
                <Heading>{'  '}</Heading>
                <HighchartsReact highcharts={Highcharts} options={chartOptions.skuRevenueChart} />
              </Layout.Section>
            </Layout>
            <Layout>
              <Layout.Section>
                <Heading>{'  '}</Heading>
                <HighchartsReact highcharts={Highcharts} options={chartOptions.skuSubscriptionsChart} />
              </Layout.Section>
            </Layout>
            <Layout>
              <Layout.Section>
                {/* <div className="frequency-graph-revenue"> */}
                <Card>
                  <Card.Section>
                    {/* <div className="frequency-graph-parameters">
                  <div className="weeks">
                    <div className="cancel-color"></div>
                    <p>1 week</p>
                  </div>
                  <div className="weeks">
                    <div className="dunning-color">
                    </div>
                    <p>12 Weeks</p>
                  </div>
                  <div className="weeks">
                    <div className=" active-color">
                    </div>
                    <p>4 weeks</p>
                  </div>

                </div> */}
                    <Heading>{'  '}</Heading>
                    <HighchartsReact highcharts={Highcharts} options={chartOptions.insightChart} />
                  </Card.Section>
                </Card>
                {/* </div> */}
              </Layout.Section>
            </Layout>
            <Layout>
              <Layout.Section>

                <Heading>{'  '}</Heading>

                <HighchartsReact highcharts={Highcharts} options={chartOptions.refundChart} />


              </Layout.Section>
            </Layout>

            <Layout>
              <Layout.Section>
                <DisplayText size="medium">Customers</DisplayText>
              </Layout.Section>
            </Layout>
            <Layout>
              <Layout.Section secondary>
                <Stack vertical distribution="equalSpacing">
                  {sectionActiveCustomerList?.map((item, i) => (
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
                              variation={cardData[item.key]?.up ? 'positive' : 'negative'}
                            >
                              <Icon
                                source={cardData[item.key]?.up ? CaretUpMinor : CaretDownMinor}
                                color={cardData[item.key]?.up ? 'green' : 'red'}
                              />
                              {Math.abs(cardData[item.key]?.percent) || 0}%
                            </TextStyle>
                          </Stack.Item>
                        </Stack>
                        <Stack>
                          <Stack.Item>
                            <DisplayText size="medium">
                              <TextStyle variation="strong">
                                <CounterUp prefix={item.type == "currency" ? "$" : ""} suffix={item.type == "percent" ? "%" : ""} start={0} end={Number.parseFloat(cardData[item.key]?.value || 0).toFixed(2)} duration={1.5} decimals={item.type == "currency" ? 2 : 0} />
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
                <HighchartsReact
                  highcharts={Highcharts}
                  options={chartOptions.activeCustomerChart}
                />
              </Layout.Section>
            </Layout>
            <Layout>
              <Layout.Section>
                <Heading>{'  '}</Heading>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={chartOptions.activeChurnedCustomerChart}
                />
              </Layout.Section>
            </Layout>
            <Stack.Item>
              <Layout>
                <Layout.Section>
                  <DisplayText size="medium">Revenue Forecast</DisplayText>
                </Layout.Section>
              </Layout>
              <br />
              <Layout>
                <Layout.Section secondary>
                  <Stack vertical distribution="equalSpacing">
                    {sectionSubscriptionList?.map((item, i) => (
                      <Stack.Item key={i}>
                        <Card sectioned>
                          <Stack distribution="equalSpacing">
                            <Stack.Item>
                              <TextStyle variation="strong">
                                {item.section}
                              </TextStyle>
                            </Stack.Item>
                            <Stack.Item>
                              <TextStyle
                                variation={cardData[item.key]?.up ? 'positive' : 'negative'}
                              >
                                <Icon
                                  source={cardData[item.key]?.up ? CaretUpMinor : CaretDownMinor}
                                  color={cardData[item.key]?.up ? 'green' : 'red'}
                                />
                                {Math.abs(cardData[item.key]?.percent) || 0}%
                              </TextStyle>
                            </Stack.Item>
                          </Stack>
                          <Stack>
                            <Stack.Item>
                              <DisplayText size="medium">
                                <TextStyle variation="strong">
                                  <CounterUp start={0} end={Number.parseFloat(cardData[item.key]?.value || 0.0).toFixed(2)} duration={1.5} />
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
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions.subscriptionsChart}
                  />
                </Layout.Section>
              </Layout>
            </Stack.Item>
            {/* <Layout>
            <DisplayText size="medium">Total Sales (Inc. Refunds)</DisplayText>
            <Layout.Section>
              <HighchartsReact highcharts={Highcharts} options={RefundChart} />
            </Layout.Section>
          </Layout> */}
            <Stack.Item>
              <Layout>
                <Layout.Section>
                  <DisplayText size="medium">Future Revenue Planning</DisplayText>
                  <br />
                  <Heading>
                    This section will not be controlled by the filters
                  </Heading>
                  <br />
                </Layout.Section>
              </Layout>
              <Layout>
                <Layout.Section secondary>
                  <Stack vertical distribution="fill">
                    {sectionFutureRevenuePlanningList?.map((item, i) => (
                      <Stack.Item key={i}>
                        <Card sectioned>
                          <Stack distribution="equalSpacing">
                            <Stack.Item>
                              <TextStyle variation="strong">
                                {item.section}
                              </TextStyle>
                            </Stack.Item>
                            <Stack.Item>
                              <TextStyle
                                variation={item.up ? 'positive' : 'negative'}
                              >
                                {item.percent} days
                              </TextStyle>
                            </Stack.Item>
                          </Stack>
                          <Stack>
                            <Stack.Item>
                              <DisplayText size="medium">
                                <TextStyle variation="strong">
                                  <CounterUp prefix="$" start={0} end={Number.parseFloat(cardData[item.key] || 0.0).toFixed(2)} duration={1.5} decimals={2} />
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
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions.estimatedChart}
                  />
                </Layout.Section>
              </Layout>
            </Stack.Item>
            <Layout>
              <div className="data-tabels">
                <Layout.Section>
                  <Stack distribution="equalSpacing">
                    <Card title="Estimated Recurring Revenue Table">
                      <DataTable
                        showTotalsInFooter
                        columnContentTypes={['text', 'text', 'text', 'text']}
                        headings={[' ', ' ', ' ', ' ']}
                        rows={tableData.revenueTable}
                      />
                    </Card>
                    <Card title="Estimated Recurring Charges Table">
                      <DataTable
                        showTotalsInFooter
                        columnContentTypes={['text', 'text', 'text', 'text']}
                        headings={[' ', ' ', ' ', ' ']}
                        rows={tableData.chargesTable}
                      />
                    </Card>
                  </Stack>
                </Layout.Section>
              </div>
            </Layout>
          </Stack>
        </FormLayout>
      }
    </>
  );
};
export default RevenueTrends;
