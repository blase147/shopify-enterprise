import React from 'react';
import {Checkbox,DisplayText,ButtonGroup,TextField, Button, Stack, Card, Layout, Subheading} from '@shopify/polaris';

const CustomKeywordsForm = ({id,handleClose}) => {
    return (
        <React.Fragment>
        <Layout>
        <Layout.Section>
        <DisplayText size="large">
        Edit Custom Keywords(s)
        </DisplayText>
        <Subheading>
        Update message custom keyword's data.
        </Subheading>
        </Layout.Section>
          <Layout.Section>
          <Card>
            <Card.Section >
              <Layout>
                <Layout.Section>
                  <DisplayText size="small" >
                  The custom keyword(s) are going to be used for matching customer's messages into automatic responses.
                   You can add as many keywords as you want, for each new keyword you should <strong>press Enter</strong> on the Keywords field below.
                    Please don't worry about lower and upper case, this will be automatically handled by us. For example,
                     you can add only <strong>hello</strong> and will it be enough for matching both <strong>Hello</strong> and <strong>HELLO</strong>.
                  </DisplayText>
                </Layout.Section>
                <Layout.Section >
                <TextField label="name*"  />
                </Layout.Section>
                <Layout.Section >
                <TextField multiline={3} label="response" />
                </Layout.Section>
              </Layout>
              <Checkbox label="Basic checkbox"  />
           
            </Card.Section>
            <Card.Section subdued  >
            <Stack distribution="trailing">
          <ButtonGroup>
            <Button onClick={handleClose}>Cancel</Button>
            <Button primary>Save</Button>
            </ButtonGroup>
          </Stack>
            </Card.Section>
          </Card>
          </Layout.Section>
        </Layout>
      </React.Fragment>
    )
}

export default CustomKeywordsForm
