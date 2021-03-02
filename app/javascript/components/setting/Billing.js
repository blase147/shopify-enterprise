import React, { useState, useCallback, useEffect } from 'react';

import {
  Card,
  DisplayText,
  FormLayout,
  Layout,
  Select,
  TextStyle,
} from '@shopify/polaris';

const Billing = (props) => {
  const [selectedRetry, setSelectedRetry] = useState('3times');
  const [selectedDelay, setSelectedDelay] = useState('1day');

  const handleSelectChangeRetry = useCallback(
    (value) => setSelectedRetry(value),
    []
  );
  const handleSelectChangeDelay = useCallback(
    (value) => setSelectedDelay(value),
    []
  );

  const options_retry = [
    { label: '3 Times', value: '3' },
    { label: '4 Times', value: '4' },
    { label: '5 Times', value: '5' },
  ];

  const options_delay = [
    { label: '1 Day', value: '1' },
    { label: '2 Day', value: '2' },
    { label: '3 Day', value: '3' },
  ];

  const { values, touched, errors, setFieldValue } = props;

  return (
    <Layout>
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
            </FormLayout>
          </div>
        </Card.Section>
      </Card>
    </Layout>
  );
};
export default Billing;
