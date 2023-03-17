import React, { useState, useCallback, useEffect, useContext } from 'react';

import {
    Card,
    DisplayText,
    FormLayout,
    Layout,
    Select,
    TextStyle,
    Stack,
    Icon,
    Button,
    Toast,
} from '@shopify/polaris';
import { MobileBackArrowMajor } from '@shopify/polaris-icons';
import { gql, useQuery } from '@apollo/client';
import { DomainContext } from '../domain-context';
const SetLanguage = ({ handleBack }) => {
    const { domain } = useContext(DomainContext);
    const supportedLanguages = [
        { label: "English", value: "en" },
        { label: "French", value: "fr" }
    ]
    const [selectTimezone, setSelectTimezone] = useState();
    const [toastActive, setToastActive] = useState(false);
    const toggleToastActive = useCallback(() => setToastActive((toastActive) => !toastActive), []);

    useEffect(() => {
        fetch(`/settings/current_language?shopify_domain=${domain}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json())
            .then((data) => {
                setSelectTimezone(data?.language)
            })
    }, [])

    const updateTimezone = () => {
        fetch('/settings/change_language', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ language: selectTimezone, shopify_domain: domain }),
        }).then((response) => response.json())
            .then(() => {
                setToastActive(true)
            })
    }
    return (
        <div className="product-extention">
            {
                toastActive && (
                    <Toast content="Saved Successfully" onDismiss={toggleToastActive} />
                )
            }
            <Layout>
                <Layout.Section>
                    <div className="back-button pointer" onClick={handleBack}>
                        <Icon source={MobileBackArrowMajor} color="base" />
                        <p>
                            <TextStyle variation="subdued">Settings</TextStyle>
                        </p>
                    </div>
                </Layout.Section>
                <Card>
                    <Card.Section>
                        <div className="billing">
                            <FormLayout>
                                <DisplayText size="small" element="h6">
                                    <TextStyle variation="subdued">Timezone setting</TextStyle>
                                </DisplayText>
                                <Select
                                    label="Select Timezone"
                                    value={selectTimezone}
                                    onChange={(e) => setSelectTimezone(e)}
                                    options={supportedLanguages}
                                />
                                <div className='button'>
                                    <Button
                                        onClick={() => updateTimezone()}
                                    >Save</Button>
                                </div>
                            </FormLayout>
                        </div>
                    </Card.Section>
                </Card>
            </Layout>
        </div>
    );
};

export default SetLanguage;