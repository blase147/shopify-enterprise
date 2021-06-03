import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '../layout/Layout';
import {
  Card,
  Select,
  TextField,
  ButtonGroup,
  Button,
  Stack,
  Heading,
  TextStyle,
  FormLayout,
  Layout,
  TextContainer,
  Icon
} from '@shopify/polaris';
import Switch from 'react-switch';
import {
  CircleLeftMajor
} from '@shopify/polaris-icons';

const emailNotificationsDetails = (props) => {
  const [valueFromName, setValueFromName] = useState();
  const handleChangeFormName = useCallback(
    (newValue) => setValueFromName(newValue),
    []
  );
  const [selectedSettingEnabled, setSelectedSettingEnabled] = useState(false);

  const handleSelectChangeSettingEnabled = useCallback(
    (value) => setSelectedSettingEnabled(value),
    []
  );
  const html_text = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="utf-8">
      <title><!-- Insert your title here --></title>
  </head>
  <body>
      <!-- Insert your content here -->
  </body>
  </html>`;

  const {
    values,
    touched,
    errors,
    setFieldValue,
    index,
    setSelectedIndex,
    handleSubmit,
  } = props;

  const submit=async ()=>{
    await handleSubmit();
    setSelectedIndex(null);
  }
  return (
    <div className="noti-detail">
      <div className="container-left">
        <Card.Section>
          <Stack vertical>
            <Stack.Item>
              <div className="back-btn-container" onClick={()=>setSelectedIndex(null)} >
              <Icon
                source={CircleLeftMajor}
                color="base" />
                <p>Go Back</p>
              </div>
              
            </Stack.Item>
            <Stack.Item>
              <Heading>{values.emailNotifications[index]?.name}</Heading>
            </Stack.Item>
            <Stack.Item>
              <TextStyle variation="subdued">
                {values.emailNotifications[index]?.description}
              </TextStyle>
            </Stack.Item>
            <Stack.Item>
              <Heading h4>Email Content</Heading>
            </Stack.Item>
            <Stack.Item>
              <FormLayout>
                <TextField
                  label="From Name"
                  value={
                    values.emailNotifications[index]?.fromName
                      ? values.emailNotifications[index]?.fromName
                      : ''
                  }
                  onChange={(e) =>
                    setFieldValue(`emailNotifications[${index}].fromName`, e)
                  }
                  name="from_name"
                />
                <TextField
                  label="From Email"
                  value={
                    values.emailNotifications[index]?.fromEmail
                      ? values.emailNotifications[index]?.fromEmail
                      : null
                  }
                  onChange={(e) =>
                    setFieldValue(`emailNotifications[${index}].fromEmail`, e)
                  }
                  inputMode="email"
                  name="from_email"
                />
                <TextField
                  label="Email Subject"
                  value={
                    values.emailNotifications[index]?.emailSubject
                      ? values.emailNotifications[index]?.emailSubject
                      : null
                  }
                  onChange={(e) =>
                    setFieldValue(
                      `emailNotifications[${index}].emailSubject`,
                      e
                    )
                  }
                  name="email_subject"
                />
                <TextField
                  label="Email Message"
                  placeholder={html_text}
                  value={values.emailNotifications[index]?.emailMessage}
                  onChange={(e) =>
                    setFieldValue(
                      `emailNotifications[${index}].emailMessage`,
                      e
                    )
                  }
                  multiline={15}
                  name="email_message"
                />
              </FormLayout>
            </Stack.Item>
            <Stack.Item>
              <ButtonGroup>
                <Button primary onClick={() => setSelectedIndex(null)}>
                  Cancel
                </Button>
                <Button onClick={() => submit()}>Save Changes</Button>
              </ButtonGroup>
            </Stack.Item>
          </Stack>
        </Card.Section>
      </div>
      <div className="container-right">
        <Card.Section>
          <TextContainer>
            <Heading h4>Status</Heading>
            <Stack distribution="equalSpacing">
              {/* <Button primary>Enabled</Button> */}
              {values.emailNotifications[index]?.status ? (
                <Button primary onClick={() => {}}>
                  Enabled
                </Button>
              ) : (
                <Button onClick={() => {}}>Disabled</Button>
              )}
              <Switch
                // onChange={setFieldValue(
                //   `emailNotifications[${values.emailNotifications[index]}].status`,
                //   !values.emailNotifications[index]?.status
                // )}
                checked={values.emailNotifications[index]?.status}
                onColor="#86d3ff"
                onHandleColor="#2693e6"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              />
            </Stack>
            <br />
            <TextStyle variation="subdued">
              This notification is enabled and will be sent to customers when
              conditions apply.
            </TextStyle>
          </TextContainer>
        </Card.Section>

        {
          process.env.APP_TYPE=="public" &&
          <Card.Section>
            <TextContainer>
              <Heading h4>Need help with ChargeZen variables?</Heading>
              <br />
              <TextStyle variation="subdued">
                We’ve compiled a list of all available CharegeZen variables along
                with additional information and help. You can check out the guide
                here.
           </TextStyle>
            </TextContainer>
          </Card.Section>
        }
        

        <Card.Section>
          <TextContainer>
            <Heading h4>Actions</Heading>
            <Button fullWidth>Send a test email</Button>
            <Button fullWidth>Preview</Button>
          </TextContainer>
        </Card.Section>
      </div>
    </div>
  );
};
export default emailNotificationsDetails;
