import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapContainer.css';

// Fix for default marker icon in Leaflet with webpack/vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Build the default icon
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
});

// Set the default icon for all markers
L.Marker.prototype.options.icon = DefaultIcon;

const defaultCenter = [12.9716, 77.5946]; // Bangalore coordinates

// Component to handle map recentering
const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
};

// Component to fit bounds of a route
const FitBounds = ({ route }) => {
    const map = useMap();
    useEffect(() => {
        if (route && route.start && route.end) {
            const bounds = L.latLngBounds([route.start, route.end]);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [route, map]);
    return null;
};

const MapContainer = ({ route }) => {
    const [position, setPosition] = useState(defaultCenter);
    const [hasLocation, setHasLocation] = useState(false);
    const [routePath, setRoutePath] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition([pos.coords.latitude, pos.coords.longitude]);
                    setHasLocation(true);
                },
                (err) => {
                    console.error("Error fetching location", err);
                }
            );
        }
    }, []);

    // Fetch OSRM Route
    useEffect(() => {
        if (route && route.start && route.end) {
            const startLat = route.start[0];
            const startLng = route.start[1];
            const endLat = route.end[0];
            const endLng = route.end[1];

            const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (data.routes && data.routes.length > 0) {
                        const coordinates = data.routes[0].geometry.coordinates;
                        // OSRM returns [lon, lat], Leaflet needs [lat, lon]
                        const latLngs = coordinates.map(coord => [coord[1], coord[0]]);
                        setRoutePath(latLngs);
                    }
                })
                .catch(err => console.error("OSRM Fetch Error:", err));
        } else {
            setRoutePath(null);
        }
    }, [route]);

    return (
        <div className="map-wrapper">
            <LeafletMap
                center={defaultCenter}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* If we have a route path, fit bounds to show it. Otherwise follow route points or user */}
                {routePath ? (
                    <FitBounds route={{ start: route.start, end: route.end }} /> // FitBounds can still use start/end for simplicity
                ) : (
                    <RecenterAutomatically lat={position[0]} lng={position[1]} />
                )}

                <Marker position={position}>
                    <Popup>
                        {hasLocation ? "You are here" : "Campus Location (Default)"}
                    </Popup>
                </Marker>

                {route && (
                    <>
                        <Marker position={route.start}>
                            <Popup>Start</Popup>
                        </Marker>
                        <Marker position={route.end}>
                            <Popup>End</Popup>
                        </Marker>

                        {/* Render the actual road path if available, else straight line */}
                        {routePath && (
                            <Polyline
                                positions={routePath}
                                pathOptions={{ color: 'blue', weight: 4, opacity: 0.7 }}
                            />
                        )}

                        {/* Fallback straight line while loading or if OSRM fails 
                        {!routePath && (
                             <Polyline
                                positions={[route.start, route.end]}
                                pathOptions={{ color: 'gray', weight: 2, opacity: 0.5, dashArray: '5, 10' }}
                            />
                        )}
                        */}
                    </>
                )}
            </LeafletMap>
        </div>
    );
};

export default React.memo(MapContainer);
