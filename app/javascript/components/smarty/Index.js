import { Frame, Page, Tabs } from '@shopify/polaris';
import React, { useCallback, useState } from 'react';
import AppLayout from '../layout/Layout';
import SmartyMessage from './SmartyMessage';

const Smarty = () => {
  const [selectedTitleTab, setSelectedTitleTab] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTitleTab(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: 'tab-messages',
      content: 'Messages',
    },
    {
      id: 'tab-custom-messages',
      content: 'Custom Messages',
    },
    {
      id: 'tab-custom-keywords',
      content: 'Custom Keywords',
    },
    {
      id: 'cancellation-reasons',
      content: 'Cancellation Reasons',
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
              <SmartyMessage/>
            }
            {
              selectedTitleTab===1 && 
              <div>Custom Messages</div>
            }
            {
              selectedTitleTab===2 && 
              <div>Custom Keywords</div>
            }
            {
              selectedTitleTab===3 && 
              <div>Cancellation Reasons</div>
            }
          </Tabs>
        </Page>
      </Frame>
    </AppLayout>
  )
}

export default Smarty
