import { Button, ButtonGroup, Card, ProgressBar, Page, Layout, Icon } from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
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
import dayjs from "dayjs";
import { isEmpty } from 'lodash';
import PixelIcon from "../../images/PixelIcon";

const NewDashboard = () => {
    const [filters, setFilters] = useState({
        startDate: new Date(
            Date.parse(
                dayjs(
                    dayjs(
                        dayjs(dayjs(new Date()).subtract(2, 'days')).subtract(30, 'days')
                    )
                ).format()
            )
        ),
        endDate: new Date(
            Date.parse(dayjs(new Date()).subtract(1, 'days').format())
        ),
    });

    const [fetchDashboardReport, setFetchDashboardReport] = useState({})
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
    }, [filters, dateFilters]);

    const handleFiltersDates = (dates, span) => {
        console.log('hahah');
        if (!isEmpty(dates)) {
            const { start, end } = dates;
            setFilters({
                startDate: dayjs(start).format('YYYY-MM-DD'),
                endDate: dayjs(end).format('YYYY-MM-DD'),
                span: span,
            });
        }
    };

    useEffect(() => {
        if (!isEmpty(data?.fetchDashboardReport)) {
            setFetchDashboardReport(data?.fetchDashboardReport);
        }
    }, [data]);
    const [dateFilters, setDateFilters] = useState({ startDate: '', endDate: '' });

    const calculateValue = (arr) => {
        let value = 0;
        arr?.map((val) => {
            value += +val?.data?.value
        })
        return value
    }
    return (
        <>
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
                                                    <PixelIcon />
                                                    Revenue Overview</div>}
                                                actions={{
                                                    content:
                                                        <ButtonGroup>
                                                            <Button
                                                                onClick={() => {
                                                                    setDateFilters({
                                                                        ...dateFilters,
                                                                        startDate: dayjs(dayjs(dayjs(dayjs(new Date()).subtract(1, "days")).subtract(30, 'days'))).format(),
                                                                        endDate: dayjs(new Date()).subtract(1, "days").format()
                                                                    })
                                                                }}
                                                            >Subscriptions</Button>
                                                            <Button
                                                                onClick={() => {
                                                                    setDateFilters({
                                                                        ...dateFilters,
                                                                        startDate: new Date(Date.parse(dayjs(dayjs(dayjs(dayjs(new Date()).subtract(1, "days")).subtract(12, 'month'))).format())),
                                                                        endDate: dayjs(new Date()).subtract(1, "days").format()
                                                                    })
                                                                }}
                                                            >Rebuy</Button>
                                                            <Button
                                                                onClick={() => {
                                                                    setDateFilters({
                                                                        ...dateFilters,
                                                                        startDate: dayjs(dayjs(dayjs(dayjs(new Date()).subtract(1, "days")).subtract(3, 'month'))).format(),
                                                                        endDate: dayjs(new Date()).subtract(1, "days").format()
                                                                    })
                                                                }}
                                                            >PreOrders</Button>
                                                        </ButtonGroup>
                                                }}
                                            >
                                                <Card.Section>
                                                    <div className="dashboard_right">
                                                        <ContentSummaryGraph fetchDashboardReport={fetchDashboardReport} />

                                                        <div className="right_section">
                                                            <div className="right_section_sub">
                                                                <div className="mrr_div">
                                                                    <div className="mrr_first">${fetchDashboardReport?.mrr?.value}</div>
                                                                    <div className="mrr_second">MRR</div>
                                                                </div>
                                                                <div className="mrr_div">
                                                                    <div className="mrr_first">{fetchDashboardReport?.activeSubscriptionsCount?.value}</div>
                                                                    <div className="mrr_second">
                                                                        <span className="subs_icon" >
                                                                            Active Subscriptions
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="mrr_div">
                                                                    <div className="mrr_first">{fetchDashboardReport?.activeSubscriptionsCount?.percent}%</div>
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
                                    </div>
                                    <div className="bottom_section">
                                        <div className="left_section">
                                            <div className="main_head">Revenue Highlights</div>
                                            <div className="body">
                                                <RevenueHighlight title={"Customer lifetime value"} value={data?.fetchDashboardReport?.customerLifetimeValue?.value} percent={data?.fetchDashboardReport?.customerLifetimeValue?.percent} />
                                                <RevenueHighlight title={"Sales"} value={calculateValue(data?.fetchDashboardReport?.salesData)} percent={null} />
                                                <RevenueHighlight title={"Refunds"} value={calculateValue(data?.fetchDashboardReport?.refundData)} percent={null} />
                                                <RevenueHighlight title={"Renewal Rate"} value={calculateValue(data?.fetchDashboardReport?.renewalData)} percent={null} />
                                                <RevenueHighlight title={"ARR"} value={calculateValue(data?.fetchDashboardReport?.arrData)} percent={null} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                </Layout>
            </Page>
        </>
    )
}

export default NewDashboard;