import { Button, ButtonGroup, Card, ProgressBar, Page, Layout, Icon } from "@shopify/polaris";
import React from "react";
import ContentSummaryGraph from "./HomeComponents/ContentSummaryGraph";
import PieChart from "./HomeComponents/ContentSummaryGraph/PieChart";
import MultiColorProgressBar from "./HomeComponents/MultiColorProgressBar";
import {
    ThumbsUpMajor, StoreStatusMajor, SmileyJoyMajor
} from '@shopify/polaris-icons';
import AppLayout from '../layout/Layout';
import "./style.css";
import dashboardSubIcon from "./../../images/dashboardSubIcon.png";
import RevenueHighlight from "./RevenueHighlight";
import { gql, useLazyQuery } from "@apollo/client";

const NewDashboard = () => {
    const getGraphDataQuery = gql`
        query ($startDate: String!, $endDate: String!) {
            fetchDashboardReport(startDate: $startDate, endDate: $endDate) {
                mrr {
                value
                percent
                up
                }
                activeSubscriptionsCount {
                value
                percent
                up
                }
                churnRate {
                value
                percent
                up
                }
                customerLifetimeValue {
                value
                percent
                up
                }
                activeCustomers {
                data {
                    value
                }
                date
                }
                revenueChurn {
                date
                data {
                    value
                }
                }
                arrData {
                date
                data {
                    value
                }
                }
                mrrData {
                date
                data {
                    value
                }
                }
                refundData {
                date
                data {
                    value
                }
                }
                salesData {
                date
                data {
                    value
                }
                }
                renewalData {
                date
                data {
                    value
                }
                }
            }
        }
    `;

    const [getReport, { loading, error, data }] = useLazyQuery(
        getGraphDataQuery,
        { fetchPolicy: 'network-only' }
    );

    const getReportData = useCallback(() => {
        getReport({
            variables: {
                startDate: filters.startDate,
                endDate: filters.endDate,
            },
        });
    }, [filters, getReport]);

    useEffect(() => {
        getReportData();
    }, [filters]);
    return (
        <AppLayout typePage="Dashboard" tabIndex="0">
            <Page>
                <Layout>
                    <Layout.Section></Layout.Section>
                    <div className="dashboard_main_div">
                        <div className="dashboard_left">
                            <div className="dashboard_header">
                                <div className="main_head">Dashboard</div>
                                <div className="sub_head">Welcome back, {localStorage.getItem("currentuser")}</div>
                            </div>
                            <div className="dashboard_content">
                                <div className="schedule_content_main">
                                    <div className="top_section">
                                        <div className="revenue_overview_div">
                                            <Card
                                                title={<div className="heading_title">
                                                    <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.30664 16.382C5.64501 16.8989 6.04378 17.3774 6.49667 17.8067C7.61886 18.8703 9.02523 19.586 10.5456 19.8671C12.066 20.1481 13.6353 19.9826 15.0636 19.3905C16.4919 18.7984 17.718 17.8051 18.5936 16.5307C19.4692 15.2564 19.9567 13.7556 19.9972 12.21C20.0378 10.6644 19.6295 9.14011 18.8219 7.82164C18.0143 6.50317 16.8419 5.44698 15.4466 4.78086C14.5023 4.33005 13.4832 4.07098 12.4479 4.01291L13.0031 6.08481C13.5482 6.17724 14.0808 6.34506 14.5849 6.58574C15.6314 7.08533 16.5107 7.87747 17.1164 8.86632C17.7221 9.85517 18.0283 10.9984 17.9979 12.1576C17.9675 13.3168 17.6019 14.4424 16.9452 15.3981C16.2885 16.3539 15.3689 17.0989 14.2977 17.543C13.2265 17.9871 12.0495 18.1112 10.9092 17.9004C9.76892 17.6896 8.71415 17.1528 7.8725 16.3551C7.69677 16.1885 7.53189 16.0121 7.37854 15.8269L5.30664 16.382Z" fill="white" />
                                                        <path d="M5.91239 4.06647C6.68924 3.47037 7.54796 2.99272 8.46042 2.64739C8.87978 2.48868 9.08946 2.40932 9.28694 2.51053C9.48442 2.61174 9.54649 2.84338 9.67063 3.30667L11.7412 11.0341C11.8632 11.4894 11.9242 11.7171 11.8206 11.8964C11.7171 12.0758 11.4894 12.1368 11.0341 12.2588L3.30667 14.3294C2.84338 14.4535 2.61174 14.5156 2.42535 14.3952C2.23896 14.2747 2.20284 14.0535 2.13061 13.6109C1.97344 12.6481 1.95774 11.6656 2.08555 10.6947C2.25696 9.39275 2.68314 8.13728 3.33975 7C3.99636 5.86272 4.87054 4.8659 5.91239 4.06647Z" stroke="white" stroke-width="2" />
                                                    </svg>
                                                    </span>Revenue Overview</div>}
                                                actions={{
                                                    content:
                                                        <ButtonGroup>
                                                            <Button>Daily</Button>
                                                            <Button>Weekly</Button>
                                                            <Button>Monthly</Button>
                                                        </ButtonGroup>
                                                }}
                                            >
                                                <Card.Section>
                                                    <div className="dashboard_right">
                                                        <ContentSummaryGraph />

                                                        <div className="right_section">
                                                            <div className="right_section_sub">
                                                                <div className="mrr_div">
                                                                    <div className="mrr_first">$33,000</div>
                                                                    <div className="mrr_second">MRR</div>
                                                                </div>
                                                                <div className="mrr_div">
                                                                    <div className="mrr_first">115k</div>
                                                                    <div className="mrr_second">
                                                                        <span className="subs_icon" >
                                                                            Active Subscriptions
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="mrr_div">
                                                                    <div className="mrr_first">5.5%</div>
                                                                    <div className="mrr_second">
                                                                        <span className="subs_icon pink" >
                                                                            Churn Rate
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="report">
                                                                <div className="report_icon">
                                                                    <Icon
                                                                        source={SmileyJoyMajor}
                                                                        color="base"
                                                                    />
                                                                </div>
                                                                <div className="report_text">
                                                                    <h2>You’re doing good!</h2>
                                                                    <h6>Your reach performance is 12% better compate to last year</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card.Section>
                                            </Card>
                                        </div>
                                        <div className="customer_activity_main_div">
                                            <Card title={<div className="heading_title"><span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.30664 16.382C5.64501 16.8989 6.04378 17.3774 6.49667 17.8067C7.61886 18.8703 9.02523 19.586 10.5456 19.8671C12.066 20.1481 13.6353 19.9826 15.0636 19.3905C16.4919 18.7984 17.718 17.8051 18.5936 16.5307C19.4692 15.2564 19.9567 13.7556 19.9972 12.21C20.0378 10.6644 19.6295 9.14011 18.8219 7.82164C18.0143 6.50317 16.8419 5.44698 15.4466 4.78086C14.5023 4.33005 13.4832 4.07098 12.4479 4.01291L13.0031 6.08481C13.5482 6.17724 14.0808 6.34506 14.5849 6.58574C15.6314 7.08533 16.5107 7.87747 17.1164 8.86632C17.7221 9.85517 18.0283 10.9984 17.9979 12.1576C17.9675 13.3168 17.6019 14.4424 16.9452 15.3981C16.2885 16.3539 15.3689 17.0989 14.2977 17.543C13.2265 17.9871 12.0495 18.1112 10.9092 17.9004C9.76892 17.6896 8.71415 17.1528 7.8725 16.3551C7.69677 16.1885 7.53189 16.0121 7.37854 15.8269L5.30664 16.382Z" fill="white" />
                                                    <path d="M5.91239 4.06647C6.68924 3.47037 7.54796 2.99272 8.46042 2.64739C8.87978 2.48868 9.08946 2.40932 9.28694 2.51053C9.48442 2.61174 9.54649 2.84338 9.67063 3.30667L11.7412 11.0341C11.8632 11.4894 11.9242 11.7171 11.8206 11.8964C11.7171 12.0758 11.4894 12.1368 11.0341 12.2588L3.30667 14.3294C2.84338 14.4535 2.61174 14.5156 2.42535 14.3952C2.23896 14.2747 2.20284 14.0535 2.13061 13.6109C1.97344 12.6481 1.95774 11.6656 2.08555 10.6947C2.25696 9.39275 2.68314 8.13728 3.33975 7C3.99636 5.86272 4.87054 4.8659 5.91239 4.06647Z" stroke="white" stroke-width="2" />
                                                </svg>
                                            </span>Customers Activity Log</div>} >
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
                                    <div className="bottom_section">
                                        <div className="left_section">
                                            <div className="main_head">Revenue Highlights</div>
                                            <div className="body">
                                                {
                                                    [1, 2, 3, 4].map(() => {
                                                        return <RevenueHighlight />
                                                    }
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                </Layout>
            </Page>
        </AppLayout>
    )
}

export default NewDashboard;