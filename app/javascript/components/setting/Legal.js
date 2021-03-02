import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '../layout/Layout';
import {
  Card,
  Select,
  TextField,
  ButtonGroup,
  Button,
  Badge,
  Link,
  Layout,
  Stack,
  Heading,
  TextStyle,
} from '@shopify/polaris';

const Legal = (props) => {
  const template = `body {color: #666666;background: #ffffff;font-family: 'Roboto', sans-serif;font-weight: 400;}h1,h2, h3, h4,h5, h6 {font-family: 'EB Garamond', serif;font-weight: 600;font-style: italic;color: #121518;}a {color: #454545;transition: .3s;}`;
  const { values, touched, errors, setFieldValue } = props;
  return (
    <Layout>
      <div className="container-left">
        <Card.Section>
          <Stack vertical>
            <Stack.Item>
              <Heading>Checkout Subscription terms</Heading>
            </Stack.Item>
            <Stack.Item>
              <p>
                These terms will display for your customers before they complete
                their checkout
              </p>
            </Stack.Item>
            <Stack.Item>
              <TextField
                placeholder="Add Legal text here"
                value={
                  values.checkoutSubscriptionTerms
                    ? values.checkoutSubscriptionTerms
                    : ''
                }
                error={
                  touched.checkoutSubscriptionTerms &&
                  errors.checkoutSubscriptionTerms
                }
                onChange={(e) => setFieldValue('checkoutSubscriptionTerms', e)}
                multiline={6}
              />
            </Stack.Item>
            <Stack.Item>
              <Button
                primary
                onClick={() =>
                  setFieldValue(`checkoutSubscriptionTerms`, template)
                }
              >
                Create from template
              </Button>
            </Stack.Item>
          </Stack>
        </Card.Section>
        <Card.Section>
          <Stack vertical>
            <Heading>Email Subscription terms</Heading>
            <p>
              These terms will display in the footer of your subscription email
            </p>
            <TextField
              placeholder="Add Legal text here"
              value={
                values.emailSubscriptionTerms
                  ? values.emailSubscriptionTerms
                  : ''
              }
              error={
                touched.emailSubscriptionTerms && errors.emailSubscriptionTerms
              }
              onChange={(e) => setFieldValue('emailSubscriptionTerms', e)}
              multiline={6}
            />
            <Button
              primary
              onClick={() => setFieldValue(`emailSubscriptionTerms`, template)}
            >
              Create from template
            </Button>
          </Stack>
        </Card.Section>
        <Card.Section>
          <Stack vertical>
            <Heading>Apple Pay Subscription terms</Heading>
            <p>
              These terms will display at checkout for customers who complete
              their purchases using Apple Pay
            </p>
            <TextField
              placeholder="Add Legal text here"
              value={
                values.applePaySubscriptionTerms
                  ? values.applePaySubscriptionTerms
                  : ''
              }
              error={
                touched.applePaySubscriptionTerms &&
                errors.applePaySubscriptionTerms
              }
              onChange={(e) => setFieldValue('applePaySubscriptionTerms', e)}
              multiline={6}
            />
            <Button
              primary
              onClick={() =>
                setFieldValue(`applePaySubscriptionTerms`, template)
              }
            >
              Create from template
            </Button>
          </Stack>
        </Card.Section>

        {/* <Card.Section>
          <ButtonGroup>
            <Button primary>Update Billing</Button>
            <Button>Save Changes</Button>
          </ButtonGroup>
        </Card.Section> */}
      </div>
      <div className="container-right">
        <Card.Section>
          <Stack vertical>
            <Heading h4>Frequently Asked Questions</Heading>
            <TextStyle variation="strong">
              How will these terms be displayed for my customers?
            </TextStyle>
            <div>
              Please consult our help article.{' '}
              <Button plain monochrome>
                Click here
              </Button>
            </div>
            <TextStyle variation="strong">
              What are the legal requirements for my store?
            </TextStyle>
            <p>
              Laws vary by state. Please consult with your attorney to ensure
              compliance
            </p>
          </Stack>
        </Card.Section>
      </div>
    </Layout>
  );
};
export default Legal;
