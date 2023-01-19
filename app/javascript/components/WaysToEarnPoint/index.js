import { Badge, Banner, Button, ButtonGroup, Card, Frame, List, Page, ResourceItem, ResourceList, Stack, Toast } from '@shopify/polaris';
import React, { useCallback, useEffect, useState } from 'react';
import EditWaysToEarn from './EditWaysToEarn';
// import {
//     StoreMinor
// } from '@shopify/polaris-icons';
import { gql, useQuery } from '@apollo/client';
import LoadingScreen from '../LoadingScreen';
import { values } from 'lodash';
import AppLayout from '../layout/Layout';

const WaysToEarnPoint = () => {
    const [editForm, setEditForm] = useState(false);
    const [waysToEarn, setWaysToEarn] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [formErrors, setFormErrors] = useState([]);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);
    const [titleOptions, setTitleOptions] = useState([]);
    const [formData, setFormData] = useState({ id: '', title: '', pointsAwarded: "1", summary: '', status: true });
    const GET_DATA = gql`
        query {
            fetchWaysToEarnPoint {
                waysToEarn{
                    title
                    id
                    pointsAwarded
                    status
                    summary
                }
                allTitles
            }
        }
    `;

    const { data, loading, error, refetch } = useQuery(GET_DATA, {
        fetchPolicy: 'no-cache',
    });

    useEffect(() => {
        refetch();
    }, [])

    useEffect(() => {
        if (data?.fetchWaysToEarnPoint?.waysToEarn?.length > 0) {
            setWaysToEarn(data?.fetchWaysToEarnPoint?.waysToEarn)
        }
        if (data?.fetchWaysToEarnPoint?.allTitles) {
            let allTitles = JSON.parse(data?.fetchWaysToEarnPoint?.allTitles)
            let allTitleArr = []
            Object.keys(allTitles)?.map((k, v) => {
                allTitleArr.push({ label: `${k}`, value: `${k}` })
            })
            console.log("allTitle", allTitleArr, data?.fetchWaysToEarnPoint?.allTitles)
            setTitleOptions(allTitleArr)
        }
    }, [data])

    useEffect(() => {
        if (waysToEarn?.length > 0) {
            setRowData(waysToEarn)
        }
    }, [waysToEarn])

    return (
        <AppLayout typePage="waysToEarn" tabIndex="6">
            <Frame>
                {saveSuccess && (
                    <Toast
                        content="Ways To Earn Points is saved"
                        onDismiss={hideSaveSuccess}
                    />
                )}
                {formErrors.length > 0 && (
                    <>
                        <Banner
                            title="Ways To Earn Points could not be saved"
                            status="critical"
                        >
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
                    editForm ?
                        <EditWaysToEarn
                            setFormData={setFormData}
                            formData={formData}
                            refetch={refetch}
                            setEditForm={setEditForm}
                            formErrors={formErrors}
                            setFormErrors={setFormErrors}
                            saveSuccess={saveSuccess}
                            setSaveSuccess={setSaveSuccess}
                            titleOptions={titleOptions}
                        />
                        :
                        loading ?
                            <LoadingScreen />
                            :

                            <Page
                                title='Actions'
                                primaryAction={
                                    <ButtonGroup>
                                        <Button onClick={() => {
                                            setFormData({ id: '', title: titleOptions[0]?.value, pointsAwarded: "1", summary: '', status: true });
                                            setEditForm(true);
                                        }}>
                                            Add Ways To Earn
                                        </Button>
                                    </ButtonGroup>
                                }>
                                <Card>
                                    <Card.Section>
                                        <ResourceList
                                            items={rowData}
                                            renderItem={(item) => {
                                                const { id, title, pointsAwarded, status, summary } = item;
                                                return (
                                                    <ResourceItem
                                                        id={id}
                                                    >
                                                        <Stack distribution="fillEvenly">
                                                            {/* <Icon
                                                source={StoreMinor}
                                                color="base"
                                            /> */}
                                                            <Stack.Item fill={true}>{id}</Stack.Item>
                                                            <Stack.Item fill={true}>
                                                                {title}
                                                            </Stack.Item>
                                                            <Stack.Item fill={true}>
                                                                {status ? <Badge status="success">Active</Badge> : <Badge >Disabled</Badge>}
                                                            </Stack.Item>

                                                            <Stack.Item fill={true}>{pointsAwarded}</Stack.Item>
                                                            <Stack.Item fill={true}>
                                                                <ul>
                                                                    <li>
                                                                        {summary}
                                                                    </li>
                                                                </ul>
                                                            </Stack.Item>
                                                            <Stack.Item fill={true}>
                                                                <Button
                                                                    primary
                                                                    onClick={() => {
                                                                        setFormData({ id: id, title: title, pointsAwarded: pointsAwarded, summary: summary, status: status });
                                                                        setEditForm(true);
                                                                    }}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </Stack.Item>
                                                        </Stack>
                                                    </ResourceItem>
                                                );
                                            }}
                                        />
                                    </Card.Section>
                                </Card>
                            </Page>
                }
            </Frame>
        </AppLayout>
    )
}

export default WaysToEarnPoint;