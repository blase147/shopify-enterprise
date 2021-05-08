import React from 'react'
import { Card,RadioButton , Layout, DisplayText , Stack,TextStyle, Heading,TextField,Button } from "@shopify/polaris";
const Taxes = () => {
    return (
        <React.Fragment>
        <Layout sectioned={true}>
          <Layout.Section>
            <Card title="SMS Options" sectioned>
              <p>View a summary of your online store’s performance.</p>
            <Layout>
              <Layout.Section oneThird>
              <Stack vertical>
            <RadioButton label="Accounts are disabled" id="disabled" name="accounts"  />
            <RadioButton label="Accounts are disabled" id="disabled" name="accounts"  />
            <RadioButton label="Accounts are disabled" id="disabled" name="accounts"  />
            </Stack>
              </Layout.Section>
              <Layout.Section oneThird>
              <Stack vertical>
            <RadioButton label="Accounts are disabled" id="disabled" name="accounts"  />
            <RadioButton label="Accounts are disabled" id="disabled" name="accounts"  />
            <RadioButton label="Accounts are disabled" id="disabled" name="accounts"  />
            </Stack>
              </Layout.Section>
              <Layout.Section oneThird>
              <Stack vertical>
            <RadioButton label="Accounts are disabled" id="disabled" name="accounts"  />
            <RadioButton label="Accounts are disabled" id="disabled" name="accounts"  />
            <RadioButton label="Accounts are disabled" id="disabled" name="accounts"  />
            </Stack>
              </Layout.Section>
            </Layout>
            
            
            </Card>
          </Layout.Section>
        </Layout>
        <Layout sectioned={true}>
          <Layout.Section>
            <Card title="SMS Configuration" sectioned>
              <DisplayText size="small">SMS Delivery Timeline (24 Hour format in PST):</DisplayText>
              <Layout>
                <Layout.Section oneHalf>
                <Stack>
                <Stack.Item >
                  <Stack>
                  <TextField value="" placeholder="09:00" />
                  <Button primary>Start</Button>
                  </Stack>
                
                </Stack.Item>
                <Stack.Item >
                  <Stack>
                  <TextField value="" placeholder="20:00"/>
                 <Button primary>End</Button>
                  </Stack>
                </Stack.Item>
              </Stack>
                </Layout.Section>
                <Layout.Section oneHalf>
                <Stack>
                <Stack.Item >
                  <DisplayText size="small" >New Renewel</DisplayText>
                  <Stack>
                  <TextField value="" placeholder="3 days"/>
                  <Button primary>Save</Button>
                  </Stack>
                </Stack.Item>
                
              </Stack>
                </Layout.Section>
              </Layout>
              
            </Card>
          </Layout.Section>
        </Layout>
        <Layout sectioned={true}>
          <Layout.Section>
            <Card title="Frequently Asked Questions" sectioned>
              <Stack vertical>
                <Stack.Item>
                <Heading>SHOPIFY ONLY: Are tax rates in lorem ipsum synced with tax rates in Shopify?</Heading>
                <TextStyle variation="subdued"> When you first install lorem, our system will sync the province taxes to match the settings in Shopify once. Going forward, if this is edited in Shopify, it will not sync automatically with loreme, it must be updated independently through th
                </TextStyle>
                </Stack.Item>
                <Stack.Item>
                <Heading>SHOPIFY ONLY: Are tax rates in lorem ipsum synced with tax rates in Shopify?</Heading>
                <TextStyle variation="subdued"> When you first install lorem, our system will sync the province taxes to match the settings in Shopify once. Going forward, if this is edited in Shopify, it will not sync automatically with loreme, it must be updated independently through th
                </TextStyle>
                </Stack.Item>
                <Stack.Item>
                <Heading>SHOPIFY ONLY: Are tax rates in lorem ipsum synced with tax rates in Shopify?</Heading>
                <TextStyle variation="subdued"> When you first install lorem, our system will sync the province taxes to match the settings in Shopify once. Going forward, if this is edited in Shopify, it will not sync automatically with loreme, it must be updated independently through th
                </TextStyle>
                </Stack.Item>
              </Stack>
            </Card>
          </Layout.Section>
        </Layout>
      </React.Fragment>
    )
}

export default Taxes
