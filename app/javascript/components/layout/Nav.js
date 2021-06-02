import {
  Tabs
} from '@shopify/polaris';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';


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
    {
      content: 'Smarty SMS',
      id: 'smarty-sms',
      path: '/smarty',
    },
<<<<<<< HEAD

=======
>>>>>>> bb8a77f518366174954da2d14bc1ea301dc181c0
    {
      content: 'Integration',
      id: 'integrations',
      path: '/integrations',
    },
    {
      content: 'Settings',
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
