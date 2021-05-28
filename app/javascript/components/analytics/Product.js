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
  Spinner
} from '@shopify/polaris';
import { isEmpty } from 'lodash';
import DateRangePicker from '../common/DatePicker/DateRangePicker';

const CustomerInsights = () => {

  ///Graph Query...
  const fetchReport = gql`
  query($startDate: String!, $endDate: String!) {  
    fetchRevenueTrend(startDate: $startDate, endDate: $endDate) {
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
    }
}
  `;

  const skuRevenue = {
    colors: ["#0D91AE", "#6B97C5", "#FFF500", "#FFCC00", "#E77320", "#FF0000", "#FF5C00", "#979797", "#007EFF", "#00A023", "#8000A0", "#A0007D", "#F4EC19"],
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
    colors: ["#0D91AE", "#6B97C5", "#FFF500", "#FFCC00", "#E77320", "#FF0000", "#FF5C00", "#979797", "#007EFF", "#00A023", "#8000A0", "#A0007D", "#F4EC19"],
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
  const skuCustomersChart = {
    colors: ["#0D91AE", "#6B97C5", "#FFF500", "#FFCC00", "#E77320", "#FF0000", "#FF5C00", "#979797", "#007EFF", "#00A023", "#8000A0", "#A0007D", "#F4EC19"],
    title: {
      text: 'Top SKUs by Customer Count'
    },
    tooltip: {
      pointFormat: '<b>{point.y}</b>',
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
        innerSize: '50%',
        data: [],
      },
    ],
  };

  const [filters,setFilters,productCharts,setProductCharts]=useContext(FilterContext)
  const handleFiltersDates=(dates)=>{
    if(!isEmpty(dates)){
      const {start,end}=dates;
      setFilters({startDate:dayjs(start).format("YYYY-MM-DD"),endDate:dayjs(end).format("YYYY-MM-DD")});
      console.log("product Charts")
      setProductCharts({hasData:false});
    }
  }
  const [getReport, { loading, data }] = useLazyQuery(fetchReport);

  const getReportData = useCallback(() => {
    getReport({
      variables:{
        startDate:filters.startDate,
        endDate:filters.endDate
      }
    })
  }, [filters, getReport])

  useEffect(()=>{
    console.log(productCharts,"Changed---")
  },[productCharts])
  useEffect(() => {
    if(!productCharts.hasData){
      getReportData()
    }
  }, [filters,productCharts])

  const [chartOptions,setChartOptions]=useState({
    skuRevenueChart:skuRevenue,
    skuCustomersChart:skuCustomersChart,
    skuSubscriptionsChart:skuSubscriptions,
    insightsChart:PercentVerticalChart
  })

 const [insightsOptions,setInsightOptions] = useState([])
  const [insightsData,setInsightsData]=useState({})
  const [selectedInsight, setSelectedInsight] = useState(productCharts.hasData ? productCharts?.skuByFrequency[0]?.billingPolicy : '');
  const handleSelectChange = (value) => setSelectedInsight(value);
 
  useEffect(()=>{
    const {insightsChart}=chartOptions;
    if(!isEmpty(insightsData)){
      // billingPolicy
      const insightOptions=insightsData.map(data=>({label:data.billingPolicy,value:data.billingPolicy}))
      setInsightOptions(insightOptions);
      const selectedData=insightsData.find(data=>data.billingPolicy===selectedInsight);
      const insightChartOptions = {
        ...insightsChart, series: [{
          type: 'pie', innerSize: '50%', showInLegend: true, data:selectedData.skus.map(f=>[f.sku,parseFloat(f.value) || 0])}]
      }
      setChartOptions({...chartOptions,insightsChart:insightChartOptions})
    }
  },[insightsData,selectedInsight])

  useEffect(()=>{
    if(productCharts.hasData){
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

  useEffect(()=>{
    if(!isEmpty(data?.fetchRevenueTrend)){
      const {
        skuByFrequency,
        skuByRevenue,
        skuBySubscriptions,
        skuByCustomers
      }=data.fetchRevenueTrend;
    
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
  },[data])

  return (
    <>
    {!productCharts.hasData && isEmpty(data) ? (
        <Card>
          <Spinner
            accessibilityLabel="Spinner example"
            size="large"
            color="teal"
          />
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
                      handleDates={handleFiltersDates}
                    />
                    </div>
                  
                </Card.Section>
              </Card>
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
              <div className="insight-chart-select">
              <Select
                options={insightsOptions}
                onChange={handleSelectChange}
                value={selectedInsight}
              />
              </div>
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions.insightsChart}
              />
            </Card>
          </Layout.Section>
        </Layout>
      </Stack>
    </FormLayout>
  }
  </>
  );
};

export default CustomerInsights;
