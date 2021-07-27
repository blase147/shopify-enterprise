import React, { useState, useCallback, useEffect } from 'react';

import {
  Card,
  DisplayText,
  FormLayout,
  Layout,
  Select,
  TextStyle,
  Stack,
  Icon
} from '@shopify/polaris';
import {
  MobileBackArrowMajor
} from '@shopify/polaris-icons';
const ProductExtention = ({ values, touched, errors, setFieldValue, handleBack }) => {

    const options = [
      { label: 'Design I', value: 'one' },
      { label: 'Design II', value: 'two' },
      { label: 'Design III', value: 'three' }
    ];
    return (
      <div className="product-extention">
        <Layout>
        <Layout.Section>
        <div className="back-button pointer" onClick={handleBack}>
          <Icon
            source={MobileBackArrowMajor}
            color="base" />
        </div>
      </Layout.Section>
        <Card>
          <Card.Section>
            <div className="billing">
              <FormLayout>
                <DisplayText size="small" element="h6">
                  <TextStyle variation="subdued">
                    Product Extention
                  </TextStyle>
                </DisplayText>
                <Select
                  label="Design"
                  value={values.designType}
                  error={touched.designType && errors.designType}
                  onChange={(e) => setFieldValue('designType', e)}
                  options={options}
                />

              </FormLayout>
            </div>
          </Card.Section>
        </Card>
      </Layout>
      </div>
    )
}


export default ProductExtention
