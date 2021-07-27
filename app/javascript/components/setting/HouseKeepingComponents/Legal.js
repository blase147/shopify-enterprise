import { Icon, Layout, Stack } from '@shopify/polaris'
import React from 'react'
import {
    MobileBackArrowMajor
  } from '@shopify/polaris-icons';
const Legal = ({handleBack}) => {
    return (
        <Layout>
            <Layout.Section>
        <div className="back-button pointer" onClick={handleBack}>
          <Icon
            source={MobileBackArrowMajor}
            color="base" />
        </div>
      </Layout.Section>
            Legal Content
        </Layout>
    )
}

export default Legal
