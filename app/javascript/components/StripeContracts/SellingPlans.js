import React, { useEffect } from 'react';
import { useState, useCallback } from "react";
import { Page, Card, DataTable, Spinner } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";

import { gql, useMutation, useQuery } from '@apollo/client';



function SellingPlans({ setSelectedSellingPlan, selectedSellingPlan }) {

    const GET_SELLING_PLANS = gql`
    query {
      fetchPlanGroups {
        id
        name
        subscriptionModel
        price
        trialPeriod
        billingPeriod
        active
        planType
        shopifyId
        sellingPlans {
          id
          name
          shopifyId
          intervalType
          intervalCount
          trialIntervalType
          trialIntervalCount
        }
      }
    }
  `;
    const { data, loading, error } = useQuery(GET_SELLING_PLANS, {
        fetchPolicy: 'no-cache',
    });
    const rows = [];

    const handleRowClick = (shopify_id) => {
        setSelectedSellingPlan(shopify_id)
    }

    data?.fetchPlanGroups?.map((planGroup) => {
        planGroup?.sellingPlans?.map((sellingPlan) => {
            rows.push(
                [<div className={selectedSellingPlan == sellingPlan?.shopifyId ? "selected_row" : ''} onClick={() => handleRowClick(sellingPlan?.shopifyId)}>{sellingPlan.name}</div>,
                <div className={selectedSellingPlan == sellingPlan?.shopifyId ? "selected_row" : ''} onClick={() => handleRowClick(sellingPlan?.shopifyId)}>{planGroup.billingPeriod}</div>,
                <div className={selectedSellingPlan == sellingPlan?.shopifyId ? "selected_row" : ''} onClick={() => handleRowClick(sellingPlan?.shopifyId)}>{planGroup.price}</div>,
                <div className={selectedSellingPlan == sellingPlan?.shopifyId ? "selected_row" : ''} onClick={() => handleRowClick(sellingPlan?.shopifyId)}>{planGroup.subscriptionModel}</div>,
                <div className={selectedSellingPlan == sellingPlan?.shopifyId ? "selected_row" : ''} onClick={() => handleRowClick(sellingPlan?.shopifyId)}>{planGroup.trialPeriod}</div>])
        })
    })

    return (
        <Page title="Select Selling Plans">
            <Card>
                <DataTable
                    columnContentTypes={[
                        'text',
                        'text',
                        'text',
                        'text',
                        'text',
                    ]}
                    headings={[
                        'Plans',
                        'Billing Period',
                        'Price',
                        'Subscription  Model',
                        'Trial Period',
                    ]}
                    rows={rows}
                    sortable={[false, false, true, false, false, false]}
                    defaultSortDirection="descending"
                    initialSortColumnIndex={1}
                />
                {loading && (
                    <Spinner
                        accessibilityLabel="Spinner example"
                        size="large"
                        color="teal"
                    />
                )}
            </Card>
        </Page>
    );
}

export default SellingPlans;  