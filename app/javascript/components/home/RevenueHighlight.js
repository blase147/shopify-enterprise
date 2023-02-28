import React from "react";
import { Button, ButtonGroup, Card, ProgressBar, Page, Layout, Icon } from "@shopify/polaris";

const RevenueHighlight = ({ title, percent, value }) => {
    return (
        <Card title={<div className="revenue_heading">
            <div className="left_heading">{title}</div>
            <div className="right_heading">
                {percent ? `${percent}%` : ""}
            </div>
        </div>}>
            <Card.Section>
                <div className="total_sales">
                    ${value}
                </div>
            </Card.Section>
        </Card>
    )
}
export default RevenueHighlight;