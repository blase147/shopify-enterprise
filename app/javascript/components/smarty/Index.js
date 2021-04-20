import React from 'react';
import AppLayout from '../layout/Layout';

const Smarty = () => {
  return (
    <AppLayout typePage="settings" tabIndex="6">
    <Frame>
      <Page title="Settings">
        <Tabs
          tabs={tabs}
          selected={selectedTitleTab}
          onSelect={handleTabChange}
        >
    <div>
      <h1>Hello World</h1>
    </div>
    </Tabs>
        </Page>
      </Frame>
    </AppLayout>
  )
}

export default Smarty
