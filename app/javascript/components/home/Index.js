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

const Dashboard = (props) => {
  const history = useHistory();

  const sectionList = [
    { section: 'MBR', percent: '24', up: true, amount: '$47,433' },
    {
      section: 'Active Subscriptions',
      percent: '1',
      up: false,
      amount: '1,980',
    },
    { section: 'Net Revenue', percent: '2', up: true, amount: '$500,012' },
    { section: 'Total Refunds', percent: '2', up: false, amount: '$550.12' },
  ];
  const [isTimeButton, setIsTimeButton] = useState(0);

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
        { id: 'new_sale', content: 'New Sales' },
      ],
      number: '$20.24K',
      number_small: 'Jan $83.98K',
      chart: { chartDaily },
      selected: selectedTitleTab_1,
      handle: handleTabChange_1,
    },
    {
      tabs: [
        { id: 'payments', content: 'Payments' },
        { id: 'refunds', content: 'Refunds' },
      ],
      number: '$245',
      number_small: 'Jan $98K',
      chart: { chartDaily },
      selected: selectedTitleTab_2,
      handle: handleTabChange_2,
    },
    {
      tabs: [
        { id: 'mrr', content: 'MRR' },
        { id: 'signups', content: 'Signups' },
        { id: 'activation', content: 'Activation' },
        { id: 'churn Rate', content: 'Churn Rate' },
      ],
      number: '54',
      number_small: 'Jan 8',
      chart: { chartDaily },
      selected: selectedTitleTab_3,
      handle: handleTabChange_3,
    },
    {
      tabs: [
        { id: 'sales_reversals', content: 'Sales Reversals' },
        { id: 'cmrr', content: 'CMRR' },
      ],
      number: '$5.24K',
      number_small: 'Jan $3.52K',
      chart: { chartDaily },
      selected: selectedTitleTab_4,
      handle: handleTabChange_4,
    },
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
            <Stack distribution="fill">
              {sectionList?.map((item, i) => (
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
                        <DisplayText size="medium">{item.amount}</DisplayText>
                      </Stack.Item>
                    </Stack>
                  </Card>
                </Stack.Item>
              ))}
            </Stack>
          </Layout.Section>

          <Layout.Section>
            <ButtonGroup segmented>
              <Button onClick={() => setIsTimeButton(0)} primary={isTimeButton==0}>
                Daily
              </Button>
              <Button onClick={() => setIsTimeButton(1)} primary={isTimeButton==1}>3 Months</Button>
              <Button onClick={() => setIsTimeButton(2)} primary={isTimeButton==2}>6 Months</Button>
              <Button onClick={() => setIsTimeButton(3)} primary={isTimeButton==3}>12 Months</Button>
            </ButtonGroup>
          </Layout.Section>

          {listContainerChart?.map((item, i) => (
            <Layout.Section oneHalf key={i}>
              <Tabs
                tabs={item.tabs}
                selected={item.selected}
                onSelect={item.handle}
              >
                <Card>
                  <Card.Section>
                    <Heading>{item.number}</Heading>
                    <Subheading className="number-below">
                      {item.number_small}
                    </Subheading>

                    <HighchartsReact
                      highcharts={Highcharts}
                      options={chartDaily}
                    />
                  </Card.Section>
                </Card>
              </Tabs>
            </Layout.Section>
          ))}

          <Modals active={getStartedModal} setActive={setGetStartedModal} domain={props.domain}/>
        </Layout>
      </Page>
    </AppLayout>
  );
};
export default Dashboard;
