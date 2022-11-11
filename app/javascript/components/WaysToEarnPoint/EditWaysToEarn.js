import { gql, useMutation } from '@apollo/client';
import { Card, Toast, ChoiceList, Page, PageActions, TextField, Layout, Banner, List, Frame, Select } from '@shopify/polaris';
import React, { useCallback, useState } from 'react';

const EditWaysToEarn = ({ formData, setFormData, setEditForm, refetch, formErrors, setFormErrors, saveSuccess, setSaveSuccess, titleOptions }) => {
    const [icon, setIcon] = useState();
    const [defaultIcon, setDefaultIcon] = useState('true');
    const [fieldError, setFieldError] = useState({ title: '', pointsAwarded: '' });

    const ADD_WAYS_TO_EARN = gql`
        mutation($input: AddWaysToEarnPointsInput!) {
            addWaysToEarnPoints(input: $input) {
                waysToEarnPoints{
                    id
                }
            
            }
        }
    `;
    const [addWaysToEarn] = useMutation(ADD_WAYS_TO_EARN);

    const handleSubmit = () => {
        addWaysToEarn({
            variables: {
                input: { params: formData },
            },
        })
            .then((resp) => {
                const data = resp.data;
                const errors = data.errors;

                if (errors) {
                    setFormErrors(errors);
                } else {
                    setSaveSuccess(true);
                    refetch();
                    setEditForm(false);
                }
            })
            .catch((error) => {
                setFormErrors(error);
            });
    }
    return (
        <Frame>
            <Page
                title="Edit"
            >
                <Layout>
                    <Layout.Section>
                        <Card title="Earning value" sectioned>
                            <div className='earningValues'>
                                <Select
                                    label="Title"
                                    options={titleOptions}
                                    onChange={(e) => { setFormData({ ...formData, title: e }) }}
                                    value={formData?.title}
                                />
                                <TextField
                                    label={
                                        (formData?.title == "Place an Order") ? (
                                            <div className='order_summary'>
                                                Customers earn {formData?.pointsAwarded} points for every $1 spent
                                            </div>
                                        )
                                            :
                                            "Points awarded"
                                    }
                                    type="number"
                                    value={formData?.pointsAwarded}
                                    onChange={(e) => {
                                        if (e.length > 0 && e <= 0) {
                                            setFieldError({ ...fieldError, pointsAwarded: "Points amount must be greater than 0" })
                                            setFormData({ ...formData, pointsAwarded: 1 })
                                        } else {
                                            setFieldError({ ...fieldError, pointsAwarded: '' })
                                            setFormData({ ...formData, pointsAwarded: e })
                                        }
                                    }}
                                    error={fieldError?.pointsAwarded}
                                    autoComplete="off"
                                />
                            </div>
                        </Card>
                    </Layout.Section>
                    <Layout.Section secondary>
                        <Card title="Summary">
                            <Card.Section>
                                <TextField
                                    multiline={2}
                                    value={formData?.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e })}
                                    autoComplete="off"
                                />
                            </Card.Section>
                            <Card.Section subdued title="STATUS">
                                <ChoiceList
                                    title=""
                                    choices={[
                                        { label: 'Active', value: true },
                                        { label: 'Disabled', value: false },
                                    ]}
                                    selected={[formData?.status]}
                                    onChange={(e) => setFormData({ ...formData, status: e[0] })}
                                />
                            </Card.Section>
                        </Card>
                        <Card title="Icon" sectioned>
                            <ChoiceList
                                title=""
                                choices={[
                                    { label: 'Default', value: true },
                                    { label: 'Upload your own', value: false },
                                ]}
                                selected={[defaultIcon]}
                                onChange={(e) => setDefaultIcon(e)}
                            />
                        </Card>
                    </Layout.Section>
                    <Layout.Section>
                        <PageActions
                            primaryAction={{
                                content: 'Save',
                                onClick: () => handleSubmit()
                            }}
                            secondaryActions={[
                                {
                                    content: 'Delete',
                                    destructive: true,
                                },
                            ]}
                        />
                    </Layout.Section>
                </Layout>
            </Page>
        </Frame>
    )
}

export default EditWaysToEarn;