import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaPlane, FaBus, FaTrain, FaCar, FaMapMarkerAlt } from 'react-icons/fa';
import { renderToStaticMarkup } from 'react-dom/server';

const getVehicleIcon = (type) => {
    let iconComponent;
    let color;
    switch(type) {
        case 'flight': iconComponent = <FaPlane/>; color = '#e74c3c'; break;
        case 'bus': iconComponent = <FaBus/>; color = '#f1c40f'; break;
        case 'train': iconComponent = <FaTrain/>; color = '#9b59b6'; break;
        case 'car': iconComponent = <FaCar/>; color = '#3498db'; break;
        default: iconComponent = <FaMapMarkerAlt/>; color = '#2ecc71';
    }
    const htmlString = renderToStaticMarkup(iconComponent);
    return L.divIcon({
        html: `<div style="background: ${color}; width: 32px; height: 32px; display: flex; justify-content: center; align-items: center; border-radius: 50%; color: white; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-size: 16px;">${htmlString}</div>`,
        className: 'live-tracking-icon-container',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });
};

const BoundUpdater = ({ startCoords, endCoords }) => {
    const map = useMap();
    useEffect(() => {
        if (startCoords && endCoords) {
            const bounds = L.latLngBounds([startCoords, endCoords]);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (startCoords) {
            map.setView(startCoords, 10);
        }
    }, [startCoords, endCoords, map]);
    return null;
};

const LiveTrackingMap = ({ type, startCoords, endCoords, height = '300px' }) => {
    // Generate an animated position between start and end to simulate "live" tracking
    const [currentPos, setCurrentPos] = useState(startCoords || [20, 77]);
    
    useEffect(() => {
        if (!startCoords || !endCoords) return;
        
        // Simulates movement from A to B back and forth
        let progress = 0;
        const interval = setInterval(() => {
            progress += 0.01; // 1% per tick
            if (progress > 1) progress = 0; // loop back
            
            const lat = startCoords[0] + (endCoords[0] - startCoords[0]) * progress;
            const lng = startCoords[1] + (endCoords[1] - startCoords[1]) * progress;
            setCurrentPos([lat, lng]);
        }, 200);
        
        return () => clearInterval(interval);
    }, [startCoords, endCoords]);

    const vehicleIcon = getVehicleIcon(type);

    return (
        <div className="live-tracking-map-wrapper" style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 1 }}>
            <MapContainer center={startCoords || [20, 77]} zoom={4} style={{ height: '100%', width: '100%', background: '#282c34' }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <BoundUpdater startCoords={startCoords} endCoords={endCoords} />
                
                {startCoords && (
                    <Marker position={startCoords} opacity={0.6}>
                        <Popup>Origin</Popup>
                    </Marker>
                )}
                
                {endCoords && (
                    <Marker position={endCoords} opacity={0.6}>
                        <Popup>Destination</Popup>
                    </Marker>
                )}
                
                {startCoords && endCoords && (
                    <>
                        <Polyline positions={[startCoords, endCoords]} color="#61dafb" weight={3} dashArray="5,10" />
                        <Marker position={currentPos} icon={vehicleIcon}>
                            <Popup>Live Tracking: {type.toUpperCase()}</Popup>
                        </Marker>
                    </>
                )}
                
                {startCoords && !endCoords && (
                    <Marker position={startCoords} icon={vehicleIcon}>
                        <Popup>Vehicle Location</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default LiveTrackingMap;
