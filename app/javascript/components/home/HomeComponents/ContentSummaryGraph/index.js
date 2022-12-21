import React, { useState } from "react";
import AreaChart from "./AreaChart";
import AudienceVisitorGraph from "./AudienceVisitorGraph";
const ContentSummaryGraph = () => {
    return (
        <>
            <div className="content_summary_main" style={{ width: '100%' }}>
                <AreaChart />
            </div>
        </>
    );
}

export default ContentSummaryGraph;
