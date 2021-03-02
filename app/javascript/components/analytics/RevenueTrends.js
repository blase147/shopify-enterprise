import React, { useState, useEffect, useCallback, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
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
} from '@shopify/polaris';
import {
  DropdownMinor,
  CaretUpMinor,
  CaretDownMinor,
} from '@shopify/polaris-icons';

const RevenueTrends = () => {
  const [expandedFilter, setExpandedFilter] = useState(false);

  const [selected_1, setSelected_1] = useState('today');
  const handleSelectChange_1 = useCallback((value) => setSelected_1(value), []);

  const options_1 = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 days', value: 'lastWeek' },
  ];

  const sectionRevenueList = [
    { section: 'Total Sales', percent: '24', up: true, amount: '$47,433' },
    {
      section: 'Recurring Sales',
      percent: '1',
      up: false,
      amount: '67%',
    },
    { section: 'Sales Per Charge', percent: '2', up: true, amount: '$50.12' },
    { section: 'Total Refunds', percent: '2', up: false, amount: '$50.12' },
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
      amount: '$55.00',
    },
    {
      section: 'Avg. Recurring Charge',
      percent: '24',
      up: true,
      amount: '$11,680',
    },
  ];
  const sectionActiveCustomerList = [
    {
      section: 'Churn Rate',
      percent: '4',
      up: true,
      amount: '$55.00',
    },
    {
      section: 'New Customers',
      percent: '17',
      up: true,
      amount: '300',
    },
    {
      section: 'Active Customers',
      percent: '5',
      up: true,
      amount: '500',
    },
  ];
  const sectionSubscriptionList = [
    {
      section: 'New Subs',
      percent: '4',
      up: true,
      amount: '$55.00',
    },
    {
      section: 'New Cancel',
      percent: '17',
      up: true,
      amount: '15',
    },
    {
      section: 'Same Day Cancel',
      percent: '5',
      up: true,
      amount: '5',
    },
  ];
  const sectionFutureRevenuePlanningList = [
    {
      section: 'Est. Revenue',
      percent: '7',
      up: true,
      amount: '$15,500',
    },
    {
      section: 'Est. Revenue',
      percent: '30',
      up: true,
      amount: '$47,500',
    },
    {
      section: 'Est. Revenue',
      percent: '90',
      up: true,
      amount: '$125,200',
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
  let sales = [
    2000,
    2000,
    2100,
    1500,
    1700,
    2400,
    2300,
    2400,
    1800,
    1700,
    1500,
    2300,
    1800,
    1780,
    1800,
    2100,
    1900,
    1000,
    1900,
    2300,
    1800,
    1900,
    1900,
    2100,
    1800,
    2000,
  ];
  let orders = [
    45,
    45,
    50,
    30,
    33,
    55,
    20,
    55,
    33,
    32,
    29,
    50,
    40,
    38,
    40,
    45,
    43,
    22,
    35,
    53,
    25,
    27,
    27,
    50,
    25,
    50,
  ];
  const SaleChart = {
    chart: {
      zoomType: 'xy',
    },
    title: {
      text: 'Total Sales (Inc.Refunds)',
    },
    xAxis: [
      {
        categories: categories,
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
          text: 'Total Sales',
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
        type: 'column',
        yAxis: 1,
        data: orders,
        color: '#007ffa',
      },
      {
        name: 'Total Sales',
        type: 'spline',
        data: sales,
        color: '#00a030',
      },
    ],
  };

  // Refund chart
  let refunds = [
    2000,
    0,
    0,
    1500,
    0,
    2400,
    0,
    0,
    0,
    0,
    1500,
    0,
    1800,
    0,
    0,
    0,
    0,
    1000,
    0,
    0,
    0,
    0,
    1900,
    2100,
    1800,
    2000,
  ];
  let refund_counts = [
    45,
    0,
    0,
    30,
    0,
    55,
    0,
    0,
    0,
    0,
    29,
    0,
    40,
    0,
    0,
    0,
    0,
    22,
    0,
    53,
    0,
    0,
    0,
    0,
    25,
    50,
  ];
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
          text: 'Refund Amount',
          style: {
            color: '#202b35',
          },
        },
      },
      {
        // Secondary yAxis
        title: {
          text: 'Refund Count',
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
        data: refund_counts,
        color: '#959595',
      },
      {
        name: 'Refund amount',
        type: 'spline',
        data: refunds,
        color: '#202b35',
      },
    ],
  };

  //checkout chart
  let recurringOrders = [
    900,
    1500,
    1300,
    1800,
    1100,
    400,
    1300,
    1200,
    1800,
    2100,
    1200,
    1100,
    1250,
    1600,
    1400,
    1080,
    1100,
  ];
  let checkoutOrders = [
    700,
    700,
    400,
    800,
    400,
    900,
    930,
    500,
    700,
    712,
    780,
    740,
    600,
    620,
    800,
    200,
    800,
  ];
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
        data: recurringOrders,
      },
      {
        name: 'Checkout',
        data: checkoutOrders,
      },
    ],
  };

  // customer chart
  let categories_2 = [
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
  ];
  let customers = [
    2000,
    0,
    0,
    1500,
    0,
    2500,
    0,
    0,
    0,
    0,
    1100,
    0,
    1700,
    0,
    0,
    0,
    0,
    1000,
    0,
    0,
  ];
  const CustomerChart = {
    // chartHeight: '600px',
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
      categories: categories_2,
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
        data: customers,
        color: '#202b35',
      },
    ],
  };

  // chart-active-churned-customers
  let activeCustomers = [
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
  ];
  let churnCustomers = [
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
    1000,
  ];
  const Active_Churned_CustomerChart = {
    chart: {
      type: 'area',
    },
    title: {
      text: 'Active Customers vs Churned Customers',
    },

    xAxis: {
      categories: categories,
      tickmarkPlacement: 'on',
      title: {
        enabled: false,
      },
    },
    yAxis: {
      labels: {
        format: '{value}',
      },
      title: {
        text: 'Number of Customers',
      },
    },
    exporting: {
      enabled: false,
    },
    plotOptions: {
      area: {
        stacking: 'percent',
        lineColor: '#ffffff',
        lineWidth: 1,
        marker: {
          lineWidth: 1,
          lineColor: '#ffffff',
        },
        accessibility: {
          pointDescriptionFormatter: function (point) {
            function round(x) {
              return Math.round(x * 100) / 100;
            }
            return (
              point.index +
              1 +
              ', ' +
              point.category +
              ', ' +
              point.y +
              ' millions, ' +
              round(point.percentage) +
              '%, ' +
              point.series.name
            );
          },
        },
      },
    },
    series: [
      {
        name: 'Charge Count',
        data: activeCustomers,
      },
      {
        name: 'Total Sales',
        data: churnCustomers,
      },
    ],
  };
  // subscriptions chart
  const SubscriptionsChart = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'New Subscriptions vs Cancellations',
    },
    xAxis: {
      categories: [
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
      ],
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
        data: [5, 3, 4, 7, 2, 3, 4, 5, 6, 1, 4, 4, 2, 5, 6, 1, 7, 4],
        color: '#007ffa',
      },
      {
        name: 'Cancellations',
        data: [
          -2,
          -2,
          -3,
          -2,
          -1,
          -1,
          -3,
          -5,
          -7,
          -8,
          -9,
          -4,
          -1,
          -2,
          -4,
          -4,
          -1,
          -2,
        ],
        color: '#202b35',
      },
    ],
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
        data: [15500, 47500, 125200],
        color: '#007ffa',
      },
      {
        name: 'Total Historical Revenue',
        data: [11500, 44500, 101800],
        color: '#202b35',
      },
    ],
  };
  // Estimated Recurring Revenue Table
  const rows_Revenue = [
    ['Estimated Revenue', '7', '30', '90'],
    ['Queued Revenue', '$15,500', '$47,500', '$125,200'],
    ['Error Revenue', '0', '$250', '$500'],
    ['Total Revenue', '$125,200', '$47,750', '$125,700'],
  ];
  //Estimated Recurring Charges Table
  const rows_Charges = [
    ['Estimated Revenue', '7', '30', '90'],
    ['Queued Revenue', '212', '946', '3050'],
    ['Error Revenue', '0', '2', '12'],
    ['Total Revenue', '212', '948', '3062'],
  ];
  return (
    <FormLayout>
      <Layout>
        <Stack vertical spacing="extraLoose">
          <Layout>
            <Layout.Section>
              <Card title="Revenue Trends - Basic">
                <Card.Section>
                  <Button
                    plain
                    monochrome
                    onClick={() => {
                      setExpandedFilter(!expandedFilter);
                    }}
                    icon={DropdownMinor}
                  >
                    Filter
                  </Button>
                  <br />
                  {expandedFilter ? (
                    <form className="form-inline">
                      <div className="form-inline-child">
                        <p>Date Granularity</p>
                        <div className="select">
                          <Select
                            options={options_1}
                            onChange={handleSelectChange_1}
                            value={selected_1}
                          />
                        </div>
                        <div className="select">
                          <Select
                            options={options_1}
                            onChange={handleSelectChange_1}
                            value={selected_1}
                          />
                        </div>
                      </div>
                      <div className="form-inline-child">
                        <p>Date Range</p>
                        <div className="select">
                          <Select
                            options={options_1}
                            onChange={handleSelectChange_1}
                            value={selected_1}
                          />
                        </div>
                        <div className="textfield">
                          <TextField value="30"></TextField>
                        </div>
                        <div className="select">
                          <Select
                            options={options_1}
                            onChange={handleSelectChange_1}
                            value={selected_1}
                          />
                        </div>
                      </div>
                      <Button primary>
                        {'   '}Run{'   '}
                      </Button>
                    </form>
                  ) : // </div>
                  null}
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
                        </Stack.Item>
                      </Stack>
                    </Card>
                  </Stack.Item>
                ))}
              </Stack>
            </Layout.Section>
          </Layout>
          <Layout>
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
          </Layout>
          <Layout>
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
          </Layout>
          <Layout>
            <Layout.Section>
              <Heading>{'  '}</Heading>
              <HighchartsReact highcharts={Highcharts} options={SaleChart} />
            </Layout.Section>
          </Layout>
          <Layout>
            <Layout.Section>
              <Heading>{'  '}</Heading>
              <HighchartsReact highcharts={Highcharts} options={RefundChart} />
            </Layout.Section>
          </Layout>
          <Layout>
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
                options={CheckoutChart}
              />
            </Layout.Section>
          </Layout>
          <Stack.Item>
            <Layout>
              <Layout.Section>
                <DisplayText size="medium">Active Customers</DisplayText>
              </Layout.Section>
            </Layout>
            <br />
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
                  options={CustomerChart}
                />
              </Layout.Section>
            </Layout>
          </Stack.Item>
          <Layout>
            <Layout.Section>
              <Heading>{'  '}</Heading>
              <HighchartsReact
                highcharts={Highcharts}
                options={Active_Churned_CustomerChart}
              />
            </Layout.Section>
          </Layout>
          <Stack.Item>
            <Layout>
              <Layout.Section>
                <DisplayText size="medium">Subscription</DisplayText>
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
                  options={SubscriptionsChart}
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
                                {item.amount}
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
                  options={EstimatedChart}
                />
              </Layout.Section>
            </Layout>
          </Stack.Item>
          <Layout>
            <Layout.Section>
              <Stack distribution="equalSpacing">
                <Card title="Estimated Recurring Revenue Table">
                  <DataTable
                    showTotalsInFooter
                    columnContentTypes={['text', 'text', 'text', 'text']}
                    headings={[' ', ' ', ' ', ' ']}
                    rows={rows_Revenue}
                  />
                </Card>
                <Card title="Estimated Recurring Revenue Table">
                  <DataTable
                    showTotalsInFooter
                    columnContentTypes={['text', 'text', 'text', 'text']}
                    headings={[' ', ' ', ' ', ' ']}
                    rows={rows_Charges}
                  />
                </Card>
              </Stack>
            </Layout.Section>
          </Layout>
        </Stack>
      </Layout>
    </FormLayout>
  );
};
export default RevenueTrends;
