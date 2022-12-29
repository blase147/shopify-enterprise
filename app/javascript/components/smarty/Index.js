import { Frame, Page, Tabs, Layout, Icon, Card } from '@shopify/polaris';
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
import FlowForm from './Flow/NewForm';
import NewFlowForm from './Flow/NewForm';
import UpdateFlowForm from './Flow/UpdateForm';
import PixelIcon from '../../images/PixelIcon';
import HeaderButtons from '../HeaderButtons/HeaderButtons';

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
  // const handleTabChange = useCallback((selectedTabIndex) => {
  //   setSelectedTitleTab(selectedTabIndex);
  // }, []);


  const [headerButton, setHeaderButton] = useState("active")

  useEffect(() => {
    setSelectedTitleTab(headerButton)
  },
    [headerButton]
  );
  const headerButtons = [
    {
      val: 0,
      name: 'Messages',
    },
    ...(process.env.APP_TYPE == 'public'
      ? [
        {
          val: 1,
          name: 'Custom Messages',
        },
        {
          val: 2,
          name: 'Custom Keywords',
        },
      ]
      : []),
    {
      val: 3,
      name: 'Cancellation Reasons',
    },
    {
      val: 4,
      name: 'Collect Subscribers',
    },
    {
      val: 5,
      name: 'Flow',
    },
  ];

  const [editId, setEditId] = useState('');
  const [showEditPage, setShowEditPage] = useState(false);
  console.log(editId);

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
      <Card
        title={
          <div className="heading_title">
            <PixelIcon />
            Analytics
          </div>}
        actions={{
          content:
            <div className='tabButtons'>
              <HeaderButtons headerButtons={headerButtons} setHeaderButton={setHeaderButton} headerButton={headerButton} />
            </div>
        }}
      >
        <Card.Section subdued>
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
            {selectedTitleTab === (process.env.APP_TYPE == 'public' && 1) && (
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
            {selectedTitleTab === (process.env.APP_TYPE == 'public' && 2) && (
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
                  editId ? (
                    <UpdateFlowForm
                      id={editId}
                      handleClose={handleCloseEditPage}
                    />
                  ) : (
                    <NewFlowForm handleEditFlow={handleEditPage} handleClose={handleCloseEditPage} />
                  )
                ) : (
                  <FlowIndex handleEditFlow={handleEditPage} />
                )}
              </>
            )}
          </div>
        </Card.Section>
      </Card>
    </Frame>
  );
};

export default Smarty;
