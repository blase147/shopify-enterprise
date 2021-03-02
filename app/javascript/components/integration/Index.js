import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import AppLayout from '../layout/Layout';

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
} from '@shopify/polaris';

import getStart from 'images/get_start.svg';
import { map } from 'lodash';
import integrations from '../../lib/integrations';

const Integrations = () => {
  let tabs = integrations.map((item, index) => ({
    content: item.title,
    id: item.id,
  }));
  tabs = [{ content: 'All', id: 'all' }].concat(tabs);

  const [selected, setSelected] = useState(0);
  const [category, setCategory] = useState('all');

  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelected(selectedTabIndex);
    setCategory(tabs[selectedTabIndex].id);
  }, []);

  return (
    <AppLayout typePage="integrations" tabIndex="6">
      <Button>
        <img src={getStart} width="20" />
        <span>Get Started</span>
      </Button>

      <Page fullWidth title="Integrate with ChargeZen">
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

          {integrations
            .filter((item) => category == 'all' || item.id == category)
            .map((item, i) => (
              <Layout.Section>
                <Heading>{item.title}</Heading>
                <Stack spacing="loose">
                  {item.data?.map((childItem, i) => (
                    <Link
                      to={`/integration-detail/${item.id}/${childItem.title}`}
                      className="roundedCard"
                      key={i}
                    >
                      <Stack.Item>
                        <Card sectioned>
                          <Stack alignment="center">
                            <Stack.Item>
                              <img src={childItem.icon} />
                            </Stack.Item>

                            <Stack.Item fill>
                              <DisplayText size="small">
                                {childItem.title}
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
        </Layout>
      </Page>
    </AppLayout>
  );
};

export default Integrations;
