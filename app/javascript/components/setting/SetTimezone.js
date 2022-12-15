import React, { useState, useCallback, useEffect } from 'react';

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
const SetTimezone = ({ handleBack }) => {

    const [timezones, setTimezones] = useState([]);
    const [selectTimezone, setSelectTimezone] = useState();
    const [toastActive, setToastActive] = useState(false);
    const toggleToastActive = useCallback(() => setToastActive((toastActive) => !toastActive), []);
    const GET_TIMEZONES = gql`
    query {
      fetchTimezone{
        allTimezones{
          label
          value
        }
        currentTimezone
      }
    }
  `;
    const { data, loading, error, refetch } = useQuery(GET_TIMEZONES, {
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        refetch();
    }, [])

    useEffect(() => {
        setTimezones(data?.fetchTimezone?.allTimezones)
        setSelectTimezone(data?.fetchTimezone?.currentTimezone)
    }, [data])

    console.log("timezones", timezones);

    const updateTimezone = () => {
        fetch('/settings/update_timezone', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ timezone: selectTimezone }),
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
                                    options={timezones?.length > 0 ? timezones : []}
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

export default SetTimezone;