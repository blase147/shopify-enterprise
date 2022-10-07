import React from 'react';
import "./style.css";

const LoadingScreen = () => {
    return (
        <div className="preloader">
            <div className="preloader_sub_div">
                <div className="loader_main">
                    <span className="loader"></span>
                </div>
                <div className="loadingText">Loading</div>
            </div>
        </div>
    )
}

export default LoadingScreen;