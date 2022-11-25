import React, { useCallback, useState, useEffect } from 'react';
import { MobileBackArrowMajor } from '@shopify/polaris-icons';
import {
  Card,
  Layout,
  Toast,
  List,
  Button,
  TextField,
  Icon,
  FormLayout,
  DisplayText,
  TextStyle,
  Select,
  ResourceItem,
  ResourceList,
  SettingToggle
} from '@shopify/polaris';
import { post } from 'jquery';

const EnableDebug = ({ handleBack }) => {
  const [active, setActive] = useState(false);
  const handleToggle = () => {
    fetch('/debug_mode?status=' + (!active), {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        setActive(!active);
      })
  }

  useEffect(() => {
    fetch('/debug_mode', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setActive(data.debug_mode);
      })
  }, [])

  return (
    <>
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
                    <TextStyle variation="subdued">Debug Mode Status</TextStyle>
                  </DisplayText>
                  <SettingToggle
                    action={{
                      content: active ? 'Deactivate' : 'Activate',
                      onAction: handleToggle,
                    }}
                    enabled={active}
                  >
                    Debugging mode is <TextStyle variation="strong">{active ? 'activated' : 'deactivated'}</TextStyle>.
                  </SettingToggle>
                </FormLayout>
              </div>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </>
  );
};

export default EnableDebug;
