import React from 'react'
import {Layout, DisplayText, TextField, Button, Stack} from '@shopify/polaris';
const Password = () => {
    return (
        <Layout >
          <Layout.Section>
            <DisplayText >
              Default Password: <strong>Admin Alaska777</strong>
            </DisplayText>
          </Layout.Section>
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
          <Layout.Section>
            <Stack>
              <Stack.Item>
                <Button primary>Save</Button>
              </Stack.Item>
              <Stack.Item>
                <Button >Cancel</Button>
              </Stack.Item>
            </Stack>
          </Layout.Section>
        </Layout>
    )
}

export default Password
