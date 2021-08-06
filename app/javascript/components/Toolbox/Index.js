import React,{ useState,useCallback,useEffect } from 'react'
import AppLayout from '../layout/Layout';
import {
    Page,
    Card,
    Layout
  } from '@shopify/polaris';
import SettingImage from '../../../assets/images/settings/setting.svg'
import EmailImage from '../../../assets/images/settings/email.svg'
import InformationImage from '../../../assets/images/settings/information.svg'
import Integrations from '../integration/Index';
import IntegrationDetail from '../integration/Detail';
import ShippingSuit from '../shippingSuit/index';

const Index = () => {

    const [selectedSetting,setSelectedSetting]=useState('');

    const [editId, setEditId] = useState("")
    const [showEditPage, setShowEditPage] = useState(false)

    const handleBackSetting=useCallback(()=>{
        setSelectedSetting('');
      },[setSelectedSetting])

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
      }, [selectedSetting])

    const settings=
        [
            {
                key: "toolbox",
                title: "Shipping Suite",
                img: SettingImage,
                desc: "View and update your SMS details for your store."
            },
            {
                key: "integerations",
                title: "Integrations",
                img: EmailImage,
                desc: "Manage upsell settings and customization for you and your customers."
            }
            // {
            //     key: "",
            //     title: "Products",
            //     img: InformationImage,
            //     desc: "Manage the loyalty and referrals settings for your customers."
            // }
        ]

    return (
        <AppLayout typePage="integrations" tabIndex="6">
        <Page title={selectedSetting ?settings.find(s=>s.key===selectedSetting).title:"Tiazen"}>
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
                                        onClick={() =>
                                          setSelectedSetting(setting.key)
                                        }
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
                         {
                             selectedSetting==='integerations'?
                             <>
                             {
                            !showEditPage ?
                             <Integrations
                              handleBack={handleBackSetting}
                              handleForm={handleEditPage}
                             />:
                             <IntegrationDetail
                             id={editId}
                             handleClose={handleCloseEditPage}
                             />
                             }
                             </>:
                             selectedSetting==='toolbox'?
                             <ShippingSuit />
                             :''
                         }
                          </Layout.Section>
                        </Layout>
                        </>
                      )}
                      </div>
        </Page>
        </AppLayout>
    )
}

export default Index
