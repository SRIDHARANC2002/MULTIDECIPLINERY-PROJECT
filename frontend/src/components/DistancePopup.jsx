import React from 'react';

const DistancePopup = ({ distance }) => {
    return (
        <div className="distance-popup">
            <p>Distance: {distance} meters</p>
        </div>
    );
};

export default DistancePopup;
