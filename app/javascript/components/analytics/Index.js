import React, { useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '../layout/Layout';
import RevenueTrends from './RevenueTrends';
import CustomerInsights from './CustomerInsights';
import Retention from './Retention';
import Product from './Product';
import { FilterContextProvider } from './../common/Contexts/AnalyticsFilterContext';
import {
  Card,
  Select,
  ExceptionList,
  Button,
  Icon,
  Modal,
  TextField,
  Layout,
  Page,
  Stack,
  Tabs,
} from '@shopify/polaris';
import { FlagMajor, ChevronDownMinor } from '@shopify/polaris-icons';
import SmartSms from './SmartSms';
import PixelIcon from '../../images/PixelIcon';
import HeaderButtons from '../HeaderButtons/HeaderButtons';

const Analytics = () => {
  const [selectedTitleTab, setSelectedTitleTab] = useState(0);
  const [headerButton, setHeaderButton] = useState(0)
  useEffect(() => { setSelectedTitleTab(headerButton) },
    [headerButton]
  );
  const headerButtons = [
    {
      val: 0,
      name: 'Revenue Trends',
      index: 0
    },
    {
      val: 1,
      name: 'Customer Insights',
      index: 1
    },
    // ...(process.env.APP_TYPE=="public" ?
    // [{
    //   id: 'retention',
    //   content: 'Retention',
    // }]:[]),
    {
      val: 3,
      name: 'Product',
      index: 3
    },
    {
      val: 4,
      name: 'SmartySMS',
      index: 4
    }
  ];
  return (
    <AppLayout typePage="Analytics" tabIndex="4">
      <Page title="Analytics">
        <FilterContextProvider>
          <Card
            title={
              <div className="heading_title">
                <PixelIcon />
                Analytics
              </div>}
            actions={{
              content:
                <div className='tabButtons'>
                  <HeaderButtons headerButtons={headerButtons} setHeaderButton={setHeaderButton} headerButton={headerButton} />
                </div>
            }}
          >
            <Card.Section subdued>
              {selectedTitleTab === 0 ? (
                <div className="analytics-page-layout">
                  <RevenueTrends />
                </div>
              ) : selectedTitleTab === 1 ? (
                <div className="customer-insight">
                  <CustomerInsights />
                </div>
              )
                :
                (process.env.APP_TYPE == "public" && selectedTitleTab === 2) ? (
                  <div className="retention">
                    <Retention />
                  </div>
                )
                  : selectedTitleTab === (process.env.APP_TYPE == "public" ? 3 : 2) ? (
                    <div className="product">
                      <Product />
                    </div>
                  ) : selectedTitleTab === (process.env.APP_TYPE == "public" ? 4 : 3) ? (
                    <>
                      <SmartSms />
                    </>
                  ) :
                    ""}
            </Card.Section>
          </Card>
        </FilterContextProvider>
      </Page>
    </AppLayout>
  );
};
export default Analytics;
