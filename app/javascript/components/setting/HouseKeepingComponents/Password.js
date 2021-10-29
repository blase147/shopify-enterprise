import React, { useCallback, useEffect, useState } from 'react';
import { MobileBackArrowMajor } from '@shopify/polaris-icons';
import {
  Banner,
  Card,
  ContextualSaveBar,
  Form,
  Frame,
  Layout,
  List,
  Page,
  Spinner,
  Tabs,
  Toast,
  RadioButton,
  Button,
  TextField,
  Stack,
  Icon,
  Checkbox,
  TextStyle,
} from '@shopify/polaris';
import './ExportComponents/export.css';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
const Password = ({ handleBack, passwordProtected, setPasswordProtected }) => {
  const updatePasswordMutation = gql`
    mutation ($input: UpdatePasswordInput!) {
      updatePassword(input: $input) {
        password {
          success
        }
      }
    }
  `;
  const [enablePassword, setEnablePassword] = useState(passwordProtected);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [updatePassword, { data1, error1, loading: loadingPssword }] =
    useMutation(updatePasswordMutation);

  const [formErrors, setFormErrors] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);
  // Change pasword
  const handleChangePassword = () => {
    updatePassword({
      variables: {
        input: {
          params: {
            enablePassword,
            password,
            passwordConfirmation,
          },
        },
      },
    })
      .then((res) => {
        if (!res.data.errors) {
          setSaveSuccess(true);
          setPasswordProtected(enablePassword);
        } else {
          setFormErrors(res.data.errors);
        }
      })
      .catch((error) => {
        setFormErrors(error);
      });
  };

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
        <Layout.Section>
          <p className="default-pass">
            Default Password: <strong>AdminAlaska777</strong>
          </p>
          <div className="password-fields">
            <Checkbox
              label="Enable Password?"
              checked={enablePassword}
              onChange={setEnablePassword}
            />
            <br />
            <TextField
              value={password}
              onChange={(value) => setPassword(value)}
              label="Password"
              type="password"
            />
            <TextField
              value={passwordConfirmation}
              onChange={(value) => setPasswordConfirmation(value)}
              label="Confirm Password"
              type="password"
            />
          </div>
          <div class="tabs-btn">
            <Button
              primary
              loading={loadingPssword}
              onClick={handleChangePassword}
            >
              Save
            </Button>
            <Button type="button">Cancel</Button>
          </div>
        </Layout.Section>
      </Layout>
      {saveSuccess && (
        <Toast content="Setting is saved" onDismiss={hideSaveSuccess} />
      )}
      {formErrors.length > 0 && (
        <>
          <Banner title="Setting could not be saved" status="critical">
            <List type="bullet">
              {formErrors.map((message, index) => (
                <List.Item key={index}>{message.message}</List.Item>
              ))}
            </List>
          </Banner>
          <br />
        </>
      )}
    </>
  );
};

export default Password;
