import React, { useState, useEffect, useCallback, useRef,useContext } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FilterContext } from './../common/Contexts/AnalyticsFilterContext';
import { gql, useLazyQuery } from '@apollo/client';
import {
  Card,
  FormLayout,
  Layout,
  Stack,
  DisplayText,
  TextStyle,
  Heading,
  Select,
  DataTable,
  TextContainer,
} from '@shopify/polaris';
import { isEmpty } from 'lodash';

const CustomerInsights = () => {

  // const fetchReport = gql`
  // query($startDate: String!, $endDate: String!) {  
  //   fetchCustomerInsights(startDate: $startDate, endDate: $endDate) {
  //     skuByCustomers {
  //         sku
  //         value
  //     }
  //   }
  //   fetchRevenueTrend(startDate: $startDate, endDate: $endDate) {
  //     skuBySubscriptions {
  //         sku
  //         value
  //     }
  //     skuByRevenue {
  //         sku
  //         value
  //     }
  //     skuByFrequency {
  //         billingPolicy
  //         skus {
  //             sku
  //             value
  //         }
  //     }
  //   }
  // }
  //   `;

  const skuRevenue = {
    colors: ["#0D91AE", "#6B97C5", "#FFF500", "#FFCC00", "#E77320", "#FF0000", "#FF5C00", "#979797", "#007EFF", "#00A023", "#8000A0", "#A0007D", "#F4EC19"],
    title: {
      text: 'Top 14 SKUs by Recurring Revenue (Subscriptions)'
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
    colors: ["#0D91AE", "#6B97C5", "#FFF500", "#FFCC00", "#E77320", "#FF0000", "#FF5C00", "#979797", "#007EFF", "#00A023", "#8000A0", "#A0007D", "#F4EC19"],
    title: {
      text: 'Top 14 SKUs by Subscriptions'
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
  const skuCustomersChart = {
    colors: ["#0D91AE", "#6B97C5", "#FFF500", "#FFCC00", "#E77320", "#FF0000", "#FF5C00", "#979797", "#007EFF", "#00A023", "#8000A0", "#A0007D", "#F4EC19"],
    title: {
      text: 'Top SKUs by Customer Count'
    },
    xAxis: {
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
      },
    },
    series: [{
      type: 'column',
      colorByPoint: true,
      data: [],
      showInLegend: false
    }]
  }
  //chart
  const PercentVerticalChart = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      height: '400px',
      // width: '720px',
    },
    title: {
      text: '',
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
        innerSize: '50%',
        data: [
          ['60%', 60],
          ['18%', 18],
          ['19%', 19],
          ['2%', 2],
        ],
      },
    ],
  };

  const [filters,setFilters,productCharts]=useContext(FilterContext)
  const [chartOptions,setChartOptions]=useState({
    skuRevenueChart:skuRevenue,
    skuCustomersChart:skuCustomersChart,
    skuSubscriptionsChart:skuSubscriptions,
    insightsChart:PercentVerticalChart
  })

  const [insightsData,setInsightsData]=useState({})
  useEffect(()=>{
    const {insightsChart}=chartOptions;
    if(!isEmpty(insightsData)){
      const selectedData=insightsData.find(data=>data.billingPolicy===selectedInsight);
      const insightChartOptions = {
        ...insightsChart, series: [{
          type: 'pie', innerSize: '50%', showInLegend: true, data:selectedData.skus.map(f=>[f.sku,parseInt(f.value) || 0])}]
      }
      setChartOptions({...chartOptions,insightsChart:insightChartOptions})
    }
  },[insightsData])
  const [selectedInsight, setSelectedInsight] = useState('1 Day');
  const handleSelectChange = useCallback((value) => setSelectedInsight(value), []);
  const insightsOptions = [
    {label: '1 Day', value: '1 Day'},
    {label: '1 Month', value: '1 Month'}
  ];

  // const [getReport, { loading, data:reportData }] = useLazyQuery(fetchReport);

  // const getReportData = useCallback(() => {
  //   getReport({
  //     variables:{
  //       startDate:filters.startDate,
  //       endDate:filters.endDate
  //     }
  //   })
  // }, [filters,getReport])

  // useEffect(() => {
  //   getReportData()
  // }, [filters])

  useEffect(()=>{
    if(!isEmpty(productCharts)){
      const {
        skuByFrequency,
        skuByRevenue,
        skuBySubscriptions,
        skuByCustomers
      }=productCharts;
      
      setInsightsData(skuByFrequency)

      //Charts Data
      const { insightsChart, skuCustomersChart, skuRevenueChart, skuSubscriptionsChart } = chartOptions;
      
      const newSkuRevenue = {
        ...chartOptions.skuRevenueChart, xAxis: { categories: skuByRevenue.map(sku => sku.sku) || [] },
        series: [{
          type: 'column',
          colorByPoint: true,
          data: skuByRevenue.map(sku => parseInt(sku.value || 0)) || [],
          showInLegend: false
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

      const newSkuSubscriptions = {
        ...chartOptions.skuSubscriptionsChart, xAxis: { categories: skuBySubscriptions.map(sku => sku.sku) || [] },
        series: [{
          type: 'column',
          colorByPoint: true,
          data: skuBySubscriptions.map(sku => parseInt(sku.value || 0)) || [],
          showInLegend: false
        }]
      }

      setChartOptions({
        ...chartOptions,
        // insightsChart:insightChartOptions,
        skuCustomersChart:newSkuCustomersChart,
        skuRevenueChart:newSkuRevenue,
        skuSubscriptionsChart:newSkuSubscriptions
      })

    }

  },[productCharts])

  return (
    <FormLayout>
      <Stack vertical spacing="extraLoose">
        <Layout>
          <Layout.Section>
            <Heading>{'  '}</Heading>
            <HighchartsReact highcharts={Highcharts} options={chartOptions.skuRevenueChart} />
          </Layout.Section>
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
            <Heading>{'  '}</Heading>
            <HighchartsReact highcharts={Highcharts} options={chartOptions.skuSubscriptionsChart} />
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section>
            <Card>
              <Select
                options={insightsOptions}
                onChange={handleSelectChange}
                value={selectedInsight}
              />
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions.insightsChart}
              />
            </Card>
          </Layout.Section>
        </Layout>
      </Stack>
    </FormLayout>
  );
};

export default CustomerInsights;
