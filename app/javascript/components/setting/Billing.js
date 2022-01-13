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

  const day_of_production_options = [
    { label: 'Sunday', value: 'sunday' },
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },

  ];

  const delivery_interval_after_production_options = [
    { label: '1 business day', value: '1 business day' },
    { label: '2 business days', value: '2 business days' },
    { label: '3 business days', value: '3 business days' },
    { label: '4 business days', value: '4 business days' },
    { label: '5 business days', value: '5 business days' },
  ];

  const eligible_weekdays_for_delivery_options = [
    { label: 'Every weekday', value: 'Every weekday' },
    { label: 'Only business days', value: 'only business days' },
    { label: 'Monday to thursday', value: 'monday to thursday' },
    { label: 'Tuesday to Friday', value: 'tuesday to friday' },
    { label: 'Tuesday to thursday', value: 'tuesday to thursday' },
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

              <Select
                label="day of production options"
                value={values.dayOfProduction}
                error={touched.dayOfProduction && errors.dayOfProduction}
                onChange={(e) => setFieldValue('dayOfProduction', e)}
                options={day_of_production_options}
              />

              <TextStyle variation="subdued">
              delivery interval after production options
              </TextStyle>

              <Select
                label="delivery interval after production options"
                value={values.deliveryIntervalAfterProduction}
                error={touched.deliveryIntervalAfterProduction && errors.deliveryIntervalAfterProduction}
                onChange={(e) => setFieldValue('deliveryIntervalAfterProduction', e)}
                options={delivery_interval_after_production_options}
              />

              <TextStyle variation="subdued">
              eligible weekdays for delivery options
              </TextStyle>

              <Select
                label="eligible weekdays for delivery options"
                value={values.eligibleWeekdaysForDelivery}
                error={touched.eligibleWeekdaysForDelivery && errors.eligibleWeekdaysForDelivery}
                onChange={(e) => setFieldValue('eligibleWeekdaysForDelivery', e)}
                options={eligible_weekdays_for_delivery_options}
              />
            </FormLayout>
          </div>
        </Card.Section>
      </Card>
    </Layout>
  );
};
export default Billing;
