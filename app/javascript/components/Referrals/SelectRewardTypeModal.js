import React from "react";
import { Button, Card, Icon, Modal, ResourceItem, ResourceList, TextContainer } from "@shopify/polaris";
import {
    CancelSmallMinor, DiscountsMajor, CashDollarMajor, GiftCardMajor
} from '@shopify/polaris-icons';

const SelectRewardTypeModal = ({ formData, setFormData, modalActive, handleModalChange }) => {
    const rewardsOptions = [
        {
            key: 'Amount discount',
            value: 'amount_discount',
            icon: CashDollarMajor
        },
        {
            key: 'Percentage Off',
            value: 'percentage_off',
            icon: DiscountsMajor
        },
    ]
    const createResourceList = (items) => {
        return (
            <ResourceList
                resourceName={{ singular: 'Reward', plural: 'Rewards' }}
                items={items}
                renderItem={(item) => {
                    const { key, value, icon } = item;
                    const media = <Icon source={icon} color="base" />;

                    return (
                        <ResourceItem
                            media={media}
                        >
                            <div className="rewards_list_items" onClick={() => setFormData({ ...formData, reward_type: value })}>
                                {key}
                            </div>
                        </ResourceItem>
                    );
                }}
            />
        )
    }
    return (
        <div className="SelectRewardTypeModal">
            <Modal
                title=""
                open={modalActive}
                onClose={handleModalChange}
            >
                <Card>
                    <Card.Section>
                        <div className="SelectRewardTypeModal header_card_section">
                            <div className="addReferralRewardTitleMain">
                                <div className="addReferralRewardTitle">
                                    Select customer reward
                                </div>
                                {/* <div className="closeModalButton" onClick={() => handleModalChange()}>
                                    <Icon source={CancelSmallMinor} color="base" />
                                </div> */}
                            </div>
                        </div>
                    </Card.Section>
                    <Card.Section title="Online Store">
                        <div className="SelectRewardTypeModal rewards_list">
                            {createResourceList(rewardsOptions)}
                        </div>
                    </Card.Section>

                    <Card.Section title="Points Rewards">
                        <div className="SelectRewardTypeModal points_reward">
                            {createResourceList([{ key: "Points", value: "points", icon: GiftCardMajor }])}
                        </div>
                    </Card.Section>
                    <Card.Section>
                        <div className="SelectRewardTypeModal footer">
                            <div className="footer_button">
                                <Button primary onClick={() => handleModalChange()}>Cancel</Button>
                            </div>
                        </div>
                    </Card.Section>

                </Card>
            </Modal>
        </div >
    )
}

export default SelectRewardTypeModal;