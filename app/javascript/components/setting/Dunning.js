import React, { useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '../layout/Layout';
import {
  Card,
  Select,
  ExceptionList,
  Button,
  Icon,
  Modal,
  TextField,
  Heading,
  Stack,
  TextStyle,
  Banner,
  Layout,
  FormLayout,
} from '@shopify/polaris';
import { FlagMajor, ChevronDownMinor } from '@shopify/polaris-icons';
import Switch from 'react-switch';

const Dunning = (props) => {
  const [
    selectedActiveDunningWallet,
    setSelectedActiveDunningWallet,
  ] = useState(true);

  const handleSelectChangeActiveDunningWallet = useCallback(
    (value) => setSelectedActiveDunningWallet(value),
    []
  );

  const [activeApply1, setActiveApply1] = useState(-1);
  const button = useRef();
  const handleOpenApply1 = useCallback((i) => setActiveApply1(i), []);
  const handleCloseApply1 = useCallback(() => {
    setActiveApply1(-1);
    requestAnimationFrame(() => button.current.querySelector('button').focus());
  }, []);

  const [activeApply2, setActiveApply2] = useState(-1);
  // const button = useRef();
  const handleOpenApply2 = useCallback((i) => setActiveApply2(i), []);
  const handleCloseApply2 = useCallback(() => {
    setActiveApply2(-1);
    requestAnimationFrame(() => button.current.querySelector('button').focus());
  }, []);

  const [activeApply3, setActiveApply3] = useState(-1);
  // const button = useRef();
  const handleOpenApply3 = useCallback((i) => setActiveApply3(i), []);
  const handleCloseApply3 = useCallback(() => {
    setActiveApply3(-1);
    requestAnimationFrame(() => button.current.querySelector('button').focus());
  }, []);

  const { values, touched, errors, setFieldValue } = props;
  const listDunningpayment1 = [
    {
      title: 'Dunning period',
      content:
        "Configure how you'd like Chargebee to retry payment collection for customers who pay via Debit Cards, Credit Cards, PayPal, etc.",

      value: values.dunningPeriod ? values.dunningPeriod : '9',
      error: touched.dunningPeriod && errors.dunningPeriod,
      onChange: (e) => setFieldValue('dunningPeriod', e),
    },
    {
      title: 'Choose automatic retry mode',
      content:
        'ChargeZen uses preconfigured rules to automatically retry payment collection based on the dunning period. Choose Custom, if you want to customize the frequency of retries.',

      value: values.chooseAutomaticRetryMode
        ? values.chooseAutomaticRetryMode
        : 'none',
      error:
        touched.chooseAutomaticRetryMode && errors.chooseAutomaticRetryMode,
      onChange: (e) => setFieldValue('chooseAutomaticRetryMode', e),
    },
    {
      title: 'Retry frequency',
      content:
        'Specify the intervals after which you want to retry payment collection. For example, if you specify 1, 4, 9, then payment collection will be retried after 1, 4, and 9 days from the invoice due date.',

      value: values.retryFrequency ? values.retryFrequency : 'none',
      error: touched.retryFrequency && errors.retryFrequency,
      onChange: (e) => setFieldValue('retryFrequency', e),
    },
    {
      title: 'When dunning period ends, what happens to subscriptions?',
      content:
        'Final action to be taken at the end of the dunning period, if invoice is unpaid. This is applicable for recurring invoices only.',
      // value: 'Retain as Active',

      value: values.happensToSubscriptions
        ? values.happensToSubscriptions
        : 'none',
      error: touched.happensToSubscriptions && errors.happensToSubscriptions,
      onChange: (e) => setFieldValue('happensToSubscriptions', e),
    },
    {
      title: 'When dunning period ends, what happens to invoices?',
      content: null,
      // value: 'Mark as Not Paid',
      value: values.happensToInvoices ? values.happensToInvoices : 'none',
      error: touched.happensToInvoices && errors.happensToInvoices,
      onChange: (e) => setFieldValue('happensToInvoices', e),
    },
  ];
  const listDunningpayment2 = [
    {
      title: 'When payment collection fails, what happens to subscriptions?',
      // value: 'Retain as Active',
      value: values.directDebitSubscription
        ? values.directDebitSubscription
        : 'Retain as Active',
      error: touched.directDebitSubscription && errors.directDebitSubscription,
      onChange: (e) => setFieldValue('directDebitSubscription', e),
    },
    {
      title: 'When payment collection fails, what happens to invoices?',
      // value: 'Mark as Not Paid',
      value: values.directDebitInvoice
        ? values.directDebitInvoice
        : 'Mark as Not Paid',
      error: touched.directDebitInvoice && errors.directDebitInvoice,
      onChange: (e) => setFieldValue('directDebitInvoice', e),
    },
  ];
  const listDunningpayment3 = [
    {
      title: 'Dunning period',
      content:
        "Configure how you'd like Chargebee to retry payment collection for customers who pay via Debit Cards, Credit Cards, PayPal, etc.",
      // value: '9',
      value: values.dunningOfflinePeiod ? values.dunningOfflinePeiod : '9',
      error: touched.dunningOfflinePeiod && errors.dunningOfflinePeiod,
      onChange: (e) => setFieldValue('dunningOfflinePeiod', e),
    },
    {
      title: 'When dunning period ends, what happens to subscriptions?',
      content:
        'Final action to be taken at the end of the dunning period, if invoice is unpaid. This is applicable for recurring invoices only.',
      // value: 'Retain as Active',
      value: values.dunningOfflineSubscription
        ? values.dunningOfflineSubscription
        : 'Retain as Active',
      error:
        touched.dunningOfflineSubscription && errors.dunningOfflineSubscription,
      onChange: (e) => setFieldValue('dunningOfflineSubscription', e),
    },
    {
      title: 'When dunning period ends, what happens to invoices?',
      content: null,
      // value: 'Mark as Not Paid',
      value: values.dunningOfflineInvoice
        ? values.dunningOfflineInvoice
        : 'Mark as Not Paid',
      error: touched.dunningOfflineInvoice && errors.dunningOfflineInvoice,
      onChange: (e) => setFieldValue('dunningOfflineInvoice', e),
    },
  ];

  const [
    selectedSettingDunningSubscriptions,
    setSelectedSettingDunningSubscriptions,
  ] = useState(false);

  const handleSelectChangeDunningSubscriptions = useCallback(
    (value) => setSelectedSettingDunningSubscriptions(value),
    []
  );
  const listDunningSubscriptions = [
    {
      title: "Dunning for 'Future' and 'Trial' subscriptions",
      content:
        'Enables dunning when payment collection fails during activation',
      checked: values.dunningFutureTrialSubscriptions
        ? values.dunningFutureTrialSubscriptions
        : false,
      error:
        touched.dunningFutureTrialSubscriptions &&
        errors.dunningFutureTrialSubscriptions,
      onChange: (e) => setFieldValue('dunningFutureTrialSubscriptions', e),
    },
    {
      title: 'Dunning for one-time invoices',
      content: 'Enables dunning when payment collection fa',
      checked: values.dunningOneTimeInvoice
        ? values.dunningOneTimeInvoice
        : false,
      error: touched.dunningOneTimeInvoice && errors.dunningOneTimeInvoice,
      onChange: (e) => setFieldValue('dunningOneTimeInvoice', e),
    },
  ];

  return (
    <div className="dunning">
      <Card.Section>
        <Stack vertical>
          <Stack.Item>
            <Heading>Dunning for cards, e-wallet payments</Heading>
          </Stack.Item>
          <Stack.Item>
            <TextStyle variation="subdued">
              Configure how you'd like Chargebee to retry payment collection for
              customers who pay via Debit Cards, Credit Cards, PayPal, etc.
            </TextStyle>
          </Stack.Item>
          <Stack.Item>
            <Layout.Section>
              <Banner>
                <p>You have not enabled email notifications for dunning yet.</p>
              </Banner>
              {/* <Button primary>Enabled</Button> */}
              {values.dunningCardConfigure ? (
                <Button
                  primary
                  onClick={() => setFieldValue('dunningCardConfigure', false)}
                >
                  Enabled
                </Button>
              ) : (
                <Button
                  onClick={() => setFieldValue('dunningCardConfigure', true)}
                >
                  Disabled
                </Button>
              )}
            </Layout.Section>
          </Stack.Item>
          <Stack.Item>
            <Stack distribution="equalSpacing" alignment="center">
              <Heading h3>Activate Dunning</Heading>
              <Switch
                checked={
                  values.activateDunningForCards
                    ? values.activateDunningForCards
                    : false
                }
                error={
                  touched.activateDunningForCards &&
                  errors.activateDunningForCards
                }
                onChange={(e) => setFieldValue('activateDunningForCards', e)}
                onColor="#86d3ff"
                onHandleColor="#2693e6"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
              />
            </Stack>
          </Stack.Item>

          {listDunningpayment1?.map((item, i) => (
            <Stack.Item key={i}>
              <TextStyle variation="strong">{item.title}</TextStyle>
              <div className="item_content">
                <a>
                  <TextStyle variation="subdued">{item.content}</TextStyle>
                </a>
                <div onClick={() => handleOpenApply1(i)}>
                  <TextStyle variation="subdued">
                    {item.value}
                    {` Days`}
                    <Icon source={ChevronDownMinor} />
                  </TextStyle>
                </div>
              </div>
            </Stack.Item>
          ))}
        </Stack>
      </Card.Section>
      <Card.Section>
        <Stack vertical>
          {listDunningSubscriptions?.map((item, i) => (
            <div key={i}>
              <TextStyle variation="strong">{item.title}</TextStyle>
              <Stack distribution="equalSpacing">
                <TextStyle variation="subdued">{item.content}</TextStyle>
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
              </Stack>
            </div>
          ))}
        </Stack>
      </Card.Section>
      <Card.Section>
        <Stack vertical>
          <Stack.Item>
            <Heading>Dunning for Direct Debit payments</Heading>
          </Stack.Item>
          <Stack.Item>
            <TextStyle variation="subdued">
              Configure how you'd like ChargeZen to retry payment collection for
              subscriptions that are paid via bank-based payment methods, such
              as Direct Debit, SEPA, etc.
            </TextStyle>
          </Stack.Item>
          <Stack.Item>
            <Stack distribution="equalSpacing">
              <Heading h4>Activate Dunning</Heading>
              <Switch
                onChange={(e) => setFieldValue('activateDunningDirectDebit', e)}
                checked={
                  values.activateDunningDirectDebit
                    ? values.activateDunningDirectDebit
                    : false
                }
                error={
                  touched.activateDunningDirectDebit &&
                  errors.activateDunningDirectDebit
                }
                onColor="#86d3ff"
                onHandleColor="#2693e6"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              />
            </Stack>
          </Stack.Item>
          {listDunningpayment2?.map((item, i) => (
            <Stack.Item key={i}>
              <Stack distribution="equalSpacing">
                <TextStyle>{item.title}</TextStyle>
                <div onClick={() => handleOpenApply2(i)}>
                  <TextStyle variation="subdued">
                    {item.value}
                    <Icon source={ChevronDownMinor} />
                  </TextStyle>
                </div>
              </Stack>
            </Stack.Item>
          ))}
        </Stack>
      </Card.Section>
      <Card.Section>
        <Stack vertical>
          <Stack.Item>
            <Heading>Dunning for offline payments</Heading>
          </Stack.Item>
          <Stack.Item>
            <div className="item_content">
              <a>
                <TextStyle variation="subdued">
                  Configure how you'd like ChargeZen to handle invoices and
                  subscriptions for customers who pay offline, when their
                  invoices are payment due.
                </TextStyle>
              </a>
              {/* <Button primary>Enabled</Button> */}
              {values.dunningOfflineConfigure ? (
                <Button
                  primary
                  onClick={() =>
                    setFieldValue('dunningOfflineConfigure', false)
                  }
                >
                  Enabled
                </Button>
              ) : (
                <Button
                  onClick={() => setFieldValue('dunningOfflineConfigure', true)}
                >
                  Disabled
                </Button>
              )}
            </div>
          </Stack.Item>
          {listDunningpayment3?.map((item, i) => (
            <Stack.Item key={i}>
              <TextStyle variation="strong">{item.title}</TextStyle>
              <div className="item_content">
                <a>
                  <TextStyle variation="subdued">{item.content}</TextStyle>
                </a>
                <div onClick={() => handleOpenApply3(i)}>
                  <TextStyle variation="subdued">
                    {item.value}
                    <Icon source={ChevronDownMinor} />
                  </TextStyle>
                </div>
              </div>
            </Stack.Item>
          ))}
        </Stack>
      </Card.Section>
      <Modal
        instant
        open={activeApply1 != -1}
        onClose={handleCloseApply1}
        title="Enter number of days"
        primaryAction={{
          content: 'Apply',
          onAction: handleCloseApply1,
        }}
      >
        <TextField
          // value={valueFromName}
          onChange={listDunningpayment1[activeApply1]?.onChange}
          value={listDunningpayment1[activeApply1]?.value}
          error={listDunningpayment1[activeApply1]?.error}
          // placeholder={listDunningpayment1[activeApply]?.value}
          suffix="days"
        />
      </Modal>
      <Modal
        instant
        open={activeApply2 != -1}
        onClose={handleCloseApply2}
        title="Enter number of days"
        primaryAction={{
          content: 'Apply',
          onAction: handleCloseApply2,
        }}
      >
        <TextField
          // value={valueFromName}
          onChange={listDunningpayment2[activeApply2]?.onChange}
          value={listDunningpayment2[activeApply2]?.value}
          error={listDunningpayment2[activeApply2]?.error}
          // placeholder={listDunningpayment1[activeApply]?.value}
          suffix="days"
        />
      </Modal>
      <Modal
        instant
        open={activeApply3 != -1}
        onClose={handleCloseApply3}
        title="Enter number of days"
        primaryAction={{
          content: 'Apply',
          onAction: handleCloseApply3,
        }}
      >
        <TextField
          // value={valueFromName}
          onChange={listDunningpayment3[activeApply3]?.onChange}
          value={listDunningpayment3[activeApply3]?.value}
          error={listDunningpayment3[activeApply3]?.error}
          // placeholder={listDunningpayment1[activeApply]?.value}
          suffix="days"
        />
      </Modal>
    </div>
  );
};
export default Dunning;
