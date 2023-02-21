import {
  ApolloClient,
  ApolloLink, ApolloProvider,
  HttpLink,
  InMemoryCache
} from '@apollo/client';
import { authenticatedFetch } from '@shopify/app-bridge-utils';
import {
  AppProvider
} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import Analytics from './analytics/Index';
import BuildBox from './build-a-box/BuildBox';
import CreateBuildBox from './build-a-box/CreateBuildBox';
import Customers from './customer/Index';
import CreateCustomer from './customer/New';
// pages ####
import Dashboard from './home/Index';
import Installation from './installation/Index';
import IntegrationDetail from './integration/Detail';
import Integrations from './integration/Index';
import BuildABoxPlan from './plans/BuildABoxPlan';
import FixedPlan from './plans/FixedPlan';
import SellingPlans from './plans/Index';
import MysteryBoxPlan from './plans/MysteryBoxPlan';
import TrialPlan from './plans/TrialPlan';
import Settings from './setting/Index';
import Smarty from './smarty/Index';
import EditSmartyMessage from './smarty/SmartyMessage/EditSmartyMessage';
import Upsell from './upsell/Index';
import CreateUpsell from './upsell/New';
import Tiazen from './Tiazen/Index'
import Toolbox from './Toolbox/Index'
import PowerView from './plans/PowerView';
import CustomerModal from './CustomerModal/Index';

import InstallShop from './InstallShop';
import ManageStaff from './ManageStaff';
import DisabledNav from './layout/DisabledNav';
import NewDashboard from './home/NewDashboard';
import Notifications from './layout/Notifications';
import WaysToEarnPoint from './WaysToEarnPoint';
import LoyaltyRewards from './loyalty-rewards/Index';
import Referrals from './Referrals';
import AppLayout from './layout/Layout';
import StripeContract from './StripeContracts';
import { DomainContext } from './domain-context';
import StripeContractsList from './StripeContracts/StripeContractsList';
import CreateBundleMenu from './BundleMenu/CreateBundleMenu';
import BundleMenus from './BundleMenu/Index';








