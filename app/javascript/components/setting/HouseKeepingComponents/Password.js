import React from 'react'
import {Layout, DisplayText, TextField, Button, Stack} from '@shopify/polaris';
import './ExportComponents/export.css'
const Password = () => {
    return (
        <Layout >
          <Layout.Section>
            <p className="default-pass">
              Default Password: <strong>Admin Alaska777</strong>
            </p>
          </Layout.Section>
          <div className="password-fields">
            <Layout.Section >
              <TextField
                label="Password"
              />
            </Layout.Section>
            <Layout.Section >
              <TextField
                label="Confirm Password"
              />
            </Layout.Section>
          </div>
          <div className="password-btn">
          <Layout.Section>
            <Stack>
              <Stack.Item>
                <Button primary>Save</Button>
              </Stack.Item>
              <div className="cancel-pass-btn">
              <Stack.Item>
                <Button >Cancel</Button>
              </Stack.Item>
              </div>
            </Stack>
          </Layout.Section>
          </div>
        </Layout>
    )
}

export default Password
