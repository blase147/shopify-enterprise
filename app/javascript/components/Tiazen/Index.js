import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '../layout/Layout';
import { Page, Card, Layout } from '@shopify/polaris';
import SettingImage from '../../../assets/images/settings/setting.svg';
import EmailImage from '../../../assets/images/settings/email.svg';
import InformationImage from '../../../assets/images/settings/information.svg';
import Smarty from '../smarty/Index';
import Upsell from '../upsell/Index';
import CreateUpsell from '../upsell/New';
import BuildBox from '../build-a-box/BuildBox';
import CreateBuildBox from '../build-a-box/CreateBuildBox';
import Bundles from '../bundles';
import BundleForm from '../bundles/BundleForm';
import WaysToEarnPoint from '../WaysToEarnPoint';

const Index = () => {
  const accessSettings = JSON.parse(localStorage.getItem("accessSettings"))
  const [selectedSetting, setSelectedSetting] = useState('');
  const [editId, setEditId] = useState('');
  const [showEditPage, setShowEditPage] = useState(false);

  const handleBackSetting = useCallback(() => {
    setSelectedSetting('');
  }, [setSelectedSetting]);

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
  }, [selectedSetting]);

  const settings = [
    {
      key: 'smarty_sms',
      title: 'SmartySMS',
      img: SettingImage,
      desc: 'View and update your SMS details for your store.',
    },
    {
      key: 'upsells',
      title: 'Upsells',
      img: EmailImage,
      desc: 'Manage upsell settings and customization for you and your customers.',
    },
    {
      key: 'build-box',
      title: 'Build-a-box Campaign',
      img: InformationImage,
      desc: 'Manage the loyalty and referrals settings for your customers.',
    },
    {
      key: 'bundles',
      title: 'Bundles',
      img: InformationImage,
      desc: 'Allow your customers to build bundles.',
    },
    accessTabs?.ways_to_earn && (
      {
        key: 'waysToEarnPoint',
        title: 'Ways To Earn Points ',
        img: InformationImage,
        desc: 'Create or update ways to earn points.',
      }
    )
  ];

  return (
    <AppLayout typePage="tiazen" tabIndex="6">
      <Page
        title={
          selectedSetting
            ? settings.find((s) => s.key === selectedSetting).title
            : 'Tiazen'
        }
      >
        <div className="settings-container">
          {!selectedSetting && (
            <>
              <div>
                <Card>
                  <Card.Section>
                    <div class="setting-grid">
                      {settings.map((setting) => (
                        <div
                          key={Math.random()}
                          class="tabs-parents pointer"
                          onClick={() => setSelectedSetting(setting.key)}
                        >
                          <div class="icon-sec">
                            <img src={setting.img} />
                          </div>
                          <div class="tab-info">
                            <h4>{setting.title}</h4>
                            <p>{setting.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Section>
                </Card>
              </div>
            </>
          )}
          {/* settings layout */}
          {selectedSetting && (
            <>
              <Layout>
                <Layout.Section>
                  {selectedSetting === 'smarty_sms' ? (
                    <>
                      <Smarty
                        handleBack={handleBackSetting}
                        handleForm={handleEditPage}
                      />
                    </>
                  ) : selectedSetting === 'upsells' ? (
                    <>
                      {showEditPage ? (
                        <CreateUpsell
                          id={editId}
                          handleClose={handleCloseEditPage}
                        />
                      ) : (
                        <Upsell
                          handleBack={handleBackSetting}
                          handleForm={handleEditPage}
                        />
                      )}
                    </>
                  ) : selectedSetting === 'build-box' ? (
                    <>
                      {showEditPage ? (
                        <CreateBuildBox
                          id={editId}
                          handleClose={handleCloseEditPage}
                        />
                      ) : (
                        <BuildBox
                          handleBack={handleBackSetting}
                          handleForm={handleEditPage}
                        />
                      )}
                    </>
                  ) : selectedSetting === 'bundles' ? (
                    <>
                      {showEditPage ? (
                        <BundleForm
                          id={editId}
                          handleClose={handleCloseEditPage}
                        />
                      ) : (
                        <Bundles
                          handleBack={handleBackSetting}
                          handleForm={handleEditPage}
                        />
                      )}
                    </>
                  ) : selectedSetting == "waysToEarnPoint" ? (
                    <>
                      <WaysToEarnPoint />
                    </>
                  ) :
                    (
                      ''
                    )}
                </Layout.Section>
              </Layout>
            </>
          )}
        </div>
      </Page>
    </AppLayout>
  );
};

export default Index;
