import React from "react";
import { Card, Frame, Icon, Layout, Page } from "@shopify/polaris";
import AppLayout from '../layout/Layout';
import {
    ThumbsUpMajor, CaretUpMinor, SmileyJoyMajor
} from '@shopify/polaris-icons';
import PixelIcon from "../../images/PixelIcon";

const Notifications = () => {
    return (
        <AppLayout typePage="settings" tabIndex="8">
            <Frame>
                <Page>
                    <Layout>
                        <Layout.Section>

                            <div className="notifications_main_div">
                                <div className="customer_activity_main_div">
                                    <Card title={<div className="heading_title"><PixelIcon /> Notifications</div>} >
                                        <Card.Section>
                                            <div className="customer_activity_div">
                                                <img className="avatar" src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/ba/29/5c/img-worlds-of-adventure.jpg?w=1200&h=-1&s=1" />
                                                <div className="customer_activity_right">
                                                    <div className="heading">
                                                        <h2>Margareth Zend</h2>
                                                        <h3>4 Meal Box - Trial</h3>
                                                    </div>
                                                    <div className="body">
                                                        <Icon
                                                            source={ThumbsUpMajor}
                                                            color="base"
                                                        />
                                                        <h6>Selected Meals for Week 42, 2022</h6>
                                                        <h6>12 hours ago</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="customer_activity_div">
                                                <img className="avatar" src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/ba/29/5c/img-worlds-of-adventure.jpg?w=1200&h=-1&s=1" />
                                                <div className="customer_activity_right">
                                                    <div className="heading">
                                                        <h2>Margareth Zend</h2>
                                                        <h3>4 Meal Box - Trial</h3>
                                                    </div>
                                                    <div className="body">
                                                        <Icon
                                                            source={ThumbsUpMajor}
                                                            color="base"
                                                        />
                                                        <h6>Selected Meals for Week 42, 2022</h6>
                                                        <h6>12 hours ago</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="customer_activity_div">
                                                <img className="avatar" src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/ba/29/5c/img-worlds-of-adventure.jpg?w=1200&h=-1&s=1" />
                                                <div className="customer_activity_right">
                                                    <div className="heading">
                                                        <h2>Margareth Zend</h2>
                                                        <h3>4 Meal Box - Trial</h3>
                                                    </div>
                                                    <div className="body">
                                                        <Icon
                                                            source={ThumbsUpMajor}
                                                            color="base"
                                                        />
                                                        <h6>Selected Meals for Week 42, 2022</h6>
                                                        <h6>12 hours ago</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="customer_activity_div">
                                                <img className="avatar" src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/ba/29/5c/img-worlds-of-adventure.jpg?w=1200&h=-1&s=1" />
                                                <div className="customer_activity_right">
                                                    <div className="heading">
                                                        <h2>Margareth Zend</h2>
                                                        <h3>4 Meal Box - Trial</h3>
                                                    </div>
                                                    <div className="body">
                                                        <Icon
                                                            source={ThumbsUpMajor}
                                                            color="base"
                                                        />
                                                        <h6>Selected Meals for Week 42, 2022</h6>
                                                        <h6>12 hours ago</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Section>
                                    </Card>
                                </div>
                            </div>
                        </Layout.Section>
                    </Layout>
                </Page>
            </Frame>
        </AppLayout>
    )
}

export default Notifications;