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
import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
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








export default function App(props) {
  const mainLink = new HttpLink({
    credentials: 'same-origin',
    fetch: authenticatedFetch(window.app),
    uri: '/graphql',
  });
  const shopifyLink = new HttpLink({
    credentials: 'same-origin',
    fetch: authenticatedFetch(window.app),
    uri: '/graphql-shopify',
  });

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

  return (
    <BrowserRouter>
      <AppProvider i18n={enTranslations} theme={{}}>
        <ApolloProvider client={client}>
          <Switch>
            <Route
              exact
              path="/"
              component={() => <Dashboard domain={props.domain} />}
            />
            <Route exact path="/subscription-plans" component={SellingPlans} />
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
            // integrations ##
            <Route exact path="/integrations" component={Integrations} />
            <Route
              exact
              path="/integration-detail/:id/:title/:keys?"
              component={IntegrationDetail}
            />
            <Route exact path="/smarty" component={Smarty} />
            <Route exact path="/edit-smarty-message/:id" component={EditSmartyMessage} />
            <Route exact path="/settings" component={() => <Settings passwordProtected={passwordProtected} setPasswordProtected={setPasswordProtected} domain={props.domain} />} />
            <Route exact path="/customers" component={() => <Customers shopifyDomain={props.domain} />} />
            <Route exact path="/customers/new" component={CreateCustomer} />
            <Route
              exact
              path="/customers/:id/edit"
              component={CreateCustomer}
            />
            <Route exact path="/analytics" component={Analytics} />
            <Route exact path="/installation" component={() => <Installation shopifyDomain={props.domain} passwordProtected={passwordProtected}/>} />
            <Route exact path="/upsell" component={Upsell} />
            <Route exact path="/upsell/:id/edit" component={CreateUpsell} />
            <Route exact path="/upsell/new" component={CreateUpsell} />

            <Route exact path='/build-a-box' component={BuildBox}/>
            <Route exact path="/build-a-box/:id/edit" component={CreateBuildBox} />
            <Route exact path="/build-a-box/new" component={CreateBuildBox} />

            <Route exact path="/tiazen" component={Tiazen} />
            <Route exact path="/toolbox" component={Toolbox} />
          </Switch>
        </ApolloProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
