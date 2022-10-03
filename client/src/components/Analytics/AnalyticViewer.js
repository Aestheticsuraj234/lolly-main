import React from "react";
import CreatorRewards from "./CreatorRewards";
import "./styles.css"
import ViewerPageGraph from "./ViewerPageGraph";

const AnalyticViewer = () => {
    return (<>
    <div className="analytic-viewer">

    <div className="content">
    <h1>Viewer Analytics</h1>
    <div className="bottom-line"></div>
    </div>

    <ViewerPageGraph />
    
    <CreatorRewards />
    </div>
    </>)
}

export default AnalyticViewer;