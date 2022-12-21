import React from "react";
import { Button, ButtonGroup, Card, ProgressBar, Page, Layout, Icon } from "@shopify/polaris";

const RevenueHighlight = () => {
    return (
        <Card title={<div className="revenue_heading">
            <div className="left_heading">Total Sales</div>
            <div className="right_heading">
                24%
            </div>
        </div>}>
            <Card.Section>
                <div className="total_sales">
                    $47,443
                </div>
            </Card.Section>
        </Card>
    )
}
export default RevenueHighlight;