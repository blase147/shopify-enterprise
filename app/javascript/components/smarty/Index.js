import { Frame, Page, Tabs } from '@shopify/polaris';
import React, { useCallback, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import AppLayout from '../layout/Layout';
import CancellationReasonForm from './CancellationReasons/CancellationReasonForm';
import CancellationReasons from './CancellationReasons/CancellationReasons';
import CustomKeywords from './CustomKeywords/CustomKeywords';
import CustomKeywordsForm from './CustomKeywords/CustomKeywordsForm';
import CustomMessage from './CustomMessage/CustomMessage';
import EditSmartyMessage from './SmartyMessage/EditSmartyMessage';
import SmartyMessage from './SmartyMessage/SmartyMessage';

const Smarty = () => {
  const location=useLocation();
  const [selectedTitleTab, setSelectedTitleTab] = useState(location.state?.tabIndex || 0);

  useEffect(() => {
   if(location?.state?.tabIndex && selectedTitleTab!==location?.state?.tabIndex){
    setSelectedTitleTab(location.state.tabIndex)
   }
  }, [location?.state])
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

  

  const [editId, setEditId] = useState("")
  const [showEditPage, setShowEditPage] = useState(false)

  const handleCloseEditPage = useCallback(() => {
    setShowEditPage(false);
    setEditId("")
  }, [setShowEditPage, editId])

  const handleEditPage = useCallback(ID => {
    setEditId(ID)
    setShowEditPage(true)
  }, [setEditId, setShowEditPage])

  useEffect(() => {
    setShowEditPage(false);
    setEditId("")
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
                      id={editId}
                      handleClose={handleCloseEditPage}
                    /> :
                    <SmartyMessage
                      handleEditSmartyMessage={handleEditPage}
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
              {
                 showEditPage ?
                 <CustomKeywordsForm
                 id={editId}
                 handleClose={handleCloseEditPage}
                 /> :
                 <CustomKeywords handleEditCustomKewords={handleEditPage}/>
                
              }
              
              </>
            }
            {
              selectedTitleTab===3 && 
              <>
              {
                  showEditPage ?
                    <CancellationReasonForm
                      id={editId}
                      handleClose={handleCloseEditPage}
                    /> :
                    <CancellationReasons 
                      handleEditCancellation={handleEditPage}
              />
              }
              </>
            }
          </Tabs>
        </Page>
      </Frame>
    </AppLayout>
  )
}

export default Smarty
