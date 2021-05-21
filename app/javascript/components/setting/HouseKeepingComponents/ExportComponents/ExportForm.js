import React from 'react';
import {Heading,TextStyle, Layout, DisplayText, Card, Select, Stack} from '@shopify/polaris';
import './export.css';

const ExportForm = ({handleCloseForm}) => {

    const options = [
        {label: 'Select a type', value: 'fixed'}
      ];
    return (
        <Layout >

        <div className='wrapper'>
          <div className='bread-bar'>
            <a>Export</a>
            <span>{">"}</span>
            <a>Export Builder</a>
          </div>
          <div className="input-section">
          <DisplayText size='medium'><strong>Select Export Type</strong></DisplayText>
          <div className="create-input">
            <Select
                    options={options}
                    // onChange={handleSelectChange}
                    // value={selected}
                    />
            </div>
            </div>
          </div>
          <div className ='faq-sms'>
            <Card sectioned>
              <h1>Frequently Asked Questions </h1>
              <Stack vertical>
                <Stack.Item>
                  <Heading>
                    SHOPIFY ONLY: Are tax rates in lorem ipsum synced with tax
                    rates in Shopify?
                  </Heading>
                  <TextStyle variation='subdued'>
                    {" "}
                    When you first install lorem, our system will sync the
                    province taxes to match the settings in Shopify once. Going
                    forward, if this is edited in Shopify, it will not sync
                    automatically with loreme, it must be updated independently
                    through th
                  </TextStyle>
                </Stack.Item>
                <Stack.Item>
                  <Heading>
                    SHOPIFY ONLY: Are tax rates in lorem ipsum synced with tax
                    rates in Shopify?
                  </Heading>
                  <TextStyle variation="subdued">
                    {" "}
                    When you first install lorem, our system will sync the
                    province taxes to match the settings in Shopify once. Going
                    forward, if this is edited in Shopify, it will not sync
                    automatically with loreme, it must be updated independently
                    through th
                  </TextStyle>
                </Stack.Item>
                <Stack.Item>
                  <Heading>
                    SHOPIFY ONLY: Are tax rates in lorem ipsum synced with tax
                    rates in Shopify?
                  </Heading>
                  <TextStyle variation="subdued">
                    {" "}
                    When you first install lorem, our system will sync the
                    province taxes to match the settings in Shopify once. Going
                    forward, if this is edited in Shopify, it will not sync
                    automatically with loreme, it must be updated independently
                    through th
                  </TextStyle>
                </Stack.Item>
              </Stack>
            </Card>
          </div>
      </Layout>
    )
}

export default ExportForm
