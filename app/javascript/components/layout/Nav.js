import {
  Button,
  Frame,
  Icon,
  Navigation,
  Select,
  Tabs
} from '@shopify/polaris';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import "./nav_style.scss";
import { HomeMajor, SettingsMinor, AnalyticsMajor, HintMajor, ProfileMajor, InstallMinor, CustomersMajor, GiftCardMajor } from "@shopify/polaris-icons";
import { MangeIcon, SubscriptionIcon, ToolboxIcon } from './CustomIcon';
import ChargeZenLogo from "./../../images/ChargeZenLogo.svg";
import CircleChevronMinor from "./../../images/VectorIcon";
import useRouter from '../useRouterHook';


const Nav = (props) => {
  const {
    navCollapse,
    setNavCollapse,
    selected
  } = props;
  const history = useHistory();
  const router = useRouter();
  const [navigations, setNavigations] = useState([]);
  const [activeTab, setActiveTab] = useState("dash");
  const [loyality, setLoyality] = useState(false);
  console.log("loyality", loyality);
  useEffect(() => {
    const accessSettings = JSON.parse(localStorage.getItem("accessSettings"))
    console.log('window.location.pathname', window.location.pathname)
    setNavigation(accessSettings)
  }, [loyality])

  useEffect(() => {
    // setLoyality(false)
  }, [activeTab])

  const handleLoyality = useCallback(() => {
    alert("hdjhsjdh")
    setLoyality(true)
  }, [])


  const setNavigation = (accessTabs) => {
    let navigation = [];
    if (accessTabs?.dashboard_access || accessTabs?.manage_plan_access) {
      navigation.push({
        url: "",
        label: 'RevenueOS',
        disabled: true,
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
          ) : {},
          {
            icon: MangeIcon,
            label: 'Rebuy cart',
            url: '/',
            onClick: () => setActiveTab("dash"),
            selected: window.location.pathname == "/" ? true : false,
          },
          {
            icon: MangeIcon,
            label: 'Pre-orders',
            url: '/',
            onClick: () => setActiveTab("dash"),
            selected: window.location.pathname == "/" ? true : false,
          },
          {
            icon: MangeIcon,
            label: 'Try-before-you-buy',
            url: '/',
            onClick: () => setActiveTab("dash"),
            selected: window.location.pathname == "/" ? true : false,
          }
        ]
      })
    }


    if (accessTabs?.subscription_orders_access || accessTabs?.analytics_access) {
      navigation.push({
        url: "",
        label: 'Workspace',
        disabled: true,
        selected: true,
        subNavigationItems: [
          accessTabs?.subscription_orders_access ? (
            {
              label: 'Subscription Contracts',
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
          ) : {},
          {
            label: 'Loyalty/Rewards',
            icon: GiftCardMajor,
            url: window.location.pathname,
            selected: true,
            subNavigationItems: [
              {
                url: "/waysToEarn",
                disabled: false,
                selected: window.location.pathname == "/waysToEarn" ? true : false,
                label: "Ways to Earn"
              },
              {
                url: "/rewardsPage",
                disabled: false,
                label: "Rewards Page",
                selected: window.location.pathname == "//rewardsPage" ? true : false,
              }
            ]
          }
        ]
      })
    }

    if (accessTabs?.installation_access || accessTabs?.tiazen_access || accessTabs?.toolbox_access || accessTabs?.settings_access) {
      navigation.push({
        url: "",
        label: 'General',
        selected: true,
        disabled: true,
        subNavigationItems: [
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

  return (
    <div className='navBar'>
      <div className='logo_main'>
        <div className='logo'>
          <img src={ChargeZenLogo} />
        </div>
        <div className='collapsible_button'>
          <Button onClick={() => {
            setNavCollapse(!navCollapse)
          }
          }>
            {
              navCollapse ?
                <div className='arrow-icon-right'>
                  <svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.93891 0.938995L0.878906 8L7.93891 15.061L10.0609 12.939L5.12091 8L10.0609 3.061L7.93891 0.938995Z" fill="#445BFF" />
                  </svg>
                </div>
                :
                <div className='arrow-icon-left'>
                  <svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.93891 0.938995L0.878906 8L7.93891 15.061L10.0609 12.939L5.12091 8L10.0609 3.061L7.93891 0.938995Z" fill="#445BFF" />
                  </svg>
                </div>
            }
          </Button>
        </div>
      </div>
      {
        navigations.length > 0 ?
          <div className="sidBartabs">
            <Navigation location={router.pathname}>
              <Navigation.Section
                items={navigations ? navigations : []}
                selected={selected}
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
