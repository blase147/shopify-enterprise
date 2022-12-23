import React, { useState } from "react";
import AreaChart from "./AreaChart";
import AudienceVisitorGraph from "./AudienceVisitorGraph";
const ContentSummaryGraph = ({ fetchDashboardReport }) => {
    return (
        <>
            {/* <div className="content_summary_main" style={{ width: '100%' }}> */}
            <figure class="highcharts-figure">
                <AreaChart fetchDashboardReport={fetchDashboardReport} />
            </figure>
            {/* </div> */}
        </>
    );
}

export default ContentSummaryGraph;
