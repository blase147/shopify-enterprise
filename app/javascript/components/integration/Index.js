import React, { useState, useEffect, useCallback,useMemo } from 'react';
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
import _, { map } from 'lodash';
import integrations from '../../lib/integrations';
import { groupBy } from '../common/utils/utils';

const Integrations = () => {

  const mapCatagory=useMemo(() =>({
    all:"",
    sale:"sales",
    marketing:"marketing",
    report:"reporting_and_analytics",
    collabration:"collaboration",
    accounting:"accounting",
    customer:"customer_support_and_success",
    contract:"contract_management",
    tax:"tax_management"
  }),[])

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
            twilioAccountSid
            twilioAuthToken
            twilioPhoneNumber
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
    ...(process.env.APP_TYPE=="public" ? [{ content: 'All', id: 'all' }]:[])
  ].concat(tabs);

  const [selected, setSelected] = useState(0);
  const [category, setCategory] = useState(tabs[selected].id || 'all');

  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelected(selectedTabIndex);
    setCategory(tabs[selectedTabIndex].id);
  }, []);

  const [fetchIntegrations,{data:integerations,loading}]=useLazyQuery(IntegerationsQuery,{fetchPolicy:"network-only"})

  useEffect(()=>{
    fetchIntegrations({
      variables:{
        type:mapCatagory[category]
      }
    })
  },[category])

  let lodas= category=="all" && _.groupBy(integerations?.fetchIntegrations,"integrationType") || [];
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
          {/* Data from API's */}
          <Layout.Section>
          <Heading><span style={{textTransform:"capitalize"}} >{category}</span></Heading>
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
                  {
                    category=="all" ?
                      <>
                        {
                         lodas && Object.keys(lodas).map((key, i) => (
                          <Layout.Section>
                              <Heading>{_.startCase(key)}</Heading>
                            <Stack spacing="loose">
                              {lodas[key]?.map((childItem, i) => (
                                <Link
                                to={{ pathname: `/integration-detail/${childItem.id}/${childItem.name}/${childItem.keys}`, state: { credentials: childItem.credentials } }}
                                  className="roundedCard"
                                  key={i}
                                >
                                  <Stack.Item>
                                    <Card sectioned>
                                      <Stack alignment="center">
                                        <Stack.Item>
                                        <img src={require(`images/${childItem.name?.split(" ").join("").toLowerCase()}`)} style={{ maxWidth: "80px" }} />
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
                        ))}
                      </>:
                      <>
                        <Stack spacing="loose">
                          {
                            integerations?.fetchIntegrations && integerations?.fetchIntegrations?.map(item => (
                              <Link
                                to={{ pathname: `/integration-detail/${item.id}/${item.name}/${item.keys}`, state: { credentials: item.credentials } }}
                                className="roundedCard"
                                key={item.id}
                              >
                                <Stack.Item>
                                  <Card sectioned>
                                    <Stack alignment="center">
                                      <Stack.Item>
                                        {
                                          console.log("hello",item.name?.split(" ").join("").toLowerCase())
                                        }
                                        <img src={require(`images/${item.name?.split(" ").join("").toLowerCase()}`)} style={{ maxWidth: "80px" }} />
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
                  </>
          }
          </Layout.Section>
        </Layout>
      </Page>
    </AppLayout>
  );
};

export default Integrations;
