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
      content: 'Subscriptions Orders',
      id: 'customers',
      path: '/customers',
    },
    {
      content: 'Analytics',
      id: 'analytics',
      path: '/analytics',
    },
    {
      content: 'Installation',
      id: 'installation',
      path: '/installation',
    },
    {
      content: 'Tiazen',
      id: 'tiazen',
      path: '/tiazen',
    },
    // {
    //   content: 'Upsell Campaigns',
    //   id: 'upsell',
    //   path: '/upsell',
    // },
    // {
    //   content: 'Build a Box Campaigns',
    //   id: 'build-a-box',
    //   path: '/build-a-box',
    // },

    // {
    //   content: 'Smarty SMS',
    //   id: 'smarty-sms',
    //   path: '/smarty',
    // },
    // {
    //   content: 'Toolbox',
    //   id: 'toolbox',
    //   path: '/toolbox',
    // },
    {
      content: 'Toolbox',
      id: 'toolbox',
      path: '/toolbox',
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
