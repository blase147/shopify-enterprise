import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Link , useHistory, useParams } from 'react-router-dom';
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
  Heading
} from '@shopify/polaris';

import getStart from 'images/get_start.svg';
import integrations from '../../lib/integrations';
import { map } from 'lodash';

const IntegrationDetail = () => {
  const history = useHistory();
  let { id, title } = useParams();

  let tabs = integrations.map((item, index)=> ({
    content: item.title,
    id: index
  }))

  tabs = [{content: 'All', id: 'all' }].concat(tabs)

  let category = integrations.filter((item) => item.id == id)[0];
  let item = category.data.filter((item) => item.title == title)[0];

  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  return (
    <AppLayout typePage="integrations" tabIndex='5'>
      <Button>
        <img src={getStart} width='20'/>
        <span>Get Started</span>
      </Button>

      <Page fullWidth title="Integrate with ChargeZen" breadcrumbs={[{
        content: category.title, onAction: () => history.push('/integrations')
      }]}>
        <Layout>
          <Layout.Section>
            <Card>
              <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
              </Tabs>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Heading>{item.title}</Heading>
              <div className='roundedCard'>
                <Card sectioned>
                  <Stack alignment="center">
                    <Stack.Item>
                      <img src={item.icon}/>
                    </Stack.Item>

                    <Stack.Item>
                      <DisplayText size="small">{item.title}</DisplayText>
                    </Stack.Item>

                    <Stack.Item fill>
                      Ac volutpat faucibus aliquet magna. Venenatis lectus amet,
                      sit placerat in. Viverra urna, varius sed nunc amet. Arcu
                      ut enim, cursus mattis congue nunc. Viverra risus eget
                      metus ullamcorper odio non dictum sed adipiscing. Ut leo,
                      dignissim urna turpis diam. Enim, rhoncus, in lacus,
                      magna. Mollis magna convallis urna, morbi ultrices.{' '}
                    </Stack.Item>
                  </Stack>
                </Card>
              </div>
          </Layout.Section>
        </Layout>
      </Page>
    </AppLayout>
  );
};

export default IntegrationDetail;
