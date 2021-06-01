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
    ...(process.env.APP_TYPE=="public" ?
    [{
      id: 'retention',
      content: 'Retention',
    }]:[]),
    {
      id: 'product',
      content: 'Product',
    },
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
          :
          (process.env.APP_TYPE=="public" && selectedTitleTab === 2) ? (
            <div className="retention">
              <Retention />
            </div>
          ) 
          : selectedTitleTab === (process.env.APP_TYPE=="public" ?3:2) ?(
            <div className="product">
              <Product />
            </div>
          ):""}
        </Tabs>
        </FilterContextProvider>
      </Page>
    </AppLayout>
  );
};
export default Analytics;
