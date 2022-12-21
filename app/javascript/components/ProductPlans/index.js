import React from 'react';
import { Banner, DataTable, Filters, Frame, Page, Pagination, Spinner } from '@shopify/polaris';
import AppLayout from '../layout/Layout';

const ProductPlans = () => {
    return (
        <AppLayout typePage="customers" tabIndex="2">
            <Frame>
                <Page title='Products'>
                    <Card>
                        <Card.Section>
                            <div className="filter">
                                <Filters
                                    queryValue={queryValue}
                                    filters={filters}
                                    appliedFilters={appliedFilters}
                                    onQueryChange={handleFiltersQueryChange}
                                    onQueryClear={handleQueryValueRemove}
                                    onClearAll={handleFiltersClearAll}
                                />
                            </div>
                            <div className={"table customer-subscription-tbl" + " " + selectedTab}>
                                <DataTable
                                    columnContentTypes={[
                                        'text',
                                        'numeric',
                                        'numeric',
                                        'numeric',
                                        'numeric',
                                        'text',
                                        'text',
                                        'text'
                                    ]}
                                    headings={[
                                        'Id',
                                        'Name',
                                        'Date Created',
                                        'Next Billing Date',
                                        'Status',
                                        'Source',
                                        'Product',
                                        'Delivery Date',
                                        'Delivery Day',
                                        '',
                                        ''
                                    ]}
                                    rows={formatRows(filterCustomers)}
                                />
                            </div>
                            {loading && (
                                <Spinner />
                            )}
                            <div style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                                <Pagination
                                    hasPrevious={hasPrevious}
                                    onPrevious={() => {
                                        setPage((prev) => +prev - 1)
                                    }}
                                    hasNext={hasMore}
                                    onNext={() => {
                                        setPage((prev) => +prev + 1)
                                    }}
                                />
                            </div>
                        </Card.Section>
                    </Card>
                </Page>
            </Frame>
        </AppLayout>
    )
}

export default ProductPlans;