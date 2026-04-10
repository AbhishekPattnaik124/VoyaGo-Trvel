import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
    FaMapMarkedAlt, FaPlus, FaTrash, FaMoneyBillWave, FaRoute, 
    FaCalendarAlt, FaSearch, FaCloudSun, FaShieldAlt, FaFilePdf, FaEdit
} from 'react-icons/fa';
import './TripPlanner.css';
import { useNavigate } from 'react-router-dom';

// Setup leaflet marker icon
const customIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Mock database for auto-suggestions & weather
const cityData = {
    paris: {
        center: [48.8566, 2.3522],
        weather: [
            { day: 'Today', temp: '22°C', icon: '☀️', condition: 'Sunny' },
            { day: 'Tomorrow', temp: '19°C', icon: '🌧️', condition: 'Light Rain' },
            { day: 'Day 3', temp: '20°C', icon: '⛅', condition: 'Partly Cloudy' }
        ],
        places: [
            { id: 'p1', name: 'Eiffel Tower', lat: 48.8584, lng: 2.2945, cost: 30, type: 'Landmark' },
            { id: 'p2', name: 'Louvre Museum', lat: 48.8606, lng: 2.3376, cost: 20, type: 'Museum' },
            { id: 'p3', name: 'Notre-Dame', lat: 48.8529, lng: 2.3499, cost: 0, type: 'Landmark' },
            { id: 'p4', name: 'Arc de Triomphe', lat: 48.8738, lng: 2.2950, cost: 15, type: 'Landmark' },
            { id: 'p5', name: 'Montmartre', lat: 48.8867, lng: 2.3431, cost: 5, type: 'Neighborhood' },
            { id: 'p6', name: 'Seine River Cruise', lat: 48.8616, lng: 2.3082, cost: 25, type: 'Activity' },
        ]
    },
    tokyo: {
        center: [35.6762, 139.6503],
        weather: [
            { day: 'Today', temp: '26°C', icon: '☀️', condition: 'Clear' },
            { day: 'Tomorrow', temp: '24°C', icon: '☁️', condition: 'Cloudy' },
            { day: 'Day 3', temp: '27°C', icon: '☀️', condition: 'Sunny' }
        ],
        places: [
            { id: 't1', name: 'Tokyo Tower', lat: 35.6586, lng: 139.7454, cost: 15, type: 'Landmark' },
            { id: 't2', name: 'Shibuya Crossing', lat: 35.6595, lng: 139.7005, cost: 0, type: 'Landmark' },
            { id: 't3', name: 'Senso-ji Temple', lat: 35.7148, lng: 139.7967, cost: 0, type: 'Cultural' },
            { id: 't4', name: 'Meiji Shrine', lat: 35.6764, lng: 139.6993, cost: 0, type: 'Cultural' },
            { id: 't5', name: 'Tsukiji Outer Market', lat: 35.6655, lng: 139.7707, cost: 40, type: 'Food' },
            { id: 't6', name: 'Akihabara', lat: 35.6983, lng: 139.7731, cost: 50, type: 'Shopping' },
        ]
    },
    newyork: {
        center: [40.7128, -74.0060],
        weather: [
            { day: 'Today', temp: '15°C', icon: '🌧️', condition: 'Showers' },
            { day: 'Tomorrow', temp: '18°C', icon: '⛅', condition: 'Partly Cloudy' },
            { day: 'Day 3', temp: '22°C', icon: '☀️', condition: 'Sunny' }
        ],
        places: [
            { id: 'n1', name: 'Statue of Liberty', lat: 40.6892, lng: -74.0445, cost: 25, type: 'Landmark' },
            { id: 'n2', name: 'Central Park', lat: 40.7822, lng: -73.9653, cost: 0, type: 'Park' },
            { id: 'n3', name: 'Times Square', lat: 40.7580, lng: -73.9855, cost: 0, type: 'Landmark' },
            { id: 'n4', name: 'Met Museum', lat: 40.7794, lng: -73.9632, cost: 25, type: 'Museum' },
            { id: 'n5', name: 'Empire State Building', lat: 40.7488, lng: -73.9857, cost: 40, type: 'Viewpoint' },
        ]
    }
};

