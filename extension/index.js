import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
  Button,
  Card,
  Checkbox,
  TextField,
  Text,
  Stack,
  extend,
  render,
  useData,
  useContainer,
  ExtensionPoint,
  useSessionToken,
  useLocale,
  Select
} from '@shopify/argo-admin-react';

const translations = {
  de: {
    hello: 'Guten Tag',
  },
  en: {
    hello: 'Hello',
  },
  fr: {
    hello: 'Bonjour',
  },
};
const HOST = process.env.HOST || 'https://aroma360.ecomtarget.com/graphql_extension';

function Actions({onPrimary, onClose, title}) {
  return (
    <Stack spacing="none" distribution="fill">
      <Button title="Cancel" onPress={onClose} />
      <Stack distribution="trailing">
        <Button title={title} onPress={onPrimary} primary />
      </Stack>
    </Stack>
  );
}

// 'Add' mode should allow a user to add the current product to an existing selling plan
// [Shopify admin renders this mode inside a modal container]
function Add() {
  // Information about the product and/or plan your extension is editing.
  // Your extension receives different data in each mode.
  const data = useData();

  // The UI your extension renders inside
  const {close, done, setPrimaryAction, setSecondaryAction} = useContainer();

  // Information about the merchant's selected language. Use this to support multiple languages.
  const locale = useLocale();

  // Use locale to set translations with a fallback
  const localizedStrings = useMemo(() => {
    return translations[locale] || translations.en;
  }, [locale]);

  // Session token contains information about the current user. Use it to authenticate calls
  // from your extension to your app server.
  const {getSessionToken} = useSessionToken();

  const [selectedPlans, setSelectedPlans] = useState([]);
  const mockPlans = [
    {name: 'Subscription Plan A', id: 'a'},
    {name: 'Subscription Plan B', id: 'b'},
    {name: 'Subscription Plan C', id: 'c'},
  ];

  const [plans, setPlans] = useState([{label: 'Loading...', value: ''}]);
  const [selected, setSelected] = useState('');
  
  const handleSelectChange = useCallback((value) => setSelected(value), []);

  useEffect(() => {
    (async () => {
      const token = await getSessionToken();

      let res = await fetch(HOST, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        method: 'POST',
        body: JSON.stringify({type: "plans"})
      });
      let response = await res.json();
      setPlans(response.data);
    })();
  }, []);

  const options = [
    {label: 'Red', value: 'red', disabled: false},
    {label: 'Green', value: 'green', disabled: false},
    {label: 'Blue', value: 'blue', disabled: false},
  ];

  // Configure the extension container UI
  useEffect(() => {
    setPrimaryAction({
      content: 'Add to plan',
      onAction: async () => {
        // Get a fresh session token before every call to your app server.
        const token = await getSessionToken();

        // The product and variant ID's collected from the modal form
        let payload = {
          type: "add",
          body: {
            productId: data.productId,
            id: selected
          }
        };

        // Here, send the form data to your app server to add the product to an existing plan.
        const response = await fetch(HOST, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          method: 'POST',
          body: JSON.stringify(payload)
        });

        // If the server responds with an OK status, then refresh the UI and close the modal
        if (response.ok) {
          done();
        } else {
          console.log('Handle error.');
        }

        close();
        
      },
    });

    setSecondaryAction({
      content: 'Cancel',
      onAction: () => close(),
    });
  }, [getSessionToken, selected, close, done, setPrimaryAction, setSecondaryAction]);

  return (
    <>
      {/* <Text size="titleLarge">{localizedStrings.hello}!</Text> */}
      <Text>
        Add subscription plan to all variants of the product
      </Text>

      <Select
        label=""
        options={plans}
        labelInline
        onChange={(value) => setSelected(value)}
        value={selected}
      />

      <Stack>
        <Text>
          Want to add a plan to a specific set of variants? You can add them from the variant details page in Shopify
        </Text>
        {/*{mockPlans.map((plan) => (
          <Checkbox
            key={plan.id}
            label={plan.name}
            onChange={(checked) => {
              const plans = checked
                ? selectedPlans.concat(plan.id)
                : selectedPlans.filter((id) => id !== plan.id);
              setSelectedPlans(plans);
            }}
            checked={selectedPlans.includes(plan.id)}
          />
          ))} */}
      </Stack>
    </>
  );
}

