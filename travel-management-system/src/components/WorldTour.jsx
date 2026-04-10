import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';
import './SharedPremium.css';

// Fix for default Leaflet icon paths in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Map Panner
const MapFlyTo = ({ position, zoom }) => {
    const map = useMap();
    React.useEffect(() => {
        if (position) {
            map.flyTo([position[0], position[1]], zoom, {
                animate: true,
                duration: 1.5
            });
        }
    }, [position, zoom, map]);
    return null;
};

// Component to listen for clicks on the interactive map
const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click: (e) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
        }
    });
    return null;
};

const WorldTour = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState(null);

    const handleMapClick = async (lat, lng) => {
        setLoading(true);
        setSelectedLocation(null);
        try {
            // Reverse Geocoding via OpenStreetMap (Nominatim)
            const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            if (res.data && res.data.address) {
                const address = res.data.address;
                const placeName = address.city || address.town || address.village || address.state || address.country || res.data.name;
                const country = address.country;

                if (placeName) {
                    await fetchPlaceDetails(placeName, country, lat, lng);
                } else {
                    alert("Unable to identify the exact location. Please click closer to a city.");
                }
            } else {
                alert("You clicked an unknown area (like the ocean). Please click on a landmass or city!");
            }
        } catch (err) {
            console.error("Geocoding error", err);
            alert("Failed to find location data.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery) return;
        
        setLoading(true);
        setSelectedLocation(null);
        try {
            // Forward Geocoding via Nominatim
            const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
            if (res.data && res.data.length > 0) {
                const { lat, lon, display_name } = res.data[0];
                const parts = display_name.split(',');
                const placeName = parts[0].trim();
                const country = parts.length > 1 ? parts[parts.length - 1].trim() : '';
                await fetchPlaceDetails(placeName, country, parseFloat(lat), parseFloat(lon));
            } else {
                alert("Location not found. Please try a different search.");
            }
        } catch (err) {
            console.error("Search error", err);
            alert("Failed to search location.");
        } finally {
            setLoading(false);
        }
    };

    const fetchPlaceDetails = async (placeName, country, lat, lng) => {
        try {
            const fullName = country && placeName !== country ? `${placeName}, ${country}` : placeName;
            
            // 1. Fetch description from Wikipedia API
            let description = `Showing beautiful places and photography from ${placeName}.`;
            try {
                const wikiRes = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(placeName)}&format=json&origin=*`);
                const pages = wikiRes.data.query.pages;
                const pageId = Object.keys(pages)[0];
                if (pageId !== '-1' && pages[pageId].extract) {
                    // Truncate to first paragraph or around ~350 characters
                    description = pages[pageId].extract.split('\n')[0].substring(0, 350);
                    if (description.length === 350) description += '...';
                }
            } catch (err) { 
                console.error("Wiki fetch error", err); 
            }

            // 2. Fetch specific Monuments, Temples, and Landmarks using Wikipedia GeoSearch
            // This specifically finds notable Wikipedia articles (famous places) within a 15km radius!
            let photos = [];
            try {
                const landmarkRes = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&generator=geosearch&ggscoord=${lat}|${lng}&ggsradius=15000&ggslimit=15&prop=pageimages&pithumbsize=800&format=json&origin=*`);
                const pages = landmarkRes.data.query?.pages;
                
                if (pages) {
                    photos = Object.values(pages)
                        .filter(p => p.thumbnail && p.thumbnail.source) // Only keep Wikipedia landmarks that have a high-quality picture
                        .map(p => ({
                            url: p.thumbnail.source,
                            // p.title is the actual name of the monument or temple (e.g., "Taj Mahal", "Colosseum")
                            title: p.title
                        }))
                        .slice(0, 8); // Display the top 8 landmarks for that specific region
                }
            } catch (err) {
                console.error("Landmark fetch error", err);
            }

            // Fallback: If Wikipedia had no famous landmarks nearby, gracefully fallback to raw geographical JPEGs
            if (photos.length === 0) {
                try {
                    const fallbackImgRes = await axios.get(`https://commons.wikimedia.org/w/api.php?action=query&generator=geosearch&ggscoord=${lat}|${lng}&ggsradius=10000&ggsnamespace=6&ggslimit=10&prop=imageinfo&iiprop=url&format=json&origin=*`);
                    const fbPages = fallbackImgRes.data.query?.pages;
                    if (fbPages) {
                        photos = Object.values(fbPages)
                            .map(p => {
                                if (p.imageinfo && p.imageinfo[0] && p.imageinfo[0].url.match(/\.(jpeg|jpg|png|webp)$/i) && !p.imageinfo[0].url.toLowerCase().includes('map')) {
                                    return {
                                        url: p.imageinfo[0].url,
                                        title: p.title.replace('File:', '').replace(/\.[^/.]+$/, '').replace(/_/g, ' ').substring(0, 45)
                                    };
                                }
                                return null;
                            })
                            .filter(Boolean).slice(0, 4);
                    }
                } catch(e) {}
            }

            // 3. Last resort fallback if absolutely empty
            if (photos.length === 0) {
                photos = [
                    { url: `https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?q=80&w=600&auto=format&fit=crop`, title: `${placeName} (No Specific Monuments Found)` }
                ];
            }

            // Set final location data to pop open the sidebar
            setSelectedLocation({
                name: fullName,
                position: [lat, lng],
                description,
                photos
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{minHeight: '100vh', position: 'relative', overflowY: 'auto', backgroundColor: '#07090f'}}>
            <div className="premium-container" style={{backgroundColor: 'rgba(18, 21, 33, 0.65)', backdropFilter: 'blur(20px)', borderRadius: '24px', maxWidth: '1400px', display: 'flex', flexDirection: 'column'}}>
                
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px'}}>
                    <Link to="/home" className="back-link" style={{position: 'static'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Home
                    </Link>
                    
                    <h2 className="premium-title" style={{margin: 0}}><span className="gradient-text">Global Explorer</span> Engine</h2>
                    
                    {/* Dynamic Search Bar */}
                    <form onSubmit={handleSearch} style={{display: 'flex', gap: '10px', flex: '1 1 300px', justifyContent: 'flex-end'}}>
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter any city (e.g. Rome, Tokyo)..."
                            className="premium-input"
                            style={{minWidth: '250px'}}
                        />
                        <button type="submit" className="premium-btn">
                            {loading ? 'Locating...' : 'Search'}
                        </button>
                    </form>
                </div>

                <p style={{textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '1.2rem'}}>
                    Click ANYWHERE on the map, or use the search bar, to reveal high-def photos and info about that exact location anywhere in the world!
                </p>

                <div className="glass-panel" style={{height: '750px', borderRadius: '20px', padding: '8px', overflow: 'hidden', position: 'relative'}}>
                    
                    {/* The Interactive Global Map */}
                    <MapContainer center={[20, 0]} zoom={3} style={{height: '100%', width: '100%', borderRadius: '15px'}} scrollWheelZoom={true} zoomControl={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                        
                        <MapClickHandler onMapClick={handleMapClick} />

                        {selectedLocation && (
                            <>
                                <Marker position={selectedLocation.position} />
                                {/* Offset view slightly left to accommodate the sidebar */}
                                <MapFlyTo position={[selectedLocation.position[0], selectedLocation.position[1] - 8]} zoom={6} />
                            </>
                        )}
                    </MapContainer>

                    {/* Google Maps style Dynamic Sidebar Overlay for the clicked Location */}
                    {selectedLocation && (
                        <div className="glass-panel" style={{
                            position: 'absolute', top: '20px', right: '20px', bottom: '20px', width: '420px',
                            backgroundColor: 'rgba(18, 21, 33, 0.85)', backdropFilter: 'blur(30px)',
                            border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '16px', zIndex: 1000,
                            display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                            animation: 'slideInRight 0.4s ease-out'
                        }}>
                            {/* Header Section */}
                            <div style={{padding: '30px 25px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative'}}>
                                <button 
                                    onClick={() => setSelectedLocation(null)}
                                    style={{
                                        position: 'absolute', top: '20px', right: '20px', 
                                        background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', 
                                        borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = 'rgba(255,118,117,1)'}
                                    onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                </button>
                                <h3 className="gradient-text" style={{fontSize: '2rem', margin: '0 0 15px 0', paddingRight: '30px'}}>{selectedLocation.name}</h3>
                                <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.6}}>{selectedLocation.description}</p>
                            </div>

                            {/* Scrollable Gallery Section */}
                            <div style={{padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px'}}>
                                {selectedLocation.photos.length > 0 ? selectedLocation.photos.map((photo, idx) => (
                                    <div key={idx} style={{
                                        backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '12px', overflow: 'hidden',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                    }}>
                                        <img 
                                            src={photo.url} alt={photo.title} 
                                            onClick={() => setFullscreenImage(photo.url)}
                                            style={{width: '100%', height: '240px', objectFit: 'cover', display: 'block', cursor: 'zoom-in', transition: 'transform 0.3s ease'}} 
                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                        <div style={{padding: '12px 15px', backgroundColor: 'rgba(255,255,255,0.05)'}}>
                                            <h4 style={{margin: 0, color: '#fff', fontSize: '0.95rem', fontWeight: '500'}}>{photo.title}</h4>
                                        </div>
                                    </div>
                                )) : (
                                    <p style={{color: 'var(--text-muted)', textAlign: 'center'}}>No images found for this location.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </div>
            {/* Fullscreen Image Overlay */}
            {fullscreenImage && (
                <div 
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                        backgroundColor: 'rgba(0, 0, 0, 0.92)', backdropFilter: 'blur(10px)',
                        zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center',
                        animation: 'fadeIn 0.3s ease-out'
                    }} 
                    onClick={() => setFullscreenImage(null)}
                >
                    <button style={{
                        position: 'absolute', top: '30px', right: '40px', background: 'rgba(255,255,255,0.1)', 
                        border: 'none', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', 
                        fontSize: '2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>&times;</button>
                    <img 
                        src={fullscreenImage} 
                        style={{maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 10px 50px rgba(0,0,0,0.8)'}} 
                        alt="Enlarged Fullscreen" 
                        onClick={(e) => e.stopPropagation()} 
                    />
                </div>
            )}

            {/* Inline keyframe animations */}
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default WorldTour;
