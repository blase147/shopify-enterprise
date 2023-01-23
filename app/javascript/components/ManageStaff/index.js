import { gql, useQuery } from '@apollo/client';
import { Banner, Button, Layout, Page, Pagination, Spinner, Frame, Toast, Checkbox, Card, DataTable, Filters, ButtonGroup, List } from '@shopify/polaris';
import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../layout/Layout';
import NewStaff from './NewStaff';

const ManageStaff = () => {
    const [formErrors, setFormErrors] = useState([]);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [staffMembers, setStaffMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [addStaff, setAddStaff] = useState(false);
    const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);
    const handleQueryValueRemove = useCallback(() => setSearchQuery(null), []);
    const handleFiltersClearAll = useCallback(() => {
        setSearchQuery();
    }, [searchQuery]);

    const GET_STAFF = gql`
    query($page: String, $searchquery: String) {
        fetchStaffMembers(page: $page, searchquery: $searchquery) {
            staffMembers{
                id
                name
                firstName
                lastName
                email
                createdAt
                dashboardAccess
                mangePlanAccess
                subscriptionsOrdersAccess
                analyticsAccess
                installationAccess
                tiazensAccess
                toolboxAccess
                settingsAccess                
            }
            totalCount
            totalPages
            pageNumber
        }
    }
  `;
    const { data, loading, error, refetch } = useQuery(GET_STAFF, {
        fetchPolicy: 'no-cache',
        variables: {
            page: page.toString(),
            searchquery: searchQuery
        },

    });

    useEffect(() => {
        if (searchQuery) {
            refetch({
                variables: {
                    page: page.toString(),
                    searchquery: searchQuery,
                }
            });
        } else {
            refetch({
                variables: {
                    page: page.toString(),
                }
            });
        }
        setTotalPages(data?.fetchStaffMembers?.totalPages)
        setStaffMembers(data?.fetchStaffMembers?.staffMembers)
    }, [page, searchQuery]);

    //search staff
    const handleFiltersQueryChange = (value) => {
        console.log("fsdafdsafdfwe", value, value.length);
        setSearchQuery(value)
    }

    //set pagination
    useEffect(() => {
        setStaffMembers(data?.fetchStaffMembers?.staffMembers)
        setTotalPages(data?.fetchStaffMembers?.totalPages)
        if (+page < +totalPages) {
            setHasMore(true);
        }
        else {
            setHasMore(false)
        }
        if (+page <= 1) {
            setHasPrevious(false)
        }
        else {
            setHasPrevious(true)
        }
    }, [data]);

    const formatRows = (rows) => {
        return rows?.map((row) => {
            return row?.id !== null ?
                [
                    <Checkbox
                        label={row.id}
                    />,
                    `${row.firstName} ${row.lastName}`,
                    row?.email,
                    row?.createdAt,
                    row?.dashboardAccess,
                    row?.mangePlanAccess,
                    row?.subscriptionsOrdersAccess,
                    row?.analyticsAccess,
                    row?.installationAccess,
                    row?.tiazensAccess,
                    row?.toolboxAccess,
                    row?.settingsAccess,
                ] : []
        });
    };

    return (
        <>
            <>
                <Frame>
                    {saveSuccess && (
                        <Toast
                            content="Staff data has been saved successfully"
                            onDismiss={hideSaveSuccess}
                        />
                    )}

                    {formErrors.length > 0 && (
                        <>
                            <Banner title="Staff data has not been saved" status="critical">
                                <List type="bullet">
                                    {formErrors.map((message, index) => (
                                        <List.Item key={index}>{message.message}</List.Item>
                                    ))}
                                </List>
                            </Banner>
                            <br />
                        </>
                    )}
                    {
                        addStaff ?
                            <NewStaff setFormErrors={setFormErrors} setSaveSuccess={setSaveSuccess} refetch={refetch} setAddStaff={setAddStaff} /> :
                            <Page
                                title="Manage Staff"
                                primaryAction={
                                    <ButtonGroup>
                                        <Button onClick={() => { setAddStaff(true) }}>Add a New Staff Member</Button>
                                    </ButtonGroup>
                                }
                            >
                                <Card>
                                    <Card.Section>
                                        <div className="filter">
                                            {/* <Filters
                                        queryValue={searchQuery}
                                        onQueryChange={handleFiltersQueryChange}
                                        onQueryClear={handleQueryValueRemove}
                                        onClearAll={handleFiltersClearAll}
                                    /> */}
                                        </div>
                                        <div className={"table customer-subscription-tbl"}>
                                            <DataTable
                                                columnContentTypes={[
                                                    'text',
                                                    'numeric',
                                                    'numeric',
                                                    'numeric',
                                                    'numeric',
                                                    'text',
                                                    'text',
                                                    'text',
                                                    'text'
                                                ]}
                                                headings={[
                                                    'ID',
                                                    'Name',
                                                    'Email',
                                                    'Date Created',
                                                    'DashBoard Access',
                                                    'Mange Plan Access',
                                                    'Subscriptions Orders Access',
                                                    'Analytics Access',
                                                    'Installation Access',
                                                    'Tiazen Access',
                                                    'ToolBox Access',
                                                    'Settings Access'
                                                ]}
                                                rows={staffMembers?.length > 0 ? formatRows(staffMembers) : []}
                                            />
                                        </div>
                                        {loading && (
                                            <Spinner
                                                accessibilityLabel="Spinner example"
                                                size="large"
                                                color="teal"
                                            />
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
                    }
                </Frame>
            </>
        </>
    )
}

export default ManageStaff;