// 'Create' mode should create a new selling plan, and add the current product to it
// [Shopify admin renders this mode inside an app overlay container]
function Create() {
  const data = useData();
  const {close, done} = useContainer();
  const locale = useLocale();
  const localizedStrings = useMemo(() => {
    return translations[locale] || translations.en;
  }, [locale]);

  const {getSessionToken} = useSessionToken();

  // Mock plan settings
  const [planTitle, setPlanTitle] = useState('');
  const [percentageOff, setPercentageOff] = useState('');
  const [deliveryFrequency, setDeliveryFrequency] = useState('');

  const onPrimaryAction = useCallback(async () => {
    const token = await getSessionToken();

    // Here, send the form data to your app server to create the new plan.

    done();
  }, [getSessionToken, done]);

  const cachedActions = useMemo(
    () => (
      <Actions
        onPrimary={onPrimaryAction}
        onClose={close}
        title="Create plan"
      />
    ),
    [onPrimaryAction, close]
  );

  return (
    <>
      <Stack spacing="none">
        <Text size="titleLarge">
          {localizedStrings.hello}! Create subscription plan
        </Text>
      </Stack>

      <Card
        title={`Create subscription plan for Product id ${data.productId}`}
        sectioned
      >
        <TextField
          label="Plan title"
          value={planTitle}
          onChange={setPlanTitle}
        />
      </Card>

      <Card title="Delivery and discount" sectioned>
        <Stack>
          <TextField
            type="number"
            label="Delivery frequency (in weeks)"
            value={deliveryFrequency}
            onChange={setDeliveryFrequency}
          />
          <TextField
            type="number"
            label="Percentage off (%)"
            value={percentageOff}
            onChange={setPercentageOff}
          />
        </Stack>
      </Card>

      {cachedActions}
    </>
  );
}

// 'Remove' mode should remove the current product from a selling plan.
// This should not delete the selling plan.
// [Shopify admin renders this mode inside a modal container]
function Remove() {
  const data = useData();
  const {close, done, setPrimaryAction, setSecondaryAction} = useContainer();
  const locale = useLocale();
  const localizedStrings = useMemo(() => {
    return translations[locale] || translations.en;
  }, [locale]);

  const {getSessionToken} = useSessionToken();

  useEffect(() => {
    setPrimaryAction({
      content: 'Remove from plan',
      onAction: async () => {
        const token = await getSessionToken();

        // Here, send the form data to your app server to remove the product from the plan.
        let payload = {
          type: "remove",
          body: {
            sellingPlanGroupId: data.sellingPlanGroupId,
            productId: data.productId,
            variantIds: data.variantIds
          }
        };

        // Here, send the form data to your app server to add the product to an existing plan.
        const response = await fetch(HOST, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          method: 'POST',
          body: JSON.stringify(payload)
        });

        // If the server responds with an OK status, then refresh the UI and close the modal
        if (response.ok) {
          done();
        } else {
          console.log('Handle error.');
        }

        close();        
      },
    });

    setSecondaryAction({
      content: 'Cancel',
      onAction: () => close(),
    });
  }, [getSessionToken, close, done, setPrimaryAction, setSecondaryAction]);

  return (
    <>
      <Text size="titleLarge">{localizedStrings.hello}!</Text>
      <Text>
        Remove Product id {data.productId} from Plan group id{' '}
        {data.sellingPlanGroupId}
      </Text>
    </>
  );
}

// 'Edit' mode should modify an existing selling plan.
// Changes should affect other products that have this plan applied.
// [Shopify admin renders this mode inside an app overlay container]
function Edit() {
  const data = useData();
  const {close, done} = useContainer();
  const locale = useLocale();
  const localizedStrings = useMemo(() => {
    return translations[locale] || translations.en;
  }, [locale]);

  const {getSessionToken} = useSessionToken();

  const [planTitle, setPlanTitle] = useState('Current plan');
  const [percentageOff, setPercentageOff] = useState('10');
  const [deliveryFrequency, setDeliveryFrequency] = useState('1');

  const onPrimaryAction = useCallback(async () => {
    const token = await getSessionToken();

    // Here, send the form data to your app server to modify the selling plan.

    done();
  }, [getSessionToken, done]);

  const cachedActions = useMemo(
    () => (
      <Actions onPrimary={onPrimaryAction} onClose={close} title="Edit plan" />
    ),
    [onPrimaryAction, close]
  );

  return (
    <>
      <Stack spacing="none">
        <Text size="titleLarge">
          {localizedStrings.hello}! Edit subscription plan
        </Text>
      </Stack>

      <Card
        title={`Edit subscription plan for Product id ${data.productId}`}
        sectioned
      >
        <TextField
          label="Plan title"
          value={planTitle}
          onChange={setPlanTitle}
        />
      </Card>

      <Card title="Delivery and discount" sectioned>
        <Stack>
          <TextField
            type="number"
            label="Delivery frequency (in weeks)"
            value={deliveryFrequency}
            onChange={setDeliveryFrequency}
          />
          <TextField
            type="number"
            label="Percentage off (%)"
            value={percentageOff}
            onChange={setPercentageOff}
          />
        </Stack>
      </Card>

      {cachedActions}
    </>
  );
}

function App() {
  return <Card>This is the best extension.</Card>;
}

extend(
  'Playground',
  render(() => <App />)
);


// Your extension must render all four modes
extend(
  'Admin::Product::SubscriptionPlan::Add',
  render(() => <Add />)
);
extend(
  'Admin::Product::SubscriptionPlan::Create',
  render(() => <Create />)
);
extend(
  'Admin::Product::SubscriptionPlan::Remove',
  render(() => <Remove />)
);
extend(
  'Admin::Product::SubscriptionPlan::Edit',
  render(() => <Edit />)
);
