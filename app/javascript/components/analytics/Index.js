import React, { useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '../layout/Layout';
import RevenueTrends from './RevenueTrends';
import CustomerInsights from './CustomerInsights';
import Retention from './Retention';
import Product from './Product';
import {FilterContextProvider} from './../common/Contexts/AnalyticsFilterContext';
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

const Analytics = () => {
  const [selectedTitleTab, setSelectedTitleTab] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTitleTab(selectedTabIndex),
    []
  );
  const tabAnalytics = [
    {
      id: 'revenue-trends',
      content: 'Revenue Trends',
    },
    {
      id: 'customer-insights',
      content: 'Customer Insights',
    },
<<<<<<< HEAD
    {
      id: 'retention',
      content: 'Retention',
    },
=======
    ...(process.env.APP_TYPE=="public" ?
    [{
      id: 'retention',
      content: 'Retention',
    }]:[]),
>>>>>>> bb8a77f518366174954da2d14bc1ea301dc181c0
    {
      id: 'product',
      content: 'Product',
    },
    {
      id: 'smartsms',
      content: 'SmartySMS',
    }
  ];
  return (
    <AppLayout typePage="Analytics" tabIndex="5">
      <Page title="Analytics">
        <FilterContextProvider>
        <Tabs
          tabs={tabAnalytics}
          selected={selectedTitleTab}
          onSelect={handleTabChange}
        >
          {selectedTitleTab === 0 ? (
            <RevenueTrends />
          ) : selectedTitleTab === 1 ? (
            <div className="customer-insight">
              <CustomerInsights />
            </div>
          ) 
<<<<<<< HEAD
          : selectedTitleTab === 2 ? (
=======
          :
          (process.env.APP_TYPE=="public" && selectedTitleTab === 2) ? (
>>>>>>> bb8a77f518366174954da2d14bc1ea301dc181c0
            <div className="retention">
              <Retention />
            </div>
          ) 
<<<<<<< HEAD
          : selectedTitleTab === 3 ?(
=======
          : selectedTitleTab === (process.env.APP_TYPE=="public" ?3:2) ?(
>>>>>>> bb8a77f518366174954da2d14bc1ea301dc181c0
            <div className="product">
              <Product />
            </div>
          ):selectedTitleTab === 3 ?(
            <>
            <SmartSms />
            </>
          ):
          ""}
        </Tabs>
        </FilterContextProvider>
      </Page>
    </AppLayout>
  );
};
export default Analytics;
