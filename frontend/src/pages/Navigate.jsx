import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapContainer from '../components/MapContainer';
import SidePanel from '../components/SidePanel';
import DistanceInfo from '../components/DistanceInfo';
import locationService from '../services/location.service';
import './Navigate.css';

const Navigate = () => {
    const [locations, setLocations] = useState([]);
    const [source, setSource] = useState('');
    const [sourceCoords, setSourceCoords] = useState(null);
    const [destination, setDestination] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [distanceInfo, setDistanceInfo] = useState({ distance: '--', eta: '--' });

    useEffect(() => {
        locationService.getLocations().then(data => setLocations(data));
    }, []);

    // Calculate distance when source or destination changes
    useEffect(() => {
        if (sourceCoords && selectedLocation && selectedLocation.latitude && selectedLocation.longitude) {
            const dist = calculateDistance(
                sourceCoords.latitude,
                sourceCoords.longitude,
                selectedLocation.latitude,
                selectedLocation.longitude
            );
            setDistanceInfo({
                distance: `${dist.toFixed(2)} km`,
                eta: `${Math.ceil(dist * 12)} mins` // Rough estimate: 5 km/hr walking speed -> 12 mins per km
            });
        } else {
            setDistanceInfo({ distance: '--', eta: '--' });
        }
    }, [sourceCoords, selectedLocation]);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            setSource('Fetching location...');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setSourceCoords({ latitude, longitude });
                    setSource(`Current Location`);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setSource('');
                    alert('Unable to retrieve your location');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setDestination(location.name);
    };

    return (
        <div className="navigate-page-strict">
            {/* Back Button */}
            <Link to="/" className="back-button" title="Back to Home">
                ↩ Back
            </Link>

            {/* Input Row */}
            <div className="input-row">
                <div className="input-group">
                    <label>Source:</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Enter starting point"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                        />
                        <button
                            className="gps-button"
                            onClick={handleGetCurrentLocation}
                            title="Use Current Location"
                        >
                            📍
                        </button>
                    </div>
                </div>
                <div className="input-group">
                    <label>Destination:</label>
                    <input
                        type="text"
                        placeholder="Enter destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                </div>
            </div>

            {/* Main Content Split */}
            <div className="main-split">
                <div className="map-area">
                    <MapContainer />
                </div>
                <div className="output-panel">
                    <SidePanel
                        locations={locations}
                        selectedLocation={selectedLocation}
                        onSelectLocation={handleLocationSelect}
                    />
                </div>
            </div>

            {/* Distance Notification Bar */}
            <DistanceInfo distance={distanceInfo.distance} eta={distanceInfo.eta} />
        </div>
    );
};

export default Navigate;
