import {
  Frame,
  Icon,
  Navigation,
  Select,
  Tabs
} from '@shopify/polaris';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import "./nav_style.scss";
import { HomeMajor, SettingsMinor, AnalyticsMajor, HintMajor, ProfileMajor, InstallMinor, CustomersMajor } from "@shopify/polaris-icons";
import { MangeIcon, SubscriptionIcon, ToolboxIcon } from './CustomIcon';
import ChargeZenLogo from "./../../images/ChargeZenLogo.svg";


const Nav = (props) => {
  const history = useHistory();

  const [navigations, setNavigations] = useState([]);
  const [activeTab, setActiveTab] = useState("dash");
  useEffect(() => {
    const accessSettings = JSON.parse(localStorage.getItem("accessSettings"))
    console.log('window.location.pathname', window.location.pathname)
    setNavigation(accessSettings)
  }, [])
  const setNavigation = (accessTabs) => {
    let navigation = [];
    if (accessTabs?.dashboard_access || accessTabs?.manage_plan_access) {
      navigation.push({
        url: "",
        label: 'Main Menu',
        selected: true,
        subNavigationItems: [
          accessTabs?.dashboard_access ? (
            {
              icon: HomeMajor,
              label: 'Dashboard',
              url: '/',
              onClick: () => setActiveTab("dash"),
              selected: window.location.pathname == "/" ? true : false,
            }
          ) : {},
          accessTabs?.manage_plan_access ? (
            {
              label: 'Subscription Plans',
              icon: () => <MangeIcon />,
              url: '/subscription-plans',
              onClick: () => setActiveTab("mplan"),
              selected: window.location.pathname == "/subscription-plans" ? true : false,
            }
          ) : {}
        ]
      })
    }


    if (accessTabs?.subscription_orders_access || accessTabs?.analytics_access) {
      navigation.push({
        url: "",
        label: 'Workspace',
        selected: true,
        subNavigationItems: [
          accessTabs?.subscription_orders_access ? (
            {
              label: 'Subscription Orders',
              icon: () => <SubscriptionIcon />,
              url: '/customers',
              onClick: () => setActiveTab("suborder"),
              selected: window.location.pathname == "/customers" ? true : false,
            }
          ) : {},
          accessTabs?.analytics_access ? (
            {
              label: 'Analytics',
              icon: AnalyticsMajor,
              url: '/analytics',
              onClick: () => setActiveTab("analytics"),
              selected: window.location.pathname == "/analytics" ? true : false,
            }
          ) : {},
          accessTabs?.customer_modal ? (
            {
              label: 'Subscription Customers',
              icon: CustomersMajor,
              url: '/customer-model',
              onClick: () => setActiveTab("customerModal"),
              selected: window.location.pathname == "/customer-model" ? true : false,
            }
          ) : {}
        ]
      })
    }

    if (accessTabs?.installation_access || accessTabs?.tiazen_access || accessTabs?.toolbox_access || accessTabs?.settings_access) {
      navigation.push({
        url: "",
        label: 'General',
        selected: true,
        subNavigationItems: [
          {
            label: "Manage Staff",
            icon: ProfileMajor,
            url: "/manage-staff",
            onClick: () => setActiveTab("mplan"),
            selected: window.location.pathname == "/manage-staff" ? true : false,
          },
          accessTabs?.installation_access ? (
            {
              label: 'Installation',
              icon: InstallMinor,
              url: '/installation',
              onClick: () => setActiveTab("inst"),
              selected: window.location.pathname == "/installation" ? true : false,
            }
          ) : {},
          accessTabs?.tiazen_access ? (
            {
              label: 'Tiazen',
              icon: HintMajor,
              url: '/tiazen',
              onClick: () => setActiveTab("tiazen"),
              selected: window.location.pathname == "/tiazen" ? true : false,
            }
          ) : {},
          accessTabs?.toolbox_access ? (
            {
              label: "Toolbox",
              icon: () => <ToolboxIcon />,
              url: '/toolbox',
              onClick: () => setActiveTab("tool"),
              selected: window.location.pathname == "/toolbox" ? true : false,
            }
          ) : {},
          accessTabs?.settings_access ? (
            {
              label: "Settings",
              icon: SettingsMinor,
              url: '/app-settings',
              onClick: () => setActiveTab("settings"),
              selected: window.location.pathname == "/app-settings" ? true : false,
            }
          ) : {}
        ]
      })
    }
    setNavigations(navigation);
  }
  console.log(navigations);

  return (
    <div className='navBar'>
      <div className='logo'>
        <img src={ChargeZenLogo} />
      </div>
      {
        navigations.length > 0 ?
          <div className="sidBartabs">
            <Navigation location='\'>
              <Navigation.Section
                items={navigations ? navigations : []}
                selected={props.selected}
              />
            </Navigation>
          </div> : <div />
      }
      <div className='logout_link'>
        {
          localStorage.getItem("currentuser") &&
          <>
            <a href={`${window?.location?.origin}/users/sign_out`} className="adminLogoutLink" data-method="delete">Log Out</a>
          </>
        }
      </div>
    </div>
  );
};

export default Nav;
