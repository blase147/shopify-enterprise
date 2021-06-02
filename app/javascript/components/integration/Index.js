import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import AppLayout from '../layout/Layout';
import { gql, useLazyQuery } from '@apollo/client';
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
  Spinner
} from '@shopify/polaris';

import getStart from 'images/get_start.svg';
import { map } from 'lodash';
import integrations from '../../lib/integrations';

const Integrations = () => {

  const IntegerationsQuery=gql`
  query($type:String!){
      fetchIntegrations(type: $type) {
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
          keys
      }
}`

  let tabs = integrations.map((item, index) => ({
    content: item.title,
    id: item.id,
  }));
  tabs = [
    // { content: 'All', id: 'all' }
  ].concat(tabs);

  const [selected, setSelected] = useState(0);
  const [category, setCategory] = useState(tabs[selected].id || 'all');

  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelected(selectedTabIndex);
    setCategory(tabs[selectedTabIndex].id);
  }, []);

  const [fetchIntegrations,{data:integerations,loading}]=useLazyQuery(IntegerationsQuery,{fetchPolicy:"network-only"})
  useEffect(()=>{
    
  },[])

  useEffect(()=>{
    console.log(integerations);
  },[integerations])

  useEffect(()=>{
    fetchIntegrations({
      variables:{
        type:category
      }
    })
  },[category])

  return (
    <AppLayout typePage="integrations" tabIndex="7">
      <Button>
        <img src={getStart} width="20" />
        <span>Get Started</span>
      </Button>
      <Page fullWidth title={process.env.APP_TYPE=="public"?"Integrate with ChargeZen":"Integrations"}>
        <Layout>
          <Layout.Section>
            <Card>
              <Tabs
                tabs={tabs}
                selected={selected}
                onSelect={handleTabChange}
              ></Tabs>
            </Card>
          </Layout.Section>
          <Layout.Section>
          <Heading>{category}</Heading>
          {
            (loading) ? (
              <Card>
                <Spinner
                  accessibilityLabel="Spinner example"
                  size="large"
                  color="teal"
                />
              </Card>
            ):
                  <>
                  <Stack spacing="loose">
                    {
                      integerations?.fetchIntegrations && integerations?.fetchIntegrations?.map(item => (
                        <Link
                          to={{pathname:`/integration-detail/${item.id}/${item.name}/${item.keys}`,state:{credentials:item.credentials}}}
                          className="roundedCard"
                          key={item.id}
                        >
                          <Stack.Item>
                            <Card sectioned>
                              <Stack alignment="center">
                                <Stack.Item>
                                  <img src={require(`images/${item.name}`)} style={{ maxWidth: "80px" }} />
                                </Stack.Item>
                                <Stack.Item fill>
                                  <DisplayText size="small">
                                    {item.name}
                                  </DisplayText>
                                </Stack.Item>
                              </Stack>
                            </Card>
                          </Stack.Item>
                        </Link>
                      ))
                    }
                    </Stack>
                  </>
          }
          </Layout.Section>
          {/* {integrations
            .filter((item) => category == 'all' || item.id == category)
            .map((item, i) => (
              <Layout.Section>
                <Heading>{item.title}</Heading>
                <Stack spacing="loose">
                  {item.data?.map((childItem, i) => (
                    <Link
                      to={`/integration-detail/${item.id}/${childItem.name}`}
                      className="roundedCard"
                      key={i}
                    >
                      <Stack.Item>
                        <Card sectioned>
                          <Stack alignment="center">
                            <Stack.Item>
                              <img src={`images/${item.name}.svg`} />
                            </Stack.Item>
                            <Stack.Item fill>
                              <DisplayText size="small">
                                {childItem.name}
                              </DisplayText>
                            </Stack.Item>
                          </Stack>
                        </Card>
                      </Stack.Item>
                    </Link>
                  ))}
                </Stack>
              </Layout.Section>
            ))} */}
        </Layout>
      </Page>
    </AppLayout>
  );
};

export default Integrations;
