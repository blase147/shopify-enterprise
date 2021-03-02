import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  ApolloLink,
} from '@apollo/client';

import {
  AppProvider,
  EmptyState,
  Page,
  Frame,
  FooterHelp,
  Link,
  Stack,
  Tabs,
  Card,
} from '@shopify/polaris';
import { authenticatedFetch } from '@shopify/app-bridge-utils';
import React, { useState, useEffect, useCallback } from 'react';
import enTranslations from '@shopify/polaris/locales/en.json';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// pages ####
import Dashboard from './home/Index';

import Integrations from './integration/Index';
import IntegrationDetail from './integration/Detail';

import Settings from './setting/Index';

import SellingPlans from './plans/Index';
import FixedPlan from './plans/FixedPlan';
import TrialPlan from './plans/TrialPlan';
import BuildABoxPlan from './plans/BuildABoxPlan';
import MysteryBoxPlan from './plans/MysteryBoxPlan';

import Customers from './customer/Index';
import CreateCustomer from './customer/New';

import Installation from './installation/Index';

import Upsell from './upsell/Index';
import CreateUpsell from './upsell/New';

import Analytics from './analytics/Index';

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
            // selling plans ####
            <Route exact path="/subscription-plans" component={SellingPlans} />
            <Route
              exact
              path="/fixed-subscription-plans/:id"
              component={FixedPlan}
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
              path="/integration-detail/:id/:title"
              component={IntegrationDetail}
            />
            <Route exact path="/settings" component={Settings} />
            <Route exact path="/customers" component={Customers} />
            <Route exact path="/customers/new" component={CreateCustomer} />
            <Route
              exact
              path="/customers/:id/edit"
              component={CreateCustomer}
            />
            <Route exact path="/analytics" component={Analytics} />
            <Route exact path="/installation" component={Installation} />
            <Route exact path="/upsell" component={Upsell} />
            <Route exact path="/upsell/:id/edit" component={CreateUpsell} />
            <Route exact path="/upsell/new" component={CreateUpsell} />
          </Switch>
        </ApolloProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
