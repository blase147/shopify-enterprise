import { gql, useMutation } from '@apollo/client';
import { Card, Toast, ChoiceList, Page, PageActions, TextField, Layout, Banner, List, Frame, Select, RadioButton } from '@shopify/polaris';
import React, { useCallback, useEffect, useState } from 'react';

const ReferralsForm = ({ formData, setFormData, setEditForm, refetch, formErrors, setFormErrors, saveSuccess, setSaveSuccess }) => {
    const [icon, setIcon] = useState();
    const [defaultIcon, setDefaultIcon] = useState('true');
    const [fieldError, setFieldError] = useState({ title: '', reward_value: '' });

    const ADD_REFERRAL_REWARD = gql`
        mutation($input: AddReferralRewardInput!) {
            addReferralReward(input: $input) {
                referralReward{
                    id
                    rewardType
                    rewardValue
                    appliesToCollection
                    minimumPurchasedAmount
                    discountCodePrefix
                    rewardExpiry
                }
            
            }
        }
    `;
    const [addReferralReward] = useMutation(ADD_REFERRAL_REWARD);

    const handleSubmit = () => {
        addReferralReward({
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
                    setEditForm(false);
                }
            })
            .catch((error) => {
                setFormErrors(error);
            });
    }
    const [summaryText, setSummaryText] = useState([]);
    useEffect(() => {
        let summary = [];
        if (formData?.reward_type == "amount") {
            summary.push(`$${formData?.reward_value} off entire order`)
            summary.push('Applies to orders of any amount ')
        } else if (formData?.reward_type == "percentage") {
            summary.push(`${formData?.reward_value}% off entire order`)
            summary.push('Applies to orders of any amount ')
        } else if (formData?.reward_type == "points") {
            summary.push(`Customers will be rewarded ${formData?.reward_value} points`)
        }
        setSummaryText(summary);
        setFormData({ ...formData, summary: summary })
    }, [formData?.title, formData?.reward_value])

    console.log("formData?.reward_value", formData?.reward_value);

    const renderTextField = () => {
        return (
            <>
                {
                    formData?.reward_type == "amount" ?
                        <TextField
                            label="Reward value"
                            type="number"
                            value={`${formData?.reward_value}`}
                            onChange={(e) => {
                                if (e.length > 0 && +e <= 0) {
                                    setFieldError({ ...fieldError, reward_value: "Value must be greater than 0" })
                                    setFormData({ ...formData, reward_value: "1" })
                                } else {
                                    setFieldError({ ...fieldError, reward_value: '' })
                                    setFormData({ ...formData, reward_value: `${e}` })
                                }
                            }}
                            prefix="$"
                            error={fieldError?.reward_value}
                            autoComplete="off"
                        />
                        :
                        formData?.reward_type == "percentage" ?
                            <TextField
                                label="Reward value"
                                type="number"
                                value={`${formData?.reward_value}`}
                                onChange={(e) => {
                                    if (e.length > 0 && +e <= 0) {
                                        setFieldError({ ...fieldError, reward_value: "Value must be greater than 0" })
                                        setFormData({ ...formData, reward_value: "1" })
                                    } else {
                                        setFieldError({ ...fieldError, reward_value: '' })
                                        setFormData({ ...formData, reward_value: `${e}` })
                                    }
                                }}
                                suffix="% off"
                                error={fieldError?.reward_value}
                                autoComplete="off"
                            />
                            :
                            <TextField
                                label="Points value"
                                type="number"
                                value={`${formData?.reward_value}`}
                                onChange={(e) => {
                                    if (e.length > 0 && +e <= 0) {
                                        setFieldError({ ...fieldError, reward_value: "Points amount must be greater than 0" })
                                        setFormData({ ...formData, reward_value: "1" })
                                    } else {
                                        setFieldError({ ...fieldError, reward_value: '' })
                                        setFormData({ ...formData, reward_value: `${e}` })
                                    }
                                }}
                                error={fieldError?.reward_value}
                                autoComplete="off"
                            />


                }
            </>
        )
    }

    const handleAppliesChange = () => {

    }
    return (
        <Frame>
            <Page
                title="Edit"
            >
                <Layout>
                    <Layout.Section>
                        <Card title="Reward value" sectioned>
                            <div className='earningValues'>
                                {renderTextField}
                            </div>
                        </Card>
                        {
                            formData?.reward_type != "points" && (
                                <>
                                    <Card title="Applies to" sectioned>
                                        <div className='appliesTo'>
                                            <RadioButton
                                                label="Entire order"
                                                checked={'disabled'}
                                                id="disabled"
                                                name="applies_to_collection"
                                                onChange={() => handleAppliesChange()}
                                            />
                                            <RadioButton
                                                label="Specific collection"
                                                checked={'disabled'}
                                                id="disabled"
                                                name="applies_to_collection"
                                                onChange={() => handleAppliesChange()}
                                            />
                                        </div>
                                    </Card>
                                    <Card title="Minimum requirement" sectioned>
                                        <div className='appliesTo'>
                                            <RadioButton
                                                label="None"
                                                checked={'disabled'}
                                                id="disabled"
                                                name="applies_to_collection"
                                                onChange={() => handleAppliesChange()}
                                            />
                                            <RadioButton
                                                label="Minimum purchase amount"
                                                checked={'disabled'}
                                                id="disabled"
                                                name="applies_to_collection"
                                                onChange={() => handleAppliesChange()}
                                            />
                                        </div>
                                    </Card>
                                </>

                            )
                        }
                    </Layout.Section>
                    <Layout.Section secondary>
                        <Card title="Summary">
                            <Card.Section>
                                <List type="bullet">
                                    {
                                        summaryText?.map((val) => {
                                            return (
                                                < List.Item >
                                                    {val}
                                                </List.Item>
                                            )
                                        })
                                    }
                                </List>
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
        </Frame >
    )
}

export default ReferralsForm;