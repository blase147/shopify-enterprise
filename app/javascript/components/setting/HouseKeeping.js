import React,{useMemo,useCallback,useState} from 'react'
import { Banner, Card, ContextualSaveBar, Form, Frame, Layout, List, Page, Spinner, Tabs, Toast, RadioButton } from '@shopify/polaris';
import Discount from './HouseKeepingComponents/Discount';
import Export from './HouseKeepingComponents/Export';
import Taxes from './HouseKeepingComponents/Taxes';
import Legal from './Legal';
import Translation from './HouseKeepingComponents/Translation';
import Password from './HouseKeepingComponents/Password';
const HouseKeeping = () => {

  const tabs = useMemo(()=>([
    {
      id: 'discount',
      content: 'Discount',
    },
    {
      id: 'export',
      content: 'Export',
    },
    {
      id: 'sms',
      content: 'SMS',
    },
    {
      id: 'legal',
      content: 'Legal',
    },
    {
      id: 'translation',
      content: 'Translation',
    },
    {
      id: 'password',
      content: 'Password',
    }
  ]),[])

  const [selectedTitleTab, setSelectedTitleTab] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTitleTab(selectedTabIndex),
    [setSelectedTitleTab])

  return (
      // <Tabs
      //   tabs={tabs}
      //   selected={selectedTitleTab}
      //   onSelect={handleTabChange}
      // >
      //   {
      //     selectedTitleTab === 0 ? <Discount /> :
      //       selectedTitleTab === 1 ? <Export /> :
      //         selectedTitleTab === 2 ? <Taxes /> :
      //           selectedTitleTab === 3 ? <Legal /> :
      //             selectedTitleTab === 4 ? <Translation /> :
      //               selectedTitleTab === 5 ? <Password /> : ""
      //   }
      // </Tabs>
      <>
      <div className="tab-section">
        <div class="tab-parent">
          <div class="tabs">
            <input type="radio" name="tab-btn" id="tab-btn-1" value="" checked />
            <label for="tab-btn-1">Tab 1</label>
            <input type="radio" name="tab-btn" id="tab-btn-2" value="" />
            <label for="tab-btn-2">Tab 2</label>
            <input type="radio" name="tab-btn" id="tab-btn-3" value="" />
            <label for="tab-btn-3">SMS</label>
            <div id="content-1">
              Content 1...
          </div>
            <div id="content-2">
              Content 2...
          </div>
            <div id="content-3">

              <Layout>
                <Layout.Section>
                  <div class="tabs-btn">
                    <button class="save-btn" type="button">Save</button>
                    <button class="cancel-btn" type="button">Cancel</button>
                  </div>
                  <div className="smarty-sms-number">
                    <div className="action-smarty">
                      <p>Your SmartySMS Number is 345 567 4564</p>
                      <RadioButton label="Activate SmartySMS" id="active-sms" name="accounts" />
                      <RadioButton
                        label="Disable SmartySMS"
                        id="diable-sms"
                        name="accounts"
                      />
                    </div>
                    <div className="sms-usage">
                      <p> SmartySMS Usage:</p>
                      <p>2345 SMS  <span>$35.45</span></p>
                    </div>
                  </div>
                </Layout.Section>
              </Layout>
              <Taxes />
            </div>
          </div>
         
        </div>
      </div>
      </>
  )
}

export default HouseKeeping
