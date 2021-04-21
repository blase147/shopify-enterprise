import { Frame, Page, Tabs } from '@shopify/polaris';
import React, { useCallback, useState, useEffect } from 'react';
import AppLayout from '../layout/Layout';
import CancellationReasons from './CancellationReasons/CancellationReasons';
import CustomKeywords from './CustomKeywords/CustomKeywords';
import CustomMessage from './CustomMessage/CustomMessage';
import EditSmartyMessage from './SmartyMessage/EditSmartyMessage';
import SmartyMessage from './SmartyMessage/SmartyMessage';

const Smarty = () => {
  const [selectedTitleTab, setSelectedTitleTab] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => 
    {
      setSelectedTitleTab(selectedTabIndex);
    },
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

  

  const [smartySMSID, setsmartySMSID] = useState("")
  const [showEditPage, setShowEditPage] = useState(false)

  const handleCloseSmartyMessage = useCallback(() => {
    setShowEditPage(false);
    setsmartySMSID("")
  }, [setShowEditPage, smartySMSID])

  const handleEditSmartyMessage = useCallback(ID => {
    setsmartySMSID(ID)
    setShowEditPage(true)
  }, [setsmartySMSID, setShowEditPage])

  useEffect(() => {
    setShowEditPage(false);
    setsmartySMSID("")
  }, [selectedTitleTab])

  return (
    <AppLayout typePage="smarty" tabIndex="6">
      <Frame>
        <Page title="Smarty SMS">
          <Tabs
            tabs={tabs}
            selected={selectedTitleTab}
            onSelect={handleTabChange}
          >
            {
              selectedTitleTab===0 && 
              <>
              {
                  showEditPage ?
                    <EditSmartyMessage
                      id={smartySMSID}
                      handleClose={handleCloseSmartyMessage}
                    /> :
                    <SmartyMessage
                      handleEditSmartyMessage={handleEditSmartyMessage}
                    />
              }
                
              </>
            }
            {
              selectedTitleTab===1 && 
              <>
              <CustomMessage />
              </>
            }
            {
              selectedTitleTab===2 && 
              <>
              <CustomKeywords />
              </>
            }
            {
              selectedTitleTab===3 && 
              <>
              <CancellationReasons />
              </>
            }
          </Tabs>
        </Page>
      </Frame>
    </AppLayout>
  )
}

export default Smarty
