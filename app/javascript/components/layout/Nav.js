import { FooterHelp, Link } from '@shopify/polaris';
import { useHistory } from 'react-router-dom';
import React, { useState, useCallback } from 'react';

import {
  Layout,
  Card,
  Button,
  ResourceList,
  Stack,
  TextStyle,
  Thumbnail,
  DataTable,
  Page,
  ButtonGroup,
  Select,
  Tabs,
  Autocomplete,
  Icon,
  Badge,
} from '@shopify/polaris';

const Nav = (props) => {
  const history = useHistory();
  const handleTabChange = useCallback((selectedTabIndex) => {
    history.push(navigations[selectedTabIndex].path);
  }, []);

  const navigations = [
    {
      content: 'Dashboard',
      id: 'dashboard',
      path: '/',
    },
    {
      content: 'Manage Plans',
      id: 'subscriptions',
      path: '/subscription-plans',
    },
    {
      content: 'Customer Subscriptions',
      id: 'customers',
      path: '/customers',
    },
    {
      content: 'Installation',
      id: 'installation',
      path: '/installation',
    },
    {
      content: 'Upsell Campaigns',
      id: 'upsell',
      path: '/upsell',
    },
    {
      content: 'Analytics',
      id: 'analytics',
      path: '/analytics',
    },
    // {
    //   content: 'Integration',
    //   id: 'integrations',
    //   path: '/integrations',
    // },
    {
      content: 'Setting',
      id: 'settings',
      path: '/settings',
    },
  ];

  return (
    <Tabs
      tabs={navigations}
      selected={props.selected}
      onSelect={handleTabChange}
    ></Tabs>
  );
};

export default Nav;
