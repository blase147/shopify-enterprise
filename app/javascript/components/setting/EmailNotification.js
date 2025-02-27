import React, { useState, useEffect, useCallback, Component } from 'react';
import AppLayout from '../layout/Layout';
import EmailNotificationDetails from './EmailNotificationDetails';
import {
  Card,
  Select,
  SettingToggle,
  TextStyle,
  Button,
  Layout,
  Stack,
  Heading,
  Icon,
} from '@shopify/polaris';
import { MobileBackArrowMajor } from '@shopify/polaris-icons';
import Switch from 'react-switch';
import PreviewEmail from './PreviewEmail';
const EmailNotification = (props) => {
  //SettingToggle
  const [active, setActive] = useState(false);

  const handleToggle = useCallback(() => setActive((active) => !active), []);

  const contentStatus = active ? 'Disable' : 'Enable';

  const [selectedSetting, setSelectedSetting] = useState(true);

  const handleSelectChangeSetting = useCallback(
    (value) => setSelectedSetting(value),
    []
  );
  const { values, touched, errors, setFieldValue, handleSubmit, handleBack, setUpdateSetting, setUpdateOneSetting } =
    props;
  const listAdditionalSetting = [
    {
      title: 'Send account invite after checkout',
      description:
        'Send Shopify account invite to customer after checkout if Shopify account not already active',
      onChange: (e) => setFieldValue('additionalSendAccountAfterCheckout', e),
      checked: values.additionalSendAccountAfterCheckout
        ? values.additionalSendAccountAfterCheckout
        : false,
      error:
        touched.additionalSendAccountAfterCheckout &&
        errors.additionalSendAccountAfterCheckout,
    },
    {
      title: 'BCC storeowner on all customer notifications',
      description: '',
      onChange: (e) => setFieldValue('bbcStoreowner', e),
      checked: values.bbcStoreowner ? values.bbcStoreowner : false,
      error: touched.bbcStoreowner && errors.bbcStoreowner,
    },
    {
      title: 'CC storeowner on all customer notifications',
      description: '',
      onChange: (e) => setFieldValue('ccStoreowner', e),
      checked: values.ccStoreowner ? values.ccStoreowner : false,
      error: touched.ccStoreowner && errors.ccStoreowner,
    },
    {
      title: 'Send Shopify receipt notification - overrides Shopify setting',
      description: '',
      onChange: (e) => setFieldValue('sendShopifyReceipt', e),
      checked: values.sendShopifyReceipt ? values.sendShopifyReceipt : false,
      error: touched.sendShopifyReceipt && errors.sendShopifyReceipt,
    },
    {
      title: 'Send fullfillment notification - overrides Shopify setting',
      description: '',
      onChange: (e) => setFieldValue('sendFullfillment', e),
      checked: values.sendFullfillment ? values.sendFullfillment : false,
      error: touched.sendFullfillment && errors.sendFullfillment,
    },
  ];
  const [selectedIndex, setSelectedIndex] = useState();
  useEffect(() => {
    if (selectedIndex) {
      console.log(selectedIndex);
    }
  }, [selectedIndex]);

  const emailOptions = [
    { label: 'Klaviyo', value: 'Klaviyo' },
    { label: 'SendGrid', value: 'SendGrid' },
  ];

  return (
    <Layout>
      <Layout.Section>
        <div className="back-button pointer" onClick={handleBack}>
          <Icon source={MobileBackArrowMajor} color="base" />
          <p>
            <TextStyle variation="subdued">Settings</TextStyle>
          </p>
        </div>
        {selectedIndex != null ? (
          <EmailNotificationDetails
            setFieldValue={setFieldValue}
            values={values}
            index={selectedIndex}
            touched={touched}
            errors={errors}
            setSelectedIndex={setSelectedIndex}
            handleSubmit={handleSubmit}
            setUpdateSetting={setUpdateSetting}
          />
        ) : (
          <div className={`${selectedIndex != null ? 'hidden' : ''}`}>
            {/* <Layout> */}
            <Card>
              <Card.Section>
                <Stack vertical>
                  <Stack.Item>
                    <Heading h4>
                      <TextStyle variation="subdued">
                        These emails are automatically sent out to either you (the
                        store owner) or the customer.
                      </TextStyle>
                    </Heading>
                  </Stack.Item>
                  <Stack.Item>
                    <Heading>Customer Notifications</Heading>
                  </Stack.Item>
                  <Select
                    label="Email Service"
                    options={emailOptions}
                    onChange={(value) => setFieldValue('emailService', value)}
                    value={values.emailService}
                  />
                  {values.emailNotifications?.map(
                    (item, i) =>
                      item.slug === 'customer' && (
                        <Stack.Item key={i}>
                          <Stack distribution="equalSpacing">
                            <Stack.Item>
                              <Button
                                plain
                                textAlign="left"
                                onClick={() => setSelectedIndex(i)}
                              >
                                <TextStyle variation="strong">
                                  <a>{item.name}</a>
                                </TextStyle>
                              </Button>
                              <br />
                              <TextStyle>{item.description}</TextStyle>
                            </Stack.Item>
                            <Stack.Item>
                              {item.status ? (
                                <Button
                                  primary
                                  onClick={() =>
                                    setFieldValue(
                                      `emailNotifications[${i}].status`,
                                      false
                                    )
                                  }
                                >
                                  Enabled
                                </Button>
                              ) : (
                                <Button
                                  onClick={() =>
                                    setFieldValue(
                                      `emailNotifications[${i}].status`,
                                      true
                                    )
                                  }
                                >
                                  Disabled
                                </Button>
                              )}
                            </Stack.Item>
                          </Stack>
                        </Stack.Item>
                      )
                  )}
                </Stack>
              </Card.Section>

              <Card.Section>
                <Stack vertical>
                  <Stack.Item>
                    <Heading>Store Owner Notifications</Heading>
                  </Stack.Item>
                  {values.emailNotifications?.map(
                    (item, i) =>
                      item.slug === 'store_owner' && (
                        <Stack.Item key={i}>
                          <Stack distribution="equalSpacing">
                            <Stack.Item>
                              <Button
                                plain
                                textAlign="left"
                                onClick={() => setSelectedIndex(i)}
                              >
                                <TextStyle variation="strong">
                                  <a>{item.name}</a>
                                </TextStyle>
                              </Button>
                              <br />
                              <TextStyle>{item.description}</TextStyle>
                            </Stack.Item>
                            <Stack.Item>
                              {item.status ? (
                                <Button
                                  primary
                                  onClick={() =>
                                    setFieldValue(
                                      `emailNotifications[${i}].status`,
                                      false
                                    )
                                  }
                                >
                                  Enabled
                                </Button>
                              ) : (
                                <Button
                                  onClick={() =>
                                    setFieldValue(
                                      `emailNotifications[${i}].status`,
                                      true
                                    )
                                  }
                                >
                                  Disabled
                                </Button>
                              )}
                            </Stack.Item>
                          </Stack>
                        </Stack.Item>
                      )
                  )}
                </Stack>
              </Card.Section>

              <Card.Section>
                <Stack vertical>
                  <Stack.Item>
                    <Heading>Additional Settings</Heading>
                  </Stack.Item>

                  {listAdditionalSetting?.map((item, i) => (
                    <Stack.Item key={i}>
                      <Stack distribution="equalSpacing">
                        <Stack.Item>
                          <TextStyle>{item.title}</TextStyle>

                          <br />
                          <TextStyle variation="subdued">
                            {item.description}
                          </TextStyle>
                        </Stack.Item>
                        <Stack.Item>
                          <div className="switch">
                            <Switch
                              onChange={item.onChange}
                              checked={item.checked}
                              error={item.error}
                              onColor="#86d3ff"
                              onHandleColor="#2693e6"
                              handleDiameter={30}
                              uncheckedIcon={false}
                              checkedIcon={false}
                              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                            />
                          </div>
                        </Stack.Item>
                      </Stack>
                    </Stack.Item>
                  ))}
                </Stack>
              </Card.Section>
            </Card>
            {/* </Layout> */}
          </div>
        )}
      </Layout.Section>
    </Layout>
  );
};
export default EmailNotification;
