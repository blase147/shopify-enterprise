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
  const handleToggle = useCallback(() => setActive((active) => !active), []);

  useEffect(()=>{
    const status = $.get('/debug_mode/index');
    setActive(status.debug_mode);
  },[])

  useEffect(()=>{
    $.post('/debug_mode/create', {status: active});
  },[active])
  
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
        </Layout.Section>
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
                  Debugging mode is <TextStyle variation="strong">{ active ? 'activated' : 'deactivated' }</TextStyle>.
                </SettingToggle>
              </FormLayout>
            </div>
          </Card.Section>
        </Card>
      </Layout>
    </>
  );
};

export default EnableDebug;
