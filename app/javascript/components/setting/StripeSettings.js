import React, { useCallback, useState, useEffect, useContext } from 'react';
import { MobileBackArrowMajor } from '@shopify/polaris-icons';
import {
  Card,
  Layout,
  Button,
  TextField,
  Icon,
  FormLayout,
  DisplayText,
  TextStyle,
  Checkbox
} from '@shopify/polaris';
import { DomainContext } from '../domain-context';

const StripeSettings = ({ handleBack }) => {
  const { domain } = useContext(DomainContext);
  const [publishableKey, setPublishableKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [checked, setChecked] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handlePublishableKeyChange = useCallback((newValue) => setPublishableKey(newValue), []);
  const handleSecretKeyChange = useCallback((newValue) => setSecretKey(newValue), []);
  const handleChange = useCallback((newChecked) => setChecked(newChecked), []);

  useEffect(() => {
    fetch(`/settings/stripe_settings?shopify_domain=${domain}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setPublishableKey(data.publish_key ? data.publish_key : '');
        setSecretKey(data.secret_key ? data.secret_key : '');
      })
  }, [])

  const handleSave = () => {
    fetch('/settings/update_stripe_settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stripe_publish_key: publishableKey, stripe_api_key: secretKey, shopify_domain: domain }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSuccessMsg("Stripe settings updated successfully.");
      })
  }

  return (
    <Layout>
      <Layout.Section>
        <div className="back-button pointer" onClick={handleBack}>
          <Icon source={MobileBackArrowMajor} color="base" />
          <p>
            <TextStyle variation="subdued">Settings</TextStyle>
          </p>
        </div>
        <Card>
          <Card.Section>
            <div className="billing">
              <FormLayout>
                <DisplayText size="small" element="h6">
                  <TextStyle variation="subdued">Stripe Settings</TextStyle>
                </DisplayText>
                <TextField
                  label="Stripe Publishable Key"
                  value={publishableKey}
                  onChange={handlePublishableKeyChange}
                  autoComplete="off"
                />
                <TextField
                  label="Stripe Secret Key"
                  value={secretKey}
                  onChange={handleSecretKeyChange}
                  autoComplete="off"
                  type={checked ? "text" : "password"}
                />
                <Checkbox
                  label="Show Secret Key"
                  checked={checked}
                  onChange={handleChange}
                />
                <Button primary onClick={handleSave}>
                  Save
                </Button>
                {successMsg ? <p style={{ color: 'green' }}>{successMsg}</p> : ''}
              </FormLayout>
            </div>
          </Card.Section>
        </Card>
      </Layout.Section>
    </Layout>
  );
};

export default StripeSettings;