export default function App(props) {
  const domain = props?.domain
  const allShops = props?.allShops
  if ((domain && (allShops?.length > 0)) && allShops?.includes(domain)) {
    let shopifyLink;
    let mainLink;
    if (window.top == window.self) {
      // Not in an iframe
      origin = window.location.host;
      mainLink = new HttpLink({
        uri: `/${domain?.replace('.myshopify.com', '')}/graphql`,
        credentials: 'include',
        headers: {
          'X-CSRF-Token': document.querySelector('meta[name=csrf-token]').getAttribute('content'),
        },
      });
      shopifyLink = new HttpLink({
        credentials: 'include',
        headers: {
          'X-CSRF-Token': document.querySelector('meta[name=csrf-token]').getAttribute('content'),
        },
        uri: `/${domain?.replace('.myshopify.com', '')}/graphql-shopify`,
      });
    } else {
      // Inside the iframe
      mainLink = new HttpLink({
        credentials: 'same-origin',
        fetch: authenticatedFetch(window.app),
        uri: `/${domain?.replace('.myshopify.com', '')}/graphql`,
        origin: domain
      });
      shopifyLink = new HttpLink({
        credentials: 'same-origin',
        fetch: authenticatedFetch(window.app),
        uri: `/${domain?.replace('.myshopify.com', '')}/graphql-shopify`,
        origin: domain
      });
    }

    const client = new ApolloClient({
      link: ApolloLink.split(
        (operation) => operation.getContext().clientName === 'shopify-link',
        shopifyLink,
        mainLink
      ),
      cache: new InMemoryCache(),
    });


    const [passwordProtected, setPasswordProtected] = useState(props.enablePassword)

    // const client = new ApolloClient({
    //   link: new HttpLink({
    //     credentials: 'same-origin',
    //     fetch: authenticatedFetch(window.app),
    //     uri: '/graphql',
    //   }),
    //   cache: new InMemoryCache(),
    // });

    useEffect(() => {
      fetch(`/user_shops/authorize_user_shop?shopify_domain=${domain}`, {
        method: 'POST',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("data", data);
          localStorage.removeItem("accessSettings");
          localStorage.setItem("accessSettings", data?.accessSettings);
        })
      localStorage.setItem("allShops", JSON.stringify(props?.allShops));
    }, [])


    function AdapterLink({ url, ...rest }) {
      return <Link to={url} {...rest} />
    }

    return (
      <BrowserRouter basename={`/${domain?.replace('.myshopify.com', '')}`} >
        <DomainContext.Provider value={{ domain }} >
          <AppProvider i18n={enTranslations} theme={{}} linkComponent={AdapterLink}>
            <ApolloProvider client={client}>
              <Switch>
                <AppLayout typePage="createCustomer" tabIndex="2" domain={props?.domain}>
                  <Route exact path="/bundles" component={BundleMenus} />
                  <Route exact path="/createBundleMenu" component={CreateBundleMenu} />
                  <Route exact path="/stripeContractsList" component={StripeContractsList} />
                  <Route exact path="/createStripeContract" component={StripeContract} />
                  <Route exact path="/referrals" component={Referrals} />
                  <Route exact path="/waysToEarn" component={WaysToEarnPoint} />
                  <Route exact path="/notifications" component={Notifications} />
                  <Route exact path="/rewardsPage" component={LoyaltyRewards} />
                  <Route exact path="/manage-staff" component={ManageStaff} />
                  <Route
                    exact
                    path="/"
                    component={() => <NewDashboard />}
                  />
                  <Route exact path="/customer-model" component={CustomerModal} />,
                  <Route exact path="/subscription-plans" component={SellingPlans} />,
                  <Route
                    exact
                    path="/fixed-subscription-plans/:id"
                    component={FixedPlan}
                  />
                  <Route
                    exact
                    path="/power-view-plan/:id/"
                    component={PowerView}
                  />
                  <Route
                    exact
                    path="/fixed-subscription-plans"
                    component={FixedPlan}
                  />
                  <Route
                    exact
                    path="/trial-subscription-plan/:id"
                    component={TrialPlan}
                  />
                  <Route
                    exact
                    path="/trial-subscription-plan"
                    component={TrialPlan}
                  />
                  <Route
                    exact
                    path="/build-a-box-subscription-plan/:id"
                    component={BuildABoxPlan}
                  />
                  <Route
                    exact
                    path="/build-a-box-subscription-plan"
                    component={BuildABoxPlan}
                  />
                  <Route
                    exact
                    path="/mystery-box-subscription-plan/:id"
                    component={MysteryBoxPlan}
                  />
                  <Route
                    exact
                    path="/mystery-box-subscription-plan"
                    component={MysteryBoxPlan}
                  />
                  <Route
                    exact
                    path="/newDash"
                    component={() => <Dashboard domain={props.domain} />}
                  />
                  <Route exact path="/integrations" component={Integrations} />
                  <Route
                    exact
                    path="/integration-detail/:id/:title/:keys?"
                    component={IntegrationDetail}
                  />
                  <Route exact path="/smarty" component={Smarty} />
                  <Route exact path="/edit-smarty-message/:id" component={EditSmartyMessage} />
                  <Route exact path="/app-settings" component={() => <Settings passwordProtected={passwordProtected} setPasswordProtected={setPasswordProtected} domain={props.domain} />} />
                  <Route exact path="/customers" component={() => <Customers shopifyDomain={props.domain} />} />
                  <Route exact path="/customers/new" component={CreateCustomer} />
                  <Route
                    exact
                    path="/customers/:id/edit"
                    component={CreateCustomer}
                  />
                  <Route exact path="/analytics" component={Analytics} />
                  <Route exact path="/installation" component={() => <Installation shopifyDomain={props.domain} passwordProtected={passwordProtected} />} />
                  <Route exact path="/upsell" component={Upsell} />
                  <Route exact path="/upsell/:id/edit" component={CreateUpsell} />
                  <Route exact path="/upsell/new" component={CreateUpsell} />

                  <Route exact path='/build-a-box' component={BuildBox} />
                  <Route exact path="/build-a-box/:id/edit" component={CreateBuildBox} />
                  <Route exact path="/build-a-box/new" component={CreateBuildBox} />

                  <Route exact path="/tiazen" component={Tiazen} />
                  <Route exact path="/toolbox" component={Toolbox} />
                </AppLayout>
              </Switch>
            </ApolloProvider>
          </AppProvider>
        </DomainContext.Provider>
      </BrowserRouter >
    );
  } else {
    //remove previous ShopDomain from localStora
    localStorage.removeItem("currentShopDomain")
    return (

      <AppProvider i18n={enTranslations} theme={{}}>
        <DisabledNav />
        <InstallShop />
      </AppProvider>
    )
  }
}
