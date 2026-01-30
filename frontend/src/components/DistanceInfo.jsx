import React from 'react';
import './DistanceInfo.css';

const DistanceInfo = ({ distance, eta }) => {
    return (
        <div className="distance-info-bar">
            <div className="info-item">
                <span className="label">Distance:</span>
                <span className="value">{distance || '--'}</span>
            </div>
            <div className="info-item">
                <span className="label">ETA:</span>
                <span className="value">{eta || '--'}</span>
            </div>
            <div className="notification-icon">
                <span>🔔</span>
            </div>
        </div>
    );
};

export default DistanceInfo;
