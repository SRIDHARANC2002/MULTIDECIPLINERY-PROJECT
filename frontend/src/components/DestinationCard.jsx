import React from 'react';

const DestinationCard = ({ location }) => {
    return (
        <div className="destination-card">
            <img src={location.image || 'https://via.placeholder.com/150'} alt={location.name} />
            <h3>{location.name}</h3>
            <p>{location.description}</p>
        </div>
    );
};

export default DestinationCard;
