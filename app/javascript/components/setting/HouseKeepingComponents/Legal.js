import { Icon, Layout, Stack, TextStyle } from '@shopify/polaris';
import React from 'react';
import { MobileBackArrowMajor } from '@shopify/polaris-icons';
const Legal = ({ handleBack }) => {
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
      Legal Content
    </Layout>
  );
};

export default Legal;
