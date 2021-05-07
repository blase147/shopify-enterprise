import React,{useMemo,useCallback,useState} from 'react'
import { Banner, Card, ContextualSaveBar, Form, Frame, Layout, List, Page, Spinner, Tabs, Toast } from '@shopify/polaris';
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
      id: 'taxes',
      content: 'Taxes',
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
    <Layout>
      <Layout.Section>
      <Tabs
            tabs={tabs}
            selected={selectedTitleTab}
            onSelect={handleTabChange}
          >
            {
              selectedTitleTab===0 ? <Discount/>:
              selectedTitleTab===1 ?<Export/>:
              selectedTitleTab===2 ? <Taxes/>:
              selectedTitleTab===3 ? <Legal/>:
              selectedTitleTab===4 ? <Translation/>:
              selectedTitleTab===5 ? <Password/>:""
            }
          </Tabs>
      </Layout.Section>
    </Layout>
  )
}

export default HouseKeeping
