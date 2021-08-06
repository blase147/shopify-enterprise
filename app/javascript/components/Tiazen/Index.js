import React,{ useState,useEffect,useCallback } from 'react'
import AppLayout from '../layout/Layout';
import {
    Page,
    Card,
    Layout
  } from '@shopify/polaris';
import SettingImage from '../../../assets/images/settings/setting.svg'
import EmailImage from '../../../assets/images/settings/email.svg'
import InformationImage from '../../../assets/images/settings/information.svg'
import Smarty from '../smarty/Index';
import Upsell from '../upsell/Index';
import CreateUpsell from '../upsell/New';
import BuildBox from '../build-a-box/BuildBox';
import CreateBuildBox from '../build-a-box/CreateBuildBox';


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
          key:"smarty_sms",
          title:"SmartySMS",
          img:SettingImage,
          desc:"View and update your SMS details for your store."
        },
        {
          key:"upsells",
          title:"Upsells",
          img:EmailImage,
          desc:"Manage upsell settings and customization for you and your customers."
        },
        // {
        //     key:"",
        //     title:"Loyalty & Referrals",
        //     img:InformationImage,
        //     desc:"Manage the loyalty and referrals settings for your customers."
        // },
        {
            key:"build-box",
            title:"Build-a-box Campaign",
            img:InformationImage,
            desc:"Manage the loyalty and referrals settings for your customers."
        }
    ]

    return (
        <AppLayout typePage="tiazen" tabIndex="5">
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
                             selectedSetting==='smarty_sms'?
                             <>
                             <Smarty
                             handleBack={handleBackSetting}
                             handleForm={handleEditPage}
                             />
                             </>:
                             selectedSetting==='upsells'?
                             <>
                             {
                             showEditPage ?
                             <CreateUpsell
                             id={editId}
                             handleClose={handleCloseEditPage}
                             />:
                            <Upsell
                            handleBack={handleBackSetting}
                            handleForm={handleEditPage}
                             />
                            }
                             </>:
                             selectedSetting==='build-box'?
                             <>
                             {
                               showEditPage ?
                               <CreateBuildBox
                                id={editId}
                                handleClose={handleCloseEditPage}
                                />:
                               <BuildBox
                               handleBack={handleBackSetting}
                               handleForm={handleEditPage} />
                             }
                             </>:
                             ''
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
