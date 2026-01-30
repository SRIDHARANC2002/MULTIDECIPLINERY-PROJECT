import React, { useState, useEffect, useCallback } from 'react';
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
    const [routeCoords, setRouteCoords] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

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

    const geocodeAddress = async (address) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`, {
                headers: {
                    'User-Agent': 'CampusNav/1.0' // Required by Nominatim
                }
            });
            const data = await response.json();
            if (data && data.length > 0) {
                return {
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon),
                    displayName: data[0].display_name
                };
            }
            return null;
        } catch (error) {
            console.error("Geocoding error:", error);
            return null;
        }
    };

    const handleGetDirections = async () => {
        setIsSearching(true);
        let start = sourceCoords;
        let end = selectedLocation;

        // Geocode source if not set but text exists
        if (!start && source) {
            const result = await geocodeAddress(source);
            if (result) {
                start = { latitude: result.latitude, longitude: result.longitude };
                setSourceCoords(start);
                setSource(result.displayName); // Update UI with resolved name
            } else {
                alert(`Could not find location for: ${source}`);
                setIsSearching(false);
                return;
            }
        }

        // Geocode destination if not set but text exists
        if (!end || !end.latitude) { // Check if end is valid
            if (destination) {
                const result = await geocodeAddress(destination);
                if (result) {
                    end = { latitude: result.latitude, longitude: result.longitude, name: result.displayName };
                    setSelectedLocation(end);
                    setDestination(result.displayName); // Update UI with resolved name
                } else {
                    alert(`Could not find location for: ${destination}`);
                    setIsSearching(false);
                    return;
                }
            }
        }

        if (start && end && end.latitude) {
            setRouteCoords({
                start: [start.latitude, start.longitude],
                end: [end.latitude, end.longitude]
            });
            // Trigger distance calc update if it wasn't automatic (e.g. from text entry)
            if (!selectedLocation || !sourceCoords) {
                // The useEffect will handle this once state updates props
            }

        } else {
            alert("Please enter or select both a valid source and destination.");
        }
        setIsSearching(false);
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
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Enter destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                        <button
                            className="gps-button"
                            onClick={handleGetDirections}
                            title="Get Directions"
                            disabled={isSearching}
                            style={{ right: '5px', fontSize: '1.2rem', opacity: isSearching ? 0.5 : 1 }}
                        >
                            {isSearching ? '...' : '➔'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Split */}
            <div className="main-split">
                <div className="map-area">
                    <MapContainer route={routeCoords} />
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
