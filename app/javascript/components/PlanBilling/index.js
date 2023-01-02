import React from "react";
import { Badge, Button, Card, Frame, Icon, Layout, Page, TextStyle } from "@shopify/polaris";
import { MobileBackArrowMajor, HashtagMajor } from "@shopify/polaris-icons"
import AppLayout from '../layout/Layout';
import "./style.css";

const PlanBilling = () => {
    return (
        <Frame>
            <div className="plan_billing_main">
                <div className="back-button pointer" >
                    <Icon source={MobileBackArrowMajor} color="base" />
                    <p>
                        <TextStyle variation="subdued">Settings</TextStyle>
                    </p>
                </div>
                <Layout>
                    <Page title="Billing">
                        <Layout.Section>
                            <Card sectioned>
                                <Card.Section>
                                    <div className="card_body">
                                        <div className="left-section">
                                            Free
                                            <Badge status="success">Current Plan</Badge>
                                        </div>
                                        <div className="right-section">
                                            <span className="plan_price">$0USD</span>
                                            <span className="plan_validity">/month</span>
                                        </div>
                                    </div>
                                </Card.Section>
                            </Card>

                        </Layout.Section>
                        <div className="all_plans">
                            <Layout.Section oneThird>
                                <Card title="Starter">
                                    <Card.Section>
                                        <div className="plans-body">
                                            <div className="plan-title">
                                                <span className="plan_price">$0USD</span>
                                                <span className="plan_validity">/month</span>
                                            </div>
                                            <div className="body-text">
                                                Includes 0.97% of each subscription transaction & covers up to USD 500K/yr recurring revenue (ARR).
                                            </div>
                                            <div className="plans-body_buttons">
                                                <Button>Upgrade</Button>
                                            </div>
                                        </div>
                                    </Card.Section>
                                    <Card.Section subdued>
                                        <div className="plan-details">
                                            <div className="list_items">
                                                <div><Icon source={HashtagMajor} color="base" /></div><div>
                                                    Fixed subscriptions
                                                </div>
                                            </div>
                                            <div className="list_items">
                                                <div><Icon source={HashtagMajor} color="base" /></div><div>
                                                    Build-a-box subscriptions
                                                </div>
                                            </div>
                                            <div className="list_items">
                                                <div><Icon source={HashtagMajor} color="base" /></div><div>
                                                    Deep-dive Analytics
                                                </div>
                                            </div>
                                            <div className="list_items">
                                                <div><Icon source={HashtagMajor} color="base" /></div><div>
                                                    Customizable Customer Portal
                                                </div>
                                            </div>
                                            <div className="list_items">
                                                <div><Icon source={HashtagMajor} color="base" /></div><div>
                                                    Upsells & Post-purchase Extensions
                                                </div>
                                            </div>
                                            <div className="list_items">
                                                <div><Icon source={HashtagMajor} color="base" /></div><div>
                                                    SMS self-service & marketing
                                                </div>
                                            </div>
                                            <div className="list_items">
                                                <div><Icon source={HashtagMajor} color="base" /></div><div>
                                                    SMS self-service & marketing
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Section>
                                </Card>
                            </Layout.Section>
                            <Layout.Section oneThird>
                                <Card title="Pro">
                                    <Card.Section>
                                        <div className="plans-body">
                                            <div className="plan-title">
                                                <span className="plan_price">$199 USD</span>
                                                <span className="plan_validity">/month</span>
                                            </div>
                                            <div className="body-text">
                                                includes 0.79% of each subscription transaction & covers up to USD 20M/yr recurring revenue (ARR).
                                            </div>
                                            <div className="plans-body_buttons">
                                                <Button>Upgrade</Button>
                                            </div>
                                        </div>
                                    </Card.Section>
                                    <Card.Section subdued>
                                        <div className="plan-details">
                                            <div className="list_items">
                                                <div><Icon source={HashtagMajor} color="base" /></div><div>
                                                    All the features in starter
                                                </div>
                                            </div>
                                            <div className="list_items">
                                                <div><Icon source={HashtagMajor} color="base" /></div><div>
                                                    Fixed/custom billing & shipping dates
                                                </div>
                                            </div>
                                            <div className="list_items">
                                                <div><Icon source={HashtagMajor} color="base" /></div><div>
                                                    Hide chargezen branding
                                                </div>
                                            </div>
                                            <div className="list_items">
                                                <div><Icon source={HashtagMajor} color="base" /></div><div>
                                                    24/7 phone & zoom support
                                                </div>
                                            </div>
                                            <div className="list_items">
                                                <div><Icon source={HashtagMajor} color="base" /></div><div>
                                                    Dedicated account manager
                                                </div>
                                            </div>
                                            <div className="list_items">
                                                <div><Icon source={HashtagMajor} color="base" /></div><div>
                                                    Full access to Tiazen marketing suite
                                                </div>
                                            </div>
                                            <div className="list_items">
                                                <div><Icon source={HashtagMajor} color="base" /></div><div>
                                                    Chargezen shipping suite
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Section>
                                </Card>
                            </Layout.Section>
                            <Layout.Section oneThird>
                                <Card title="Enterprise">
                                    <Card.Section>
                                        <div className="plans-body">
                                            <div className="plan-title">
                                                <span className="plan_price">Custom Build</span>
                                            </div>
                                            <div className="body-text">
                                                Talk to our experts and get tailored pricing for your business.
                                            </div>
                                            <div className="plans-body_buttons">
                                                <Button>Talk to Sales</Button>
                                            </div>
                                        </div>
                                    </Card.Section>
                                    <Card.Section subdued>
                                        <div className="plan-details">
                                            <div className="list_items">
                                                <div><Icon source={HashtagMajor} color="base" /></div><div>
                                                    Manage complex billing operations for teams with advanced or unique requirements. Get blank check to request any custom feature. White-glove support right from staging to production, and beyond.
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Section>
                                </Card>
                            </Layout.Section>
                        </div>
                        <div>
                            <Layout.Section>
                                <Card sectioned>
                                    <Card.Section>
                                        <div className="card_body">
                                            <div className="left-section">
                                                Large Business
                                            </div>
                                            <div className="right-section">
                                                <Button>Let's Talk</Button>
                                            </div>
                                        </div>
                                    </Card.Section>
                                </Card>
                            </Layout.Section>
                        </div>
                    </Page>
                </Layout>
            </div >
        </Frame >
    );
}

export default PlanBilling;