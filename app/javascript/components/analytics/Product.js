import React, { useState, useEffect, useCallback, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {
  Card,
  FormLayout,
  Layout,
  Stack,
  DisplayText,
  TextStyle,
  Heading,
  DataTable,
  TextContainer,
} from '@shopify/polaris';

const CustomerInsights = () => {
  const categories = [
    'January ‘21',
    'February ‘21',
    'March ‘21',
    'April ‘21',
    'May ‘21',
    'June ‘21',
    'July ‘21',
    'August ‘21',
    'September ‘21',
    'October ‘21',
    'November ‘21',
    'December ‘21',
    'January ‘22',
    'February ‘22',
  ];
  const GrossChart = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Top 15 SKUs by Gross Sales',
    },
    xAxis: {
      categories: categories,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Gross Sales',
      },
    },
    // legend: {
    //   align: 'center',
    //   alignColumns: true,
    //   verticalAlign: 'bottom',
    //   shadow: false,
    //   squareSymbol: true,
    //   symbolRadius: 0,
    // },
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
        // name: 'Active Customers',
        data: [
          90000,
          90000,
          100000,
          80000,
          60000,
          90000,
          100000,
          80000,
          60000,
          0,
          0,
          0,
          0,
          0,
        ],
      },
      {
        // name: 'Churned Customers',
        data: [
          60000,
          90000,
          100000,
          80000,
          50000,
          90000,
          100000,
          80000,
          60000,
          0,
          0,
          0,
          0,
          0,
        ],
      },
      {
        // name: 'Churned Customers',
        data: [
          70000,
          90000,
          100000,
          80000,
          60000,
          90000,
          100000,
          80000,
          60000,
          0,
          0,
          0,
          0,
          0,
        ],
      },
    ],
  };
  const NumberChart = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Top 15 SKUs by Gross Sales',
    },
    xAxis: {
      categories: categories,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Gross Sales',
      },
    },
    legend: {
      align: 'center',
      alignColumns: true,
      verticalAlign: 'bottom',
      shadow: false,
      squareSymbol: true,
      symbolRadius: 0,
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
        name: 'Active',
        data: [
          90000,
          90000,
          100000,
          80000,
          60000,
          90000,
          100000,
          80000,
          60000,
          0,
          0,
          0,
          0,
          0,
        ],
      },
      {
        name: 'Cancelled',
        data: [
          60000,
          90000,
          100000,
          80000,
          50000,
          90000,
          100000,
          80000,
          60000,
          0,
          0,
          0,
          0,
          0,
        ],
      },
    ],
  };
  // SKU details
  const rows_SKU = [
    ['1', '$21,609', '2,069', '21,609', '$21,609', '69', '2,069', '54%'],
    ['2', '$21,609', '2,069', '21,609', '$21,609', '69', '2,069', '54%'],
    ['3', '$21,609', '2,069', '21,609', '$21,609', '69', '2,069', '54%'],
    ['4', '$21,609', '2,069', '21,609', '$21,609', '69', '2,069', '54%'],
    ['5', '$21,609', '2,069', '21,609', '$21,609', '69', '2,069', '54%'],
    ['6', '$21,609', '2,069', '21,609', '$21,609', '69', '2,069', '54%'],
    ['7', '$21,609', '2,069', '21,609', '$21,609', '69', '2,069', '54%'],
    ['8', '$21,609', '2,069', '21,609', '$21,609', '69', '2,069', '54%'],
    ['9', '$21,609', '2,069', '21,609', '$21,609', '69', '2,069', '54%'],
    ['10', '$21,609', '2,069', '21,609', '$21,609', '69', '2,069', '54%'],
    ['11', '$21,609', '2,069', '21,609', '$21,609', '69', '2,069', '54%'],
    ['12', '$21,609', '2,069', '21,609', '$21,609', '69', '2,069', '54%'],
    ['13', '$21,609', '2,069', '21,609', '$21,609', '69', '2,069', '54%'],
    ['14', '$21,609', '2,069', '21,609', '$21,609', '69', '2,069', '54%'],
    ['15', '$21,609', '2,069', '21,609', '$21,609', '69', '2,069', '54%'],
    ['16', '$21,609', '2,069', '21,609', '$21,609', '69', '2,069', '54%'],
  ];
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
      text: '2021-02-09',
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
  return (
    <FormLayout>
      <Stack vertical spacing="extraLoose">
        <Layout>
          <Layout.Section>
            <DisplayText size="medium">MRR Retention Cohort</DisplayText>
            <br />
            <Card>
              <HighchartsReact highcharts={Highcharts} options={GrossChart} />
            </Card>
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section>
            <Card>
              <HighchartsReact highcharts={Highcharts} options={NumberChart} />
            </Card>
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section>
            <Card>
              <HighchartsReact
                highcharts={Highcharts}
                options={PercentVerticalChart}
              />
            </Card>
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section>
            <DisplayText size="medium">SKU Details</DisplayText>
            <br />
            <Card>
              <DataTable
                columnContentTypes={[
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                ]}
                headings={[
                  '',
                  'Gross Sales',
                  'Quantity Sold',
                  'Charges',
                  'Refunded Amt',
                  'Refunded Qty',
                  'Customers with...',
                  'Recurring Sales %',
                ]}
                rows={rows_SKU}
                hideScrollIndicator={true}
              />
            </Card>
          </Layout.Section>
        </Layout>
      </Stack>
    </FormLayout>
  );
};

export default CustomerInsights;
