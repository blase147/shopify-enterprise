import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import {
  MobileBackArrowMajor
} from '@shopify/polaris-icons';
import getStart from 'images/get_start.svg';
import _, { map } from 'lodash';
import integrations from '../../lib/integrations';
import { groupBy } from '../common/utils/utils';
import LoadingScreen from '../LoadingScreen';
import IntegrationDetail from "../integration/Detail"
import PixelIcon from '../../images/PixelIcon';
import HeaderButtons from '../HeaderButtons/HeaderButtons';

const Integrations = ({ handleBack, handleForm }) => {

  const mapCatagory = useMemo(() => ({
    all: "",
    sale: "sales",
    marketing: "marketing",
    report: "reporting_and_analytics",
    collabration: "collaboration",
    accounting: "accounting",
    customer: "customer_support_and_success",
    contract: "contract_management",
    tax: "tax_management"
  }), [])

  const IntegerationsQuery = gql`
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


  const [headerButton, setHeaderButton] = useState(0)

  let headerButtons = integrations.map((item, index) => ({
    name: item.title,
    id: item.id,
    val: index
  }));

  headerButtons = [
    ...(process.env.APP_TYPE == "public" ? [{ content: 'All', id: 'all', val: 0 }] : [])
  ].concat(headerButtons);

  const [selected, setSelected] = useState(0);
  const [category, setCategory] = useState(headerButtons[selected].id || 'all');

  useEffect(() => {
    setSelected(headerButton);
    setCategory(headerButtons[headerButton].id);
  }, [headerButton]);

  const [fetchIntegrations, { data: integerations, loading }] = useLazyQuery(IntegerationsQuery, { fetchPolicy: "network-only" })

  useEffect(() => {
    fetchIntegrations({
      variables: {
        type: mapCatagory[category]
      }
    })
  }, [category])

  let lodas = category == "all" && _.groupBy(integerations?.fetchIntegrations, "integrationType") || [];
  const [detail, setDetail] = useState(false);
  const [editId, setEditId] = useState();
  const [editTitle, setEditTitle] = useState();
  const [editKeys, setEditKeys] = useState();
  const handleCloseEditPage = () => {
    setDetail(false)
  }
  return (
    <Frame>
      <Page>
        {detail ?
          <IntegrationDetail id={editId} title={editTitle} keys={editKeys} handleClose={handleCloseEditPage} />
          :
          <div fullWidth title={process.env.APP_TYPE == "public" ? "Integrate with ChargeZen" : "Integrations"}>
            <Layout>

              <Layout.Section>
                <div className="back-button pointer" style={{ float: "left" }} onClick={handleBack}>
                  <Icon
                    source={MobileBackArrowMajor}
                    color="base" />
                </div>
              </Layout.Section>
              <Layout.Section>
                <Button>
                  <img src={getStart} width="20" />
                  <span>Get Started</span>
                </Button>
              </Layout.Section>
              <Layout.Section>
                <Card
                  title={
                    <div className="heading_title">
                      <PixelIcon />
                      Integrations
                    </div>}
                  actions={{
                    content:
                      <div className='tabButtons'>
                        <HeaderButtons headerButtons={headerButtons} setHeaderButton={setHeaderButton} headerButton={headerButton} />
                      </div>
                  }}
                >
                </Card>
              </Layout.Section>
              {/* Data from API's */}
              <Layout.Section>
                <Heading><span style={{ textTransform: "capitalize" }} >{category}</span></Heading>
                {
                  (loading) ? (
                    <Card>
                      <LoadingScreen />
                    </Card>
                  ) :
                    <>
                      {
                        category == "all" ?
                          <>
                            {
                              lodas && Object.keys(lodas).map((key, i) => (
                                <Layout.Section>
                                  <Heading>{_.startCase(key)}</Heading>
                                  <Stack spacing="loose">
                                    {lodas[key]?.map((childItem, i) => (
                                      <Button onClick={() => {
                                        setEditId(childItem?.id)
                                        setEditTitle(childItem?.name)
                                        setEditKeys(childItem?.keys)
                                        setDetail(true)
                                      }}>
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
                                      </Button>
                                    ))}
                                  </Stack>
                                </Layout.Section>
                              ))}
                          </> :
                          <>
                            <Stack spacing="loose">
                              {
                                integerations?.fetchIntegrations && integerations?.fetchIntegrations?.map(item => (

                                  <Button onClick={() => {
                                    setEditId(item?.id)
                                    setEditTitle(item?.name)
                                    setEditKeys(item?.keys)
                                    setDetail(true)
                                  }}>
                                    <Stack.Item>
                                      <Card sectioned>
                                        <Stack alignment="center">
                                          <Stack.Item>
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
                                  </Button>
                                ))
                              }
                            </Stack>
                          </>
                      }
                    </>
                }
              </Layout.Section>
            </Layout>
          </div>
        }
      </Page>
    </Frame>
  );
};

export default Integrations;
