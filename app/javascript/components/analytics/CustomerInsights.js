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
  TextContainer,
} from '@shopify/polaris';
import {
  DropdownMinor,
  CaretUpMinor,
  CaretDownMinor,
} from '@shopify/polaris-icons';
import { Form } from 'formik';

const CustomerInsights = () => {
  const sectionCustomerList = [
    {
      section: 'Customer Count',
      percent: '24',
      up: true,
      amount: '7,443',
    },
    {
      section: 'Sales Per Charge',
      percent: '2',
      up: false,
      amount: '$57.12',
    },
    {
      section: 'Charges Per Customer',
      // percent: '',
      // up: '',
      amount: '1.17',
    },
    {
      section: 'Total Churn %',
      percent: '1',
      up: false,
      amount: '37%',
    },
  ];
  //insight Chart
  const insightChart = {
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
        // name: 'Browser share',
        innerSize: '50%',
        data: [
          ['60%', 60],
          ['18%', 18],
          ['19%', 19],
          ['2%', 2],
          // {
          //   // name: 'Other',
          //   y: 7.61,
          //   dataLabels: {
          //     enabled: false,
          //   },
          // },
        ],
      },
    ],
  };
  const rows_Customer = [
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
    [
      1,
      'Active Customers - 0015',
      'SUCCESS',
      'MAX_RETRIES',
      'CARD_ERROR_GENE...',
      '2,609',
      '47.54%',
    ],
  ];
  //Purchase Items (Subscriptions)
  const sectionPurchaseItemList = [
    {
      section: 'Total Dunning & Dunned Subs',
      percent: '24',
      up: true,
      amount: '443',
    },
    {
      section: '% Dunning',
      percent: '2',
      up: true,
      amount: '17%',
    },
    {
      section: '% Recovered',
      percent: 2,
      up: true,
      amount: '12%',
    },
    {
      section: '% Churn',
      percent: '1',
      up: false,
      amount: '7%',
    },
  ];
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
      text: 'Dunned Subscription - Active',
    },
    xAxis: {
      categories: ['1', '2', '3'],
    },
    yAxis: {
      allowDecimals: false,
      title: {
        text: 'Subscription Dunned  No Credit Card Risk',
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
        text: 'Subscription Dunned  Passive Churn',
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
  //Customer Actions
  const sectionCustomerActionList = [
    {
      section: 'Skips',
      percent: '24',
      up: true,
      amount: '57',
    },
    {
      section: 'Swaps',
      percent: '2',
      up: true,
      amount: '12',
    },
    {
      section: 'Reactivations',
      percent: '2',
      up: true,
      amount: '45',
    },
  ];
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
  const CustomerActionChart_2 = {
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
        name: 'Active Customers',
        data: [2600, 300, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Churned Customers',
        data: [2600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };
  const rows_Churn = [
    [' ', 'At Least One Swap', 'Y', 'N'],
    [' ', 'At Least One Skip', '-', '-'],
    ['1', 'Y', '0', '250'],
    ['2', 'N', '$125,200', '2'],
  ];
  return (
    <FormLayout>
      <Stack vertical spacing="extraLoose">
        <Layout>
          {/* <Layout.Section secondary> */}

          <div className="container-left">
            <Layout.Section>
              <Stack vertical distribution="equalSpacing">
                {sectionCustomerList?.map((item, i) => (
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
                            {item?.percent}%
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
          </div>
          {/* </Layout.Section> */}
          <div className="container-right">
            <Layout.Section>
              <div className="card-chart">
                <Card>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={insightChart}
                  />
                </Card>
              </div>
            </Layout.Section>
          </div>
        </Layout>
        <Layout>
          <Layout.Section>
            <Card>
              <Card.Section>
                <DataTable
                  columnContentTypes={[
                    'numeric',
                    'text',
                    'text',
                    'text',
                    'text',
                    'text',
                    'text',
                  ]}
                  headings={[
                    ' ',
                    'Churn Category',
                    'Status',
                    'Parent Error Category',
                    'Error Type',
                    'Total Customers',
                    '%',
                  ]}
                  rows={rows_Customer}
                  hideScrollIndicator={true}
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
              {sectionPurchaseItemList?.map((item, i) => (
                <Stack.Item key={i}>
                  <Card sectioned>
                    <Stack>
                      <Stack.Item fill>
                        <TextStyle variation="strong">{item.section}</TextStyle>
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
            <Card>
              <div className="subscription-chart">
                <FormLayout.Group>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={DunningChart}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={ActiveChart}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={ChurnChart}
                  />
                </FormLayout.Group>
              </div>
            </Card>
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
                  {sectionCustomerActionList?.map((item, i) => (
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
                              {item?.percent}%
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
            </div>
            {/* </Layout.Section> */}
            <div className="container-right">
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
            </div>
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
