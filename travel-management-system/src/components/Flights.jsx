import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PaymentModal from './PaymentModal';
import LiveTrackingMap from './LiveTrackingMap';
import './SharedPremium.css';

const API_BASE = import.meta.env.VITE_API_URL || 'https://voyago-trvel-2.onrender.com';

const mockFlightsData = [
    { id: 'FL001', airline: 'FlyHigh Airways', departureTime: '2025-09-08T08:00:00Z', arrivalTime: '2025-09-08T11:00:00Z', durationMinutes: 180, duration: '3h 00m', origin: 'JFK', destination: 'LAX', price: 450.75, stops: 0 },
    { id: 'FL002', airline: 'Global Airlines', departureTime: '2025-09-08T18:30:00Z', arrivalTime: '2025-09-08T22:00:00Z', durationMinutes: 210, duration: '3h 30m', origin: 'JFK', destination: 'LAX', price: 310.00, stops: 1 },
    { id: 'FL003', airline: 'FlyHigh Airways', departureTime: '2025-09-08T12:00:00Z', arrivalTime: '2025-09-08T15:00:00Z', durationMinutes: 180, duration: '3h 00m', origin: 'JFK', destination: 'LAX', price: 475.25, stops: 0 },
    { id: 'FL004', airline: 'Budget Air', departureTime: '2025-09-08T06:15:00Z', arrivalTime: '2025-09-08T10:45:00Z', durationMinutes: 270, duration: '4h 30m', origin: 'JFK', destination: 'LAX', price: 290.50, stops: 1 },
    { id: 'FL005', airline: 'Luxury Skies', departureTime: '2025-09-08T20:00:00Z', arrivalTime: '2025-09-08T23:15:00Z', durationMinutes: 195, duration: '3h 15m', origin: 'JFK', destination: 'LAX', price: 850.00, stops: 0 }
];

const FlightCategories = [
    { id: 'Economy', icon: '💺', name: 'Economy' },
    { id: 'PremiumEconomy', icon: '✨', name: 'Premium Eco' },
    { id: 'Business', icon: '💼', name: 'Business' },
    { id: 'FirstClass', icon: '🥂', name: 'First Class' },
];

