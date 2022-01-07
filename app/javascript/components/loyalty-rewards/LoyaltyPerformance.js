import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Card,
  FormLayout,
  DisplayText,
  Heading
} from '@shopify/polaris';

const LoyaltyPerformance = () => {
    
  return (
    <FormLayout>
      <Card 
        title="Revenue Trends - Basic" 
        sectioned 
        primaryFooterAction={{content: 'Run'}}
        footerActionAlignment="left"
      > 
        <div>
          <strong>Filters</strong>
          <Heading element="h5">Date Range</Heading>
          <Heading element="h5">Graph Time Period</Heading>
          <Heading element="h5">Redemption tied to Purchase</Heading>
          <Heading element="h5">Date Range</Heading>
          <Heading element="h5">Has Account</Heading>
        </div>
      </Card>
        <DisplayText size="large">Loyalty Performance</DisplayText>
        <DisplayText size="large">Referred Customers</DisplayText>
        <DisplayText size="large">Reactived Customers</DisplayText>
    </FormLayout>
  );
}
export default LoyaltyPerformance;