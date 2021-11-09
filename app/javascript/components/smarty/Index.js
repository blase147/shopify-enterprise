import { Frame, Page, Tabs, Layout, Icon } from '@shopify/polaris';
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
import '../smarty/tiazan.css';
import { MobileBackArrowMajor } from '@shopify/polaris-icons';
import CollectSubscribers from './CollectSubscribers';
import FlowIndex from './Flow';
import FlowForm from './Flow/form';

const Smarty = ({ handleBack }) => {
  const location = useLocation();
  const [selectedTitleTab, setSelectedTitleTab] = useState(
    location.state?.tabIndex || 0
  );

  useEffect(() => {
    if (
      location?.state?.tabIndex &&
      selectedTitleTab !== location?.state?.tabIndex
    ) {
      setSelectedTitleTab(location.state.tabIndex);
    }
  }, [location?.state]);
  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelectedTitleTab(selectedTabIndex);
  }, []);

  const tabs = [
    {
      id: 'tab-messages',
      content: 'Messages',
    },
    ...(process.env.APP_TYPE == 'public'
      ? [
          {
            id: 'tab-custom-messages',
            content: 'Custom Messages',
          },
          {
            id: 'tab-custom-keywords',
            content: 'Custom Keywords',
          },
        ]
      : []),
    {
      id: 'cancellation-reasons',
      content: 'Cancellation Reasons',
    },
    {
      id: 'collect-subscribers',
      content: 'Collect Subscribers',
    },
    {
      id: 'flow',
      content: 'Flow',
    },
  ];

  const [editId, setEditId] = useState('');
  const [showEditPage, setShowEditPage] = useState(false);

  const handleCloseEditPage = useCallback(() => {
    setShowEditPage(false);
    setEditId('');
  }, [setShowEditPage, editId]);

  const handleEditPage = useCallback(
    (ID) => {
      setEditId(ID);
      setShowEditPage(true);
    },
    [setEditId, setShowEditPage]
  );

  useEffect(() => {
    setShowEditPage(false);
    setEditId('');
  }, [selectedTitleTab]);

  return (
    <Frame>
      <Layout>
        <Layout.Section>
          <div className="back-button pointer" onClick={handleBack}>
            <Icon source={MobileBackArrowMajor} color="base" />
          </div>
        </Layout.Section>
      </Layout>
      <Tabs tabs={tabs} selected={selectedTitleTab} onSelect={handleTabChange}>
        <div className="tizen-page">
          {selectedTitleTab === 0 && (
            <>
              {showEditPage ? (
                <EditSmartyMessage
                  id={editId}
                  handleClose={handleCloseEditPage}
                />
              ) : (
                <SmartyMessage handleEditSmartyMessage={handleEditPage} />
              )}
            </>
          )}
          {selectedTitleTab === (process.env.APP_TYPE == 'public' ? 1 : 2) && (
            <>
              {showEditPage ? (
                <EditSmartyMessage
                  id={editId}
                  handleClose={handleCloseEditPage}
                />
              ) : (
                <CustomMessage handleEditSmartyMessage={handleEditPage} />
              )}
            </>
          )}
          {selectedTitleTab === (process.env.APP_TYPE == 'public' ? 2 : 3) && (
            <>
              {showEditPage ? (
                <CustomKeywordsForm
                  id={editId}
                  handleClose={handleCloseEditPage}
                />
              ) : (
                <CustomKeywords handleEditCustomKewords={handleEditPage} />
              )}
            </>
          )}
          {selectedTitleTab === (process.env.APP_TYPE == 'public' ? 3 : 1) && (
            <>
              {showEditPage && (
                <CancellationReasonForm
                  id={editId}
                  handleClose={handleCloseEditPage}
                />
              )}
              <CancellationReasons handleEditCancellation={handleEditPage} />
            </>
          )}
          {selectedTitleTab === (process.env.APP_TYPE == 'public' ? 4 : 2) && (
            <CollectSubscribers />
          )}
          {selectedTitleTab === (process.env.APP_TYPE == 'public' ? 5 : 3) && (
            <>
              {showEditPage ? (
                <FlowForm id={editId} handleClose={handleCloseEditPage} />
              ) : (
                <FlowIndex handleEditFlow={handleEditPage} />
              )}
            </>
          )}
        </div>
      </Tabs>
    </Frame>
  );
};

export default Smarty;
