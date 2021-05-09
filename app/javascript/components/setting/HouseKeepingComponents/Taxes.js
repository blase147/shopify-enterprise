import {
    Button,
    Card,
    DisplayText,
    Heading,
    Layout,
    RadioButton,
    Stack,
    TextField,
    TextStyle
  } from "@shopify/polaris";
  import React from "react";
  const Taxes = () => {
    return (
      <React.Fragment>
            <div className="sms-tab">
                <div className="sms-options">
          <Card title="SMS Options" sectioned>
            <RadioButton label="Delay Order" id="delay" name="accounts" />
            <RadioButton
              label="Edit delivery schedule"
              id="edit-delivery"
              name="accounts"
            />
            <RadioButton label="Order tracking" id="disabled" name="accounts" />
            <RadioButton label="Renewal Reminder" id="disabled" name="accounts" />
            <RadioButton
              label="Skip Upcoming Order"
              id="disabled"
              name="accounts"
            />
            <RadioButton
              label="Skip/Update next charge"
              id="disabled"
              name="accounts"
            />
            <RadioButton label="One-time upsells" id="disabled" name="accounts" />
            <RadioButton label="Failed Renewal" id="disabled" name="accounts" />
            <RadioButton
              label="Cancel/Reactive subscription"
              id="disabled"
              name="accounts"
            />
            <RadioButton label="Edit quantity" id="disabled" name="accounts" />
            <RadioButton
              label="Cancel subscrition"
              id="disabled"
              name="accounts"
            />
            <RadioButton label="Windback flow" id="disabled" name="accounts" />
          </Card>
        </div>
            <div className="sms-config">
            <Card title="SMS Configuration" sectioned>
            <DisplayText size="small">SMS Delivery Timeline (24 Hour format in PST):</DisplayText>
              <Layout>
                <Layout.Section oneHalf>
                  <Stack>
                    <Stack.Item>
                      <Stack>
                        <TextField value="" placeholder="09:00" />
                        <Button >Start</Button>
                      </Stack>
                    </Stack.Item>
                    <Stack.Item>
                      <Stack>
                        <TextField value="" placeholder="20:00" />
                        <Button >End</Button>
                      </Stack>
                    </Stack.Item>
                  </Stack>
                </Layout.Section>
                <Layout.Section oneHalf>
                  <Stack>
                    <Stack.Item>
                      <DisplayText size="small">New Renewel</DisplayText>
                      <Stack>
                        <TextField value="" placeholder="3 days" />
                        <Button >Save</Button>
                      </Stack>
                    </Stack.Item>
                  </Stack>
                </Layout.Section>
              </Layout>
            </Card>
            </div>
            <div className ="faq-sms">
            <Card sectioned>
              <h1>Frequently Asked Questions </h1>
              <Stack vertical>
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
          </div>
      </React.Fragment>
    );
  };
  export default Taxes;