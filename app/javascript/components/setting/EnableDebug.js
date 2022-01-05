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
  const contentStatus = active ? 'Deactivate' : 'Activate';
  const textStatus = active ? 'activated' : 'deactivated';

  useEffect(()=>{
    $.post('/debug_mode/create', active);
    console.log(textStatus, active);
  },[textStatus])
  
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
                    content: contentStatus,
                    onAction: handleToggle,
                  }}
                  enabled={active}
                >
                  Debugging mode is <TextStyle variation="strong">{textStatus}</TextStyle>.
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
