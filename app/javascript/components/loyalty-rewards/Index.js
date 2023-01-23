import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FilterContextProvider } from '../common/Contexts/AnalyticsFilterContext';
import Customize from './customize';
import Campaigns from './campaigns';
import LoyaltyPerformance from './LoyaltyPerformance';
import EmailTriggers from './EmailTriggers';
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
    Frame,
} from '@shopify/polaris';
import AppLayout from '../layout/Layout';

const LoyaltyRewards = ({ handleBack }) => {
    const [selectedTitleTab, setSelectedTitleTab] = useState(0);

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelectedTitleTab(selectedTabIndex),
        []
    );

    const tabLoyaltyRewards = [
        {
            id: 'customize',
            content: 'Customize',
        },
        // {
        //     id: 'campaigns',
        //     content: 'Campaigns',
        // },
        // {
        //     id: 'loyalty-performance',
        //     content: 'Loyalty Performance',
        // },
        // {
        //     id: 'email-triggers',
        //     content: 'Email Triggers',
        // },
        // {
        //     id: 'referral-performance',
        //     content: 'Referral Performance',
        // },
        // {
        //     id: 'point-overview',
        //     content: 'Point Overview',
        // },
    ];

    return (
        <>
            <Frame>
                <Page>
                    <div className="back-button pointer" onClick={handleBack}>
                        <Icon source={MobileBackArrowMajor} color="base" />
                    </div>
                    <FilterContextProvider>
                        <Tabs
                            tabs={tabLoyaltyRewards}
                            selected={selectedTitleTab}
                            onSelect={handleTabChange}
                        >
                            {
                                selectedTitleTab === 0 ? (
                                    <div className="customize">
                                        <Customize />
                                    </div>
                                )
                                    : selectedTitleTab === 1 ? (
                                        <div className="campaigns">
                                            <Campaigns />
                                        </div>
                                    )
                                        : selectedTitleTab === 2 ? (
                                            <div className="loyalty-performance">
                                                <LoyaltyPerformance />
                                            </div>
                                        )
                                            : selectedTitleTab === 3 ? (
                                                <div className="email-triggers">
                                                    <EmailTriggers />
                                                </div>
                                            )
                                                : selectedTitleTab === 4 ? (
                                                    <div className="referral-performance">
                                                        <></>
                                                    </div>
                                                )
                                                    : selectedTitleTab === 5 ? (
                                                        <div className="point-overview">
                                                            <></>
                                                        </div>
                                                    )
                                                        : ""
                            }
                        </Tabs>
                    </FilterContextProvider>
                </Page>
            </Frame>
        </>
    );
}
export default LoyaltyRewards;
