import React, { useState, useCallback, useEffect } from 'react';

import {
  Card,
  DisplayText,
  FormLayout,
  Layout,
  Select,
  TextStyle,
} from '@shopify/polaris';

const ProductExtention = ({ values, touched, errors, setFieldValue }) => {

    const options = [
      { label: 'Design I', value: 'one' },
      { label: 'Design II', value: 'two' }
    ];
    return (
      <div className="product-extention">
        <Layout>
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
