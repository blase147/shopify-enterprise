import React, { useState, useCallback, useEffect } from 'react';
import { MobileBackArrowMajor } from '@shopify/polaris-icons';
import {
  Card,
  DisplayText,
  FormLayout,
  Icon,
  Layout,
  Select,
  Stack,
  TextStyle,
} from '@shopify/polaris';

const Billing = (props) => {
  const options_retry = [
    { label: '3 Times', value: '3' },
    { label: '4 Times', value: '4' },
    { label: '5 Times', value: '5' },
  ];

  const options_delay = [
    { label: '1 Day', value: '1' },
    { label: '2 Days', value: '2' },
    { label: '3 Days', value: '3' },
  ];

  const options_strategy = [
    { label: 'Cancel Subscription', value: 'cancel' },
    { label: 'Pause Subscription', value: 'pause' },
    { label: 'Skip Failed Order', value: 'skip' },
  ];

  const order_cancel_options = [
    { label: 'Do Nothing', value: 'do nothing' },
    { label: 'Cancel Subscription', value: 'Cancel Subscription' },
    { label: 'Email to admin', value: 'Email to admin' },
  ];



  const { values, touched, errors, setFieldValue, handleBack } = props;

  return (
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
                <TextStyle variation="subdued">
                  Control how to bill your customers
                </TextStyle>
              </DisplayText>
              <Select
                label="Retry failed payments"
                value={values.paymentRetries}
                error={touched.paymentRetries && errors.paymentRetries}
                onChange={(e) => setFieldValue('paymentRetries', e)}
                options={options_retry}
              />
              <TextStyle variation="subdued">
                The number of times to retry a failed payment before the
                subscription is cancelled
              </TextStyle>

              <Select
                label="Delay before retrying a failed payment"
                value={values.paymentDelayRetries}
                error={
                  touched.paymentDelayRetries && errors.paymentDelayRetries
                }
                onChange={(e) => setFieldValue('paymentDelayRetries', e)}
                options={options_delay}
              />
              <TextStyle variation="subdued">
                Specify the interval after which you want to retry card charge.
              </TextStyle>

              <Select
                label="If a card charge fails after max tries"
                value={values.maxFailStrategy}
                error={touched.maxFailStrategy && errors.maxFailStrategy}
                onChange={(e) => setFieldValue('maxFailStrategy', e)}
                options={options_strategy}
              />

              <TextStyle variation="subdued">
                Order Cancelation Options
              </TextStyle>

              <Select
                label="Order Cancelation Options"
                value={values.orderCancelOption}
                error={touched.orderCancelOption && errors.orderCancelOption}
                onChange={(e) => setFieldValue('orderCancelOption', e)}
                options={order_cancel_options}
              />

              <TextStyle variation="subdued">
              day of production options
              </TextStyle>


            </FormLayout>
          </div>
        </Card.Section>
      </Card>
    </Layout>
  );
};
export default Billing;
