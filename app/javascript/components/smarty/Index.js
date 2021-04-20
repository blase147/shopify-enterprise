import React, {useState, useCallback} from 'react';
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
  Tabs,
  FormLayout,
  Select,
  TextStyle,
  ChoiceList,
  Checkbox,
  Button,
} from '@shopify/polaris';

const Smarty = () => {
  const [selectedTitleTab, setSelectedTitleTab] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTitleTab(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: 'A',
      content: 'Tab A',
    },
    {
      id: 'B',
      content: 'Tab B',
    },
    {
      id: 'C',
      content: 'Tab C',
    },
    {
      id: 'D',
      content: 'Tab D',
    },
  ];
  return (
    <AppLayout typePage="smarty" tabIndex="6">
      <Frame>
        <Page title="Smarty">
          <Tabs
            tabs={tabs}
            selected={selectedTitleTab}
            onSelect={handleTabChange}
          >
            {
              selectedTitleTab===0 && 
              <div>A</div>
            }
            {
              selectedTitleTab===1 && 
              <div>B</div>
            }
            {
              selectedTitleTab===2 && 
              <div>C</div>
            }
            {
              selectedTitleTab===3 && 
              <div>D</div>
            }
          </Tabs>
        </Page>
      </Frame>
    </AppLayout>
  )
}

export default Smarty
