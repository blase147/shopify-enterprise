import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {FilterContextProvider} from '../common/Contexts/AnalyticsFilterContext';
import AppLayout from '../layout/Layout';
import { MobileBackArrowMajor } from '@shopify/polaris-icons';
import {
  Card,
  Select,
  FormLayout,
  Button,
  Icon,
  Modal,
  TextField,
  Layout,
  Page,
  Stack,
  Tabs,
  ColorPicker,
} from '@shopify/polaris';

const LoyaltyRewards = ({handleBack}) => {
    const [selectedTitleTab, setSelectedTitleTab] = useState(0);
  
    const handleTabChange = useCallback(
      (selectedTabIndex) => setSelectedTitleTab(selectedTabIndex),
      []
    );
    const [color, setColor] = useState({
      hue: 120,
      brightness: 1,
      saturation: 1,
    });
  
    const tabLoyaltyRewards = [
      {
        id: 'program-roi',
        content: 'Program ROI',
      },
      {
        id: 'loyalty-performance',
        content: 'Loyalty Performance',
      },
      {
        id: 'referral-performance',
        content: 'Referral Performance',
      },
      {
        id: 'point-overview',
        content: 'Point Overview',
      },
      {
        id: 'reports',
        content: 'Reports',
      },
    ];
    
  return (
    <>
        <div className="back-button pointer" onClick={handleBack}>
            <Icon source={MobileBackArrowMajor} color="base" />
        </div>
        <FilterContextProvider>
            {/* <Tabs
                tabs={tabLoyaltyRewards}
                selected={selectedTitleTab}
                onSelect={handleTabChange}
            >
                {   
                    selectedTitleTab === 0 ? (
                        <div className="program-roi">
                            <></> 
                    </div>
                    ) 
                    : selectedTitleTab === 1 ? (
                        <div className="loyalty-performance">
                            <></> 
                        </div>
                    ) 
                    : selectedTitleTab === 2 ? (
                        <div className="referral-performance">
                            <></> 
                        </div>
                    )
                    : selectedTitleTab === 3 ? (
                        <div className="point-overview">
                            <></> 
                        </div>
                    ) 
                    : selectedTitleTab === 4 ? (
                        <div className="reports">
                            <></> 
                        </div>
                    )
                    : ""
                }
            </Tabs> */}
            <FormLayout>
                <Card 
                    title="Customize" 
                    sectioned 
                    primaryFooterAction={{content: 'Save and Continue'}}
                    footerActionAlignment="left"
                >
                    <div>
                        <TextField type="text" label="Name your Loyalty Program" placeholder='Subscribe and Save' autoComplete="off" />                        
                        <TextField type="text" label="Select Loyalty Location" placeholder='Customer portal' autoComplete="off" />
                    </div>
                    
                    <div>
                        <h3>COLORS</h3>                  
                        <div>
                            <p>Primary Theme Color</p>
                            <ColorPicker onChange={setColor} color={color} />
                            <TextField type="text" placeholder='None' onChange={() => {}} autoComplete="off" />

                            <p>Secondary Theme Color</p>
                            <ColorPicker onChange={setColor} color={color} />
                            <TextField type="text" placeholder='None' onChange={() => {}} autoComplete="off" />
                        </div>    
                        <div>
                            <p>Primary Text Color</p>
                            <ColorPicker onChange={setColor} color={color} />
                            <TextField type="text" placeholder='None' onChange={() => {}} autoComplete="off" />

                            <p>Secondary Text Color</p>
                            <ColorPicker onChange={setColor} color={color} />
                            <TextField type="text" placeholder='None' onChange={() => {}} autoComplete="off" />
                        </div>
                    </div>
                </Card>
            </FormLayout>
        </FilterContextProvider>
    </>
  );
}
export default LoyaltyRewards;