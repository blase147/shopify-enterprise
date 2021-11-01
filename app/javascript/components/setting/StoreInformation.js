import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import AppLayout from '../layout/Layout';
import {
  Card,
  Select,
  TextField,
  ButtonGroup,
  Button,
  Badge,
  Layout,
  Heading,
  FormLayout,
  TextStyle,
  Stack,
  DisplayText,
  Link,
  Icon,
} from '@shopify/polaris';
import { MobileBackArrowMajor } from '@shopify/polaris-icons';
const StoreInformation = (props) => {
  const { values, touched, errors, setFieldValue, handleBack } = props;
  return (
    <>
      <Layout.Section>
        <div className="back-button pointer" onClick={handleBack}>
          <Icon source={MobileBackArrowMajor} color="base" />
          <p>
            <TextStyle variation="subdued">Settings</TextStyle>
          </p>
        </div>
      </Layout.Section>
      <div className="storeInfomation">
        <Layout>
          <div className="container-left">
            <Card.Section>
              <Stack vertical>
                <Heading>Store Information</Heading>
                <FormLayout>
                  <TextField
                    label="Store Name"
                    value={values.storeName}
                    error={touched.storeName && errors.storeName}
                    onChange={(e) => setFieldValue('storeName', e)}
                    name="store_name"
                  />
                  <TextField
                    label="Store Email"
                    value={values.storeEmail}
                    error={touched.storeEmail && errors.storeEmail}
                    onChange={(e) => setFieldValue('storeEmail', e)}
                    inputMode="email"
                    name="store_email"
                  />
                  <TextField
                    label="Storefront Password"
                    value={values.storefrontPassword}
                    error={
                      touched.storefrontPassword && errors.storefrontPassword
                    }
                    onChange={(e) => setFieldValue('storefrontPassword', e)}
                    name="storefront_password"
                  />
                </FormLayout>
              </Stack>
            </Card.Section>
            <Card.Section>
              <Stack vertical>
                <Stack.Item>
                  <Heading>Billing</Heading>
                </Stack.Item>
                <Stack.Item>
                  <TextStyle variation="strong">Card on file</TextStyle>
                </Stack.Item>
                <Stack.Item>
                  <p>Visa Card ending 2544 </p>
                  <p>Expires in 8/2024</p>
                </Stack.Item>
                <Stack.Item>
                  <p>Card holder</p>
                </Stack.Item>
                <Stack.Item>
                  <p></p>
                </Stack.Item>
                <ButtonGroup>
                  <Button primary>Update Billing</Button>
                  <div className="btn-changes">
                    <Button>Save Changes</Button>
                  </div>
                </ButtonGroup>
              </Stack>
            </Card.Section>
          </div>

          <div className="container-right">
            <Card.Section>
              <Stack vertical spacing="extraTight">
                <Stack.Item>
                  <Heading h3>Account Status</Heading>
                </Stack.Item>
                <Stack.Item>
                  <TextStyle variation="strong">Platform</TextStyle>
                  <p>Shopify</p>
                </Stack.Item>
                <Stack.Item>
                  <TextStyle variation="strong">Installation Status</TextStyle>
                  <br />
                  <Badge status="success">Installed</Badge>
                </Stack.Item>
                <Stack.Item>
                  <TextStyle variation="strong">Billing Status</TextStyle>
                  <br />
                  <Badge status="success">Active</Badge>
                </Stack.Item>
                <Stack.Item>
                  <TextStyle variation="strong">
                    Recurring Processing Status
                  </TextStyle>
                  <br />
                  <Badge
                    status={`${
                      values.recurringChargeStatus ? 'success' : 'attention'
                    }`}
                  >
                    {_.capitalize(values.recurringChargeStatus) || 'Pending'}
                  </Badge>
                </Stack.Item>
                <Stack.Item>
                  <TextStyle variation="strong">
                    Plan Name
                  </TextStyle>
                  <br />
                  <Badge
                    status={`${
                      values.plan == 'platinum' ? 'success' : 'info'
                    }`}
                  >
                    {_.capitalize(values.plan) || 'Pending'}
                  </Badge>
                </Stack.Item>
                <Stack.Item>
                  <TextStyle variation="strong">
                    Subscription Widget Status
                  </TextStyle>
                  <br />
                  <Badge status="warning">Unpublished</Badge>
                </Stack.Item>
                <Stack.Item>
                  {values.chargeConfirmationLink && (
                    <Button fullWidth disabled={!values.chargeConfirmationLink}>
                      <Link
                        external={true}
                        url={values.chargeConfirmationLink || '#'}
                      >
                        Confirm Recurring Payment
                      </Link>
                    </Button>
                  )}
                </Stack.Item>
                <Stack.Item>
                  <Button fullWidth>Cancel my Account</Button>
                </Stack.Item>
              </Stack>
            </Card.Section>
            <Card.Section>
              <Stack vertical>
                <Heading h3>Last Invoice</Heading>
                <p>Standard Plan</p>
                <DisplayText size="large">255.35</DisplayText>
                <Button fullWidth>See all invoices</Button>
              </Stack>
            </Card.Section>
          </div>
        </Layout>
      </div>
    </>
  );
};
export default StoreInformation;