const FlightsSimplified = () => {
    const [departureCity, setDepartureCity] = useState('JFK');
    const [destinationCity, setDestinationCity] = useState('LAX');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [flightClass, setFlightClass] = useState('Economy');
    const [sortBy, setSortBy] = useState('');
    const [filterTime, setFilterTime] = useState('');
    const [filterStops, setFilterStops] = useState('');

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [selectedFlight, setSelectedFlight] = useState(null);
    const [bookingName, setBookingName] = useState(localStorage.getItem('userName') || '');
    const bookingEmail = localStorage.getItem('userEmail') || 'user@example.com';
    const [showPayment, setShowPayment] = useState(false);
    const [bookedFlight, setBookedFlight] = useState(null);

    const fetchFlights = async () => {
        setLoading(true); setError(''); setMessage('');
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            setFlights(mockFlightsData);
            if (mockFlightsData.length === 0) setMessage('No flights found.');
        } catch (err) {
            setError('Failed to fetch flights.');
            setFlights([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!departureCity || !destinationCity || !departureDate || passengers < 1) {
            setError('Please fill required fields.');
            return;
        }
        fetchFlights();
    };

    const handleProceedToPayment = (e) => {
        e.preventDefault();
        setShowPayment(true);
    };

    const handlePaymentConfirm = async () => {
        setShowPayment(false);
        setLoading(true);
        try {
            await axios.post(`${API_BASE}/api/flights/book`, {
                passengerName: bookingName, email: bookingEmail, flightNumber: selectedFlight.id,
                origin: selectedFlight.origin, destination: selectedFlight.destination,
                departureTime: selectedFlight.departureTime, price: selectedFlight.price
            });
            setMessage(`Booking confirmed! Email sent to ${bookingEmail}.`);
            setBookedFlight(selectedFlight);
            setSelectedFlight(null); setBookingName(localStorage.getItem('userName') || '');
        } catch (err) {
            setError('Failed to book flight.');
        } finally {
            setLoading(false);
        }
    };

    // Filter and Sort Logic
    let processedFlights = [...flights];

    if (filterTime === 'morning') {
        processedFlights = processedFlights.filter(f => {
            const hr = new Date(f.departureTime).getUTCHours();
            return hr >= 5 && hr < 12;
        });
    } else if (filterTime === 'evening') {
        processedFlights = processedFlights.filter(f => {
            const hr = new Date(f.departureTime).getUTCHours();
            return hr >= 16 && hr <= 23;
        });
    }

    if (filterStops !== '') {
        processedFlights = processedFlights.filter(f => f.stops === parseInt(filterStops));
    }

    if (sortBy === 'price_asc') {
        processedFlights.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'duration_asc') {
        processedFlights.sort((a, b) => a.durationMinutes - b.durationMinutes);
    }

    return (
        <div className="premium-container">
            <Link to="/home" className="back-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Home
            </Link>

            <h2 className="premium-title float-anim"><span className="gradient-text">Book</span> Flights</h2>

            {message && <p style={{color: '#00d2d3', textAlign: 'center', marginBottom: '1rem'}} className="animate-fade-in-up">{message}</p>}
            {error && <p style={{color: '#ff7675', textAlign: 'center', marginBottom: '1rem'}} className="animate-fade-in-up">{error}</p>}

            <div className="category-pills animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                {FlightCategories.map(cat => (
                    <div 
                        key={cat.id} 
                        className={`category-pill ${flightClass === cat.id ? 'active' : ''}`}
                        onClick={() => setFlightClass(cat.id)}
                    >
                        <span>{cat.icon}</span> {cat.name}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSearchSubmit} className="glass-panel" style={{padding: '30px', marginBottom: '40px'}}>
                <div className="premium-form-grid">
                    <div className="premium-input-group">
                        <label className="premium-label">Departure (IATA)</label>
                        <input type="text" className="premium-input" value={departureCity} onChange={e => setDepartureCity(e.target.value)} required placeholder="JFK" />
                    </div>
                    <div className="premium-input-group">
                        <label className="premium-label">Destination (IATA)</label>
                        <input type="text" className="premium-input" value={destinationCity} onChange={e => setDestinationCity(e.target.value)} required placeholder="LAX" />
                    </div>
                    <div className="premium-input-group">
                        <label className="premium-label">Date</label>
                        <input type="date" className="premium-input" value={departureDate} onChange={e => setDepartureDate(e.target.value)} required />
                    </div>
                    <div className="premium-input-group">
                        <label className="premium-label">Passengers</label>
                        <input type="number" className="premium-input" value={passengers} onChange={e => setPassengers(Math.max(1, parseInt(e.target.value) || 1))} min="1" required />
                    </div>
                </div>
                <button type="submit" className="premium-btn" style={{width: '100%'}}>
                    {loading ? 'Searching...' : 'Search Flights'}
                </button>
            </form>

            {flights.length > 0 && !loading && (
                <div className="glass-panel animate-fade-in-up" style={{padding: '20px', marginBottom: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center'}}>
                    <strong style={{color: 'var(--secondary-accent)'}}>Enhance Search:</strong>
                    
                    <select className="premium-select" style={{padding: '8px 15px'}} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="">Sort By...</option>
                        <option value="price_asc">Price (Low → High)</option>
                        <option value="duration_asc">Duration (Fastest first)</option>
                    </select>

                    <select className="premium-select" style={{padding: '8px 15px'}} value={filterTime} onChange={e => setFilterTime(e.target.value)}>
                        <option value="">Filter Time...</option>
                        <option value="morning">Morning (5 AM - 12 PM)</option>
                        <option value="evening">Evening (4 PM - 11 PM)</option>
                    </select>

                    <select className="premium-select" style={{padding: '8px 15px'}} value={filterStops} onChange={e => setFilterStops(e.target.value)}>
                        <option value="">Filter Stops...</option>
                        <option value="0">Non-Stop</option>
                        <option value="1">1 Stop</option>
                    </select>
                </div>
            )}

            <div className="premium-card-grid">
                {selectedFlight && !showPayment && (
                     <div className="glass-panel premium-item-card animate-fade-in-up" style={{gridColumn: '1 / -1', background: 'rgba(108, 92, 231, 0.1)'}}>
                        <h3 className="gradient-text" style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Complete Booking for {selectedFlight.id} ({flightClass})</h3>
                        <p style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px'}}>Total Price: ${selectedFlight.price}</p>
                        <form onSubmit={handleProceedToPayment} className="premium-form-grid">
                            <input className="premium-input" placeholder="Your Name" required value={bookingName} onChange={e => setBookingName(e.target.value)} />
                            <button className="premium-btn" type="submit">Proceed to Payment</button>
                            <button type="button" className="premium-btn premium-btn-secondary" onClick={() => setSelectedFlight(null)}>Cancel</button>
                        </form>
                     </div>
                )}

                {loading ? (
                    <>
                        <div className="skeleton-card" />
                        <div className="skeleton-card" style={{animationDelay: '0.2s'}} />
                        <div className="skeleton-card" style={{animationDelay: '0.4s'}} />
                    </>
                ) : processedFlights.length === 0 && flights.length > 0 ? (
                    <p style={{textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-secondary)'}}>No flights match your filters.</p>
                ) : (
                    processedFlights.map((flight, idx) => (
                        <div key={flight.id} className="glass-panel premium-item-card animate-fade-in-up" style={{animationDelay: `${idx * 0.1}s`}}>
                            <div className="premium-item-header">
                                <div>
                                    <h3 style={{margin: 0, fontSize: '1.2rem'}}>{flight.airline} <span style={{fontSize: '0.8rem', opacity: 0.7}}>• {flightClass}</span></h3>
                                    <span style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>{flight.id} • {flight.stops === 0 ? 'Non-Stop' : `${flight.stops} Stop(s)`}</span>
                                </div>
                                <span className="premium-price">${flightClass === 'Business' ? (flight.price * 2).toFixed(2) : flightClass === 'FirstClass' ? (flight.price * 3.5).toFixed(2) : flight.price}</span>
                            </div>
                            <div className="premium-detail-row">
                                <span>{flight.origin} &rarr; {flight.destination}</span>
                                <span>{flight.duration}</span>
                            </div>
                            <div className="premium-detail-row" style={{marginTop: '10px', marginBottom: '20px'}}>
                                <strong>Dep:</strong> {new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                <strong style={{marginLeft: '10px'}}>Arr:</strong> {new Date(flight.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            <button onClick={() => setSelectedFlight(flight)} className="premium-btn">
                                Select Flight
                            </button>
                        </div>
                    ))
                )}
            </div>

            {bookedFlight && (
                <div className="glass-panel" style={{padding: '30px', marginTop: '30px'}}>
                    <h3 className="gradient-text" style={{fontSize: '1.5rem', marginBottom: '20px'}}>Live Flight Tracking: {bookedFlight.id}</h3>
                    <LiveTrackingMap type="flight" startCoords={[40.6413, -73.7781]} endCoords={[33.9416, -118.4085]} height="400px" />
                </div>
            )}

            {showPayment && <PaymentModal amount={selectedFlight.price} onConfirm={handlePaymentConfirm} onCancel={() => setShowPayment(false)} />}
        </div>
    );
};

export default FlightsSimplified;