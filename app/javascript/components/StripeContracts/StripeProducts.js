import React, { useContext, useEffect } from 'react';
import { useState, useCallback } from "react";
import { Page, Card, DataTable, Spinner } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";

import { gql, useMutation, useQuery } from '@apollo/client';
import { Pagination } from '@shopify/polaris';
import { DomainContext } from '../domain-context';



function StripeProducts({ setSelectedStripeProduct, selectedStripeProduct, setFormField, formField }) {
    const [stripeProducts, setStripeProducts] = useState([])
    const [hasPrevious, setHasPrevious] = useState(false);
    const [hasNext, setHasNext] = useState(false);

    const { domain } = useContext(DomainContext);

    const getStripeProducts = (prev, next) => {

        let url = '/getStripeProducts?shopify_domain=' + domain
        if (next) {
            url = url + '&next_page=' + next
        }
        else if (prev) {
            url = url + '&prev_page=' + prev
        }
        fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then((data) => {
                setStripeProducts(data?.products)
                setHasNext(data?.has_more)
                setHasPrevious(data?.has_prev)
            });
    }

    useEffect(() => {
        getStripeProducts(null, null);
    }, [])

    const rows = [];

    const handleRowClick = (id, name) => {
        setFormField({ ...formField, stripe_product: id, stripe_product_name: name })
        setSelectedStripeProduct(id)
    }


    stripeProducts?.map((stripeProduct) => {
        rows.push(
            [
                <div className={selectedStripeProduct == stripeProduct["id"] ? "selected_row" : ''} onClick={() => handleRowClick(stripeProduct["id"], stripeProduct["name"])}>{stripeProduct["id"]}</div>,
                <div className={selectedStripeProduct == stripeProduct["id"] ? "selected_row" : ''} onClick={() => handleRowClick(stripeProduct["id"], stripeProduct["name"])}>{stripeProduct["name"]}</div>,
                <div className={selectedStripeProduct == stripeProduct["id"] ? "selected_row" : ''} onClick={() => handleRowClick(stripeProduct["id"], stripeProduct["name"])}>{stripeProduct["description"]}</div>,
                <div className={selectedStripeProduct == stripeProduct["id"] ? "selected_row" : ''} onClick={() => handleRowClick(stripeProduct["id"], stripeProduct["name"])}>{stripeProduct["active"] ? 'Active' : 'Inactive'}</div>,
            ])
    })

    return (
        <Page title="Select Stripe Product">
            <Card>
                <DataTable
                    columnContentTypes={[
                        'text',
                        'text',
                        'text',
                        'text',
                    ]}
                    headings={[
                        "Id",
                        'Name',
                        'Description',
                        'Status',
                    ]}
                    rows={rows}
                    sortable={[false, false, true, false, false, false]}
                    defaultSortDirection="descending"
                    initialSortColumnIndex={1}
                    footerContent={
                        <Pagination
                            hasPrevious={hasPrevious}
                            onPrevious={() => {
                                getStripeProducts(stripeProducts[0]?.id, null);
                            }}
                            hasNext={hasNext}
                            onNext={() => {
                                getStripeProducts(null, stripeProducts[stripeProducts?.length - 1]?.id);
                            }}
                        />
                    }
                />
            </Card>
        </Page>
    );
}

export default StripeProducts;  