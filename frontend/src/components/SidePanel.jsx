import React from 'react';
import './SidePanel.css';

const API_BASE_URL = 'http://localhost:5000';

const SidePanel = ({ locations, selectedLocation, onSelectLocation }) => {
    return (
        <div className="strict-panel">
            <div className="panel-header">
                <h3>Destination Details</h3>
            </div>
            <div className="panel-content">
                {selectedLocation ? (
                    <>
                        <div className="location-image-container">
                            {/* 
                 Assuming the image path from backend is relative (e.g., /images/cse.jpg).
                 We prepend the backend URL if it's not a full URL. 
               */}
                            <img
                                src={selectedLocation.image ? `${API_BASE_URL}${selectedLocation.image}` : 'https://via.placeholder.com/300x200?text=No+Image'}
                                alt={selectedLocation.name}
                                className="location-image"
                            />
                        </div>
                        <div className="detail-item">
                            <strong>Name:</strong>
                            <span>{selectedLocation.name}</span>
                        </div>
                        <div className="detail-item">
                            <strong>Description:</strong>
                            <p>{selectedLocation.description}</p>
                        </div>
                    </>
                ) : (
                    <div className="no-selection">
                        <p>Select a location from the list below to view details.</p>
                    </div>
                )}
            </div>

            <div className="available-locations">
                <h4>Available Locations</h4>
                <ul>
                    {locations && locations.map(loc => (
                        <li
                            key={loc.id}
                            onClick={() => onSelectLocation(loc)}
                            className={selectedLocation && selectedLocation.id === loc.id ? 'active' : ''}
                        >
                            {loc.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SidePanel;
