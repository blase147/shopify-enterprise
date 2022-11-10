import { Navigation } from '@shopify/polaris';
import React from 'react';
import "./nav_style.scss";
import { HomeMajor, SettingsMinor, AnalyticsMajor, HintMajor, ProfileMajor, InstallMinor } from "@shopify/polaris-icons";
import { MangeIcon, SubscriptionIcon, ToolboxIcon } from './CustomIcon';

const DisabledNav = () => {
    let navigation = [
        {
            icon: HomeMajor,
            label: 'Dashboard',
        },
        {
            label: 'Manage Plans',
            icon: () => <MangeIcon />,
        },
        {
            label: 'Subscriptions Orders',
            icon: () => <SubscriptionIcon />,
        },
        {
            label: 'Analytics',
            icon: AnalyticsMajor,
        },
        {
            label: 'Installation',
            icon: InstallMinor,
        },
        {
            label: 'Tiazen',
            icon: HintMajor,
        },
        {
            label: "Toolbox",
            icon: () => <ToolboxIcon />,
        },
        {
            label: "Mange Staff",
            icon: ProfileMajor,
        },
        {
            label: "Settings",
            icon: SettingsMinor,
        }]
    return (
        <div className='navBar'>
            {
                <div className="sidBartabs">
                    <Navigation location='\'>
                        <Navigation.Section
                            items={navigation}
                        />
                    </Navigation>
                </div>
            }
        </div>
    )
}

export default DisabledNav;