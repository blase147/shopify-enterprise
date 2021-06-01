import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Link , useHistory, useLocation, useParams } from 'react-router-dom';
import AppLayout from '../layout/Layout';
import { gql,useLazyQuery,useMutation } from '@apollo/client';
import {
  Page,
  EmptyState,
  Frame,
  CalloutCard,
  Card,
  Icon,
  Stack,
  Badge,
  DisplayText,
  Button,
  Layout,
  Tabs,
  Heading,
  TextField,
  Toast
} from '@shopify/polaris';

import getStart from 'images/get_start.svg';
import integrations from '../../lib/integrations';
import _ from 'lodash';

const IntegrationDetail = () => {

  const updateQuery=gql`
  mutation ($input: UpdateIntegrationInput!) {
    updateIntegration(input: $input) {
        integration {
            id
            name
            integrationType
            serviceType
            default
            credentials{
              privateKey
              publicKey
            }
            status
        }
    }
}
  `;
//   const getQuery=gql`
//   query($type:String!){
//     fetchIntegration(id: "9") {
//       id
//       name
//       integrationType
//       serviceType
//       default
//       credentials
//       status
//       keys
//   }
// }
//   `;

  const history = useHistory();
  let { id, title, keys } = useParams();

  
  
  let tabs = integrations.map((item, index)=> ({
    content: item.title,
    id: index
  }))

  tabs = [
    // {content: 'All', id: 'all' }
  ].concat(tabs)

  let category = integrations.filter((item) => item.id == id)[0];
  // let item = category.data.filter((item) => item.title == title)[0];

  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );
  const location=useLocation();
  let fieldKeys=keys.split(",").map(field=>_.camelCase(field));

  const [updateMutation,{data,loading}]=useMutation(updateQuery);
  const [formData,setFormData]=useState(/*fieldKeys.reduce((acc,curr)=> (acc[curr]='',acc),{})*/{...location?.state?.credentials})

  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);

  
  const handleSubmit=()=>{
        updateMutation({
          variables:{
            input: {
              params: {
                  id: id,
                  credentials: {
                      ...formData
                  }
              }}
          }
        }).then(res => {
          if (!res.data.errors) {
            setSaveSuccess(true);
          }
        })
  }
  return (
    <AppLayout typePage="integrations" tabIndex='5'>
      <Button>
        <img src={getStart} width='20'/>
        <span>Get Started</span>
      </Button>

      <Page fullWidth title="Integrate with ChargeZen" breadcrumbs={[{
        content: title, onAction: () => history.push('/integrations')
      }]}>
        <Layout>
          <Layout.Section>
            <Card>
              <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
              </Tabs>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Heading>{title}</Heading>
              <div className='roundedCard'>
                <Card sectioned>
                  <Stack alignment="center">
                    <Stack.Item>
                      <img src={require(`images/${title}`)} style={{maxWidth:"80px"}} />
                    </Stack.Item>

                    <Stack.Item>
                      <DisplayText size="small">{title}</DisplayText>
                    </Stack.Item>

                    {/* <Stack.Item fill>
                      Ac volutpat faucibus aliquet magna. Venenatis lectus amet,
                      sit placerat in. Viverra urna, varius sed nunc amet. Arcu
                      ut enim, cursus mattis congue nunc. Viverra risus eget
                      metus ullamcorper odio non dictum sed adipiscing. Ut leo,
                      dignissim urna turpis diam. Enim, rhoncus, in lacus,
                      magna. Mollis magna convallis urna, morbi ultrices.{' '}
                    </Stack.Item> */}
                  </Stack>
                </Card>
              </div>
          </Layout.Section>
          {
            fieldKeys.map(field=>(
              <>
              <Layout.Section>
              <TextField name={field} label={_.startCase(field)} value={formData[field] || ''} onChange={(value)=>setFormData({...formData,[field]:value})}  />
              </Layout.Section>
              </>
            ))
          }
          <Layout.Section>
          {
            fieldKeys.length && 
            <>
            <Stack>
            <Stack.Item>
              <div className="save-button">
              <Button onClick={handleSubmit} primary loading={loading} >Save</Button>
              </div>
            </Stack.Item>
            </Stack>
            </>
          }
          </Layout.Section>
          <Frame>
          {saveSuccess && (
            <Toast
              content="Setting is saved"
              onDismiss={hideSaveSuccess}
            />
          )}
        </Frame>
        </Layout>
      </Page>
    </AppLayout>
  );
};

export default IntegrationDetail;