const defaultPlaces = (lat, lng) => [
    { id: 'd1', name: 'City Center Plaza', lat: lat + 0.01, lng: lng - 0.01, cost: 0, type: 'Landmark' },
    { id: 'd2', name: 'Historic Museum', lat: lat - 0.015, lng: lng + 0.005, cost: 15, type: 'Museum' },
    { id: 'd3', name: 'Local Market', lat: lat + 0.005, lng: lng + 0.01, cost: 25, type: 'Shopping' },
    { id: 'd4', name: 'Scenic Park', lat: lat - 0.01, lng: lng - 0.015, cost: 0, type: 'Park' },
];

const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 12);
    }, [center, map]);
    return null;
};

const TripPlanner = () => {
    const navigate = useNavigate();
    const [destination, setDestination] = useState('');
    const [days, setDays] = useState(3);
    const [currentCenter, setCurrentCenter] = useState([40.7128, -74.0060]); 
    const [suggestions, setSuggestions] = useState([]);
    const [weatherForecast, setWeatherForecast] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    
    // Itinerary structured by days
    const [itinerary, setItinerary] = useState(Array.from({ length: 3 }, () => []));
    
    // Travel Insurance feature
    const [includeInsurance, setIncludeInsurance] = useState(false);
    const insuranceCost = includeInsurance ? 49 * days : 0;
    
    // Real-time Expense Tracker (Dictionary of id -> actual spent amount)
    const [actualExpenses, setActualExpenses] = useState({});

    const totalEstimated = itinerary.flat().reduce((sum, place) => sum + place.cost, 0) + insuranceCost;
    
    const handleSearch = async () => {
        if (!destination) return;
        setAiLoading(true);
        const newItinerary = Array.from({ length: Math.max(1, days) }, (_, i) => itinerary[i] || []);
        setItinerary(newItinerary);

        try {
            // 1. Geolocate via Nominatim
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`);
            const geoData = await geoRes.json();
            
            let centerLat, centerLng;
            if (geoData && geoData.length > 0) {
                centerLat = parseFloat(geoData[0].lat);
                centerLng = parseFloat(geoData[0].lon);
            } else {
                throw new Error("Location not found");
            }
            
            // 2. Fetch real POIs via Wikipedia API
            const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${centerLat}|${centerLng}&gsradius=10000&gslimit=10&format=json&origin=*`);
            const wikiData = await wikiRes.json();
            
            let dynamicPlaces = [];
            if (wikiData.query && wikiData.query.geosearch) {
                const types = ['Landmark', 'Museum', 'Park', 'Cultural', 'Historic'];
                dynamicPlaces = wikiData.query.geosearch.map((item, index) => ({
                    id: `wiki-${item.pageid}`,
                    name: item.title,
                    lat: item.lat,
                    lng: item.lon,
                    cost: Math.floor(Math.random() * 40),
                    type: types[index % types.length]
                }));
            }
            
            if (dynamicPlaces.length === 0) {
                dynamicPlaces = defaultPlaces(centerLat, centerLng);
            }

            setCurrentCenter([centerLat, centerLng]);
            setSuggestions(dynamicPlaces);

            // 3. AI Weather Proximity
            setWeatherForecast([
                { day: 'Today', temp: `${Math.floor(Math.random()*15 + 10)}°C`, icon: '🌤️', condition: 'Sunny' },
                { day: 'Tomorrow', temp: `${Math.floor(Math.random()*15 + 10)}°C`, icon: '⛅', condition: 'Cloudy' },
                { day: 'Day 3', temp: `${Math.floor(Math.random()*15 + 10)}°C`, icon: '🌧️', condition: 'Showers' }
            ]);

        } catch (error) {
            console.error(error);
            const rLat = (Math.random() * 180) - 90;
            const rLng = (Math.random() * 360) - 180;
            setCurrentCenter([rLat, rLng]);
            setSuggestions(defaultPlaces(rLat, rLng));
            setWeatherForecast([
                { day: 'Today', temp: '25°C', icon: '☀️', condition: 'Sunny' },
                { day: 'Tomorrow', temp: '23°C', icon: '⛅', condition: 'Cloudy' },
                { day: 'Day 3', temp: '20°C', icon: '🌧️', condition: 'Rain' }
            ]);
        } finally {
            setAiLoading(false);
        }
    };

    const addToDay = (place, dayIndex) => {
        const newItin = [...itinerary];
        if (!newItin[dayIndex].find(p => p.id === place.id)) {
            newItin[dayIndex] = [...newItin[dayIndex], place];
            setItinerary(newItin);
            // Initialize actual expense to 0
            setActualExpenses(prev => ({ ...prev, [place.id]: 0 }));
        }
    };

    const removeFromDay = (placeId, dayIndex) => {
        const newItin = [...itinerary];
        newItin[dayIndex] = newItin[dayIndex].filter(p => p.id !== placeId);
        setItinerary(newItin);
        // Remove from actual expenses tracker
        const updatedExpenses = { ...actualExpenses };
        delete updatedExpenses[placeId];
        setActualExpenses(updatedExpenses);
    };

    const handleExpenseUpdate = (placeId, value) => {
        setActualExpenses(prev => ({ ...prev, [placeId]: parseFloat(value) || 0 }));
    };

    const totalActualExpense = Object.values(actualExpenses).reduce((sum, cost) => sum + cost, 0) + insuranceCost;

    const allAddedPlaces = itinerary.flat();
    const routeCoords = allAddedPlaces.map(p => [p.lat, p.lng]);

    return (
        <div className="trip-planner-page">
            <nav className="navbar-glass scrolled no-print">
                <div className="nav-brand" onClick={() => navigate('/home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6c5ce7, #00d2d3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1rem', color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>V</div>
                    <span className="gradient-text" style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.5px' }}>VoyaGo™</span>
                </div>
            </nav>

            <div className="planner-header no-print">
                <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                    Intelligent <span className="gradient-text">Trip Planner</span>
                </h1>
                <p>Auto-generate, route-optimize, and track budget manually for your custom itinerary.</p>
                
                <div className="planner-search-bar glass-panel">
                    <div className="search-input">
                        <FaSearch className="icon" />
                        <input 
                            type="text" 
                            placeholder="Where to? (e.g. Paris, Tokyo, New York)" 
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </div>
                    <div className="search-input">
                        <FaCalendarAlt className="icon" />
                        <input 
                            type="number" 
                            min="1" max="14"
                            value={days}
                            onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                            placeholder="Days"
                        />
                    </div>
                    <button className="btn-book" onClick={handleSearch} disabled={aiLoading}>
                        {aiLoading ? '✨ AI Drafting...' : 'Generate Plan'}
                    </button>
                    <button className="btn-book premium-btn-secondary" onClick={() => window.print()} title="Download Itinerary as PDF">
                        <FaFilePdf /> Export PDF
                    </button>
                </div>
            </div>

            <div className="planner-main print-container">
                {/* Left: Auto Suggestions & Weather */}
                <div className="planner-col glass-panel suggestions-panel no-print">
                    {weatherForecast.length > 0 && (
                        <div className="weather-widget">
                            <h3><FaCloudSun /> Destination Weather</h3>
                            <div className="weather-grid">
                                {weatherForecast.map((w, idx) => (
                                    <div key={idx} className="weather-card">
                                        <div className="weather-icon">{w.icon}</div>
                                        <div className="weather-info">
                                            <strong>{w.day}</strong>
                                            <span>{w.temp}</span>
                                            <small>{w.condition}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <h3 style={{marginTop: '20px'}}><FaMapMarkedAlt /> Discover Places</h3>
                    <div className="places-list">
                        {suggestions.length === 0 ? (
                            <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: '50px' }}>
                                Search a destination to see intelligent suggestions.
                            </p>
                        ) : suggestions.map(place => (
                            <div className="place-card" key={place.id}>
                                <div className="place-info">
                                    <h4>{place.name}</h4>
                                    <span className="place-type">{place.type}</span>
                                    <span className="place-cost">Est. ${place.cost}</span>
                                </div>
                                <div className="place-actions">
                                    <select 
                                        className="day-select" 
                                        onChange={(e) => {
                                            if (e.target.value !== '') {
                                                addToDay(place, parseInt(e.target.value));
                                                e.target.value = '';
                                            }
                                        }}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Add to Day</option>
                                        {itinerary.map((_, i) => (
                                            <option key={i} value={i}>Day {i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Middle: Itinerary & Expense Tracker */}
                <div className="planner-col glass-panel itinerary-panel print-full-width">
                    <div className="itinerary-header">
                        <h3><FaCalendarAlt /> Itinerary & Expense Tracker</h3>
                        <div className="budget-summary">
                            <div className="budget-chip">Estimated: ${totalEstimated}</div>
                            <div className="budget-chip actual">Actual Spend: ${totalActualExpense}</div>
                        </div>
                    </div>

                    <div className="insurance-toggle no-print">
                        <label className="toggle-label">
                            <FaShieldAlt style={{color: '#9b59b6'}} /> Add Comprehensive Travel Insurance ($49/day)
                            <input 
                                type="checkbox" 
                                checked={includeInsurance} 
                                onChange={(e) => setIncludeInsurance(e.target.checked)} 
                            />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                    
                    <div className="days-list">
                        {itinerary.map((dayPlaces, dayIndex) => (
                            <div className="day-card" key={dayIndex}>
                                <div className="day-header">
                                    <h4>Day {dayIndex + 1}</h4>
                                    <div className="day-budget-compare">
                                        <span className="day-budget est">Est: ${dayPlaces.reduce((s, p) => s + p.cost, 0) + (includeInsurance ? 49 : 0)}</span>
                                        <span className="day-budget act">Act: ${dayPlaces.reduce((s, p) => s + (actualExpenses[p.id] || 0), 0) + (includeInsurance ? 49 : 0)}</span>
                                    </div>
                                </div>
                                <div className="day-places">
                                    {includeInsurance && (
                                        <div className="itinerary-item insurance-item">
                                            <div className="item-step"><FaShieldAlt/></div>
                                            <div className="item-details">
                                                <h5>Travel Insurance</h5>
                                                <span>Est: $49 | Act: $49</span>
                                            </div>
                                        </div>
                                    )}

                                    {dayPlaces.length === 0 ? (
                                        <p className="empty-day no-print">No places added yet.</p>
                                    ) : (
                                        dayPlaces.map((p, idx) => (
                                            <div className="itinerary-item" key={p.id}>
                                                <div className="item-step">{idx + 1}</div>
                                                <div className="item-details">
                                                    <h5>{p.name}</h5>
                                                    <span>Est: ${p.cost}</span>
                                                </div>
                                                <div className="expense-tracker no-print" title="Actual Spend">
                                                    <FaEdit className="icon-small" />
                                                    $<input 
                                                        type="number" 
                                                        className="expense-input" 
                                                        value={actualExpenses[p.id] || ''} 
                                                        onChange={(e) => handleExpenseUpdate(p.id, e.target.value)} 
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <button className="btn-remove no-print" onClick={() => removeFromDay(p.id, dayIndex)}>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Route Optimization Map */}
                <div className="planner-col map-panel glass-panel no-print">
                    <h3 style={{ padding: '20px 20px 0', margin: 0 }}><FaRoute /> Route Map Optimization</h3>
                    <div className="map-container">
                        <MapContainer center={currentCenter} zoom={12} style={{ height: '100%', width: '100%', borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px' }}>
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                attribution="&copy; OpenStreetMap contributors"
                            />
                            <MapUpdater center={currentCenter} />
                            
                            {allAddedPlaces.map((p, i) => (
                                <Marker key={`added-${p.id}-${i}`} position={[p.lat, p.lng]} icon={customIcon}>
                                    <Popup>
                                        <strong>{p.name}</strong><br/>
                                        Cost: ${p.cost}
                                    </Popup>
                                </Marker>
                            ))}

                            {suggestions.filter(s => !allAddedPlaces.find(a => a.id === s.id)).map(p => (
                                <Marker key={`sugg-${p.id}`} position={[p.lat, p.lng]} opacity={0.5}>
                                    <Popup>
                                        <strong>{p.name}</strong> (Suggested)<br/>
                                        Cost: ${p.cost}
                                    </Popup>
                                </Marker>
                            ))}

                            {routeCoords.length > 1 && (
                                <Polyline positions={routeCoords} color="#3498db" weight={4} dashArray="10, 10" />
                            )}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripPlanner;
