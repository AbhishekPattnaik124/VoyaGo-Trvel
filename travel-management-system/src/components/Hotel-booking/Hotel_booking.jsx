import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import HotelBookingsList from './HotelBookingsList';
import '../SharedPremium.css';

const HotelCategories = [
    { id: '', icon: '🏨', name: 'All Stays' },
    { id: 'Resort', icon: '🌴', name: 'Resorts' },
    { id: 'Business', icon: '🏢', name: 'Business' },
    { id: 'Boutique', icon: '✨', name: 'Boutique' },
    { id: 'Villa', icon: '🏡', name: 'Villas' }
];

const Hotel_booking = () => {
    const [hotelCategory, setHotelCategory] = useState('');
    const [location, setLocation] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [numberOfRooms, setNumberOfRooms] = useState(1);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [refreshHotelBookings, setRefreshHotelBookings] = useState(0);

    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [bookingGuestName, setBookingGuestName] = useState(localStorage.getItem('userName') || '');
    const [bookingGuestEmail, setBookingGuestEmail] = useState(localStorage.getItem('userEmail') || '');
    const [bookingNumRooms, setBookingNumRooms] = useState(1);
    const [bookingNumGuests, setBookingNumGuests] = useState(1);

    const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

    const fetchHotels = async (searchParams = {}) => {
        setLoading(true); setError(''); setMessage('');
        try {
            const params = new URLSearchParams(searchParams);
            const queryString = params.toString();
            const url = `${API_BASE_URL}/hotels/search${queryString ? `?${queryString}` : ''}`;
            const response = await axios.get(url);
            setHotels(response.data);
            if (response.data.length === 0) setMessage('No hotels found.');
        } catch (err) {
            setError('Failed to fetch hotels.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchHotels(); }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchHotels({ location, checkInDate, checkOutDate, guests: numberOfGuests, rooms: numberOfRooms });
    };

    const handleCreateDummyHotel = async () => {
        setError(''); setMessage('');
        try {
            const dummyHotelData = {
                name: `Grand Hotel ${Math.floor(Math.random() * 1000)}`,
                location: ['New York', 'London', 'Paris', 'Tokyo'][Math.floor(Math.random() * 4)],
                description: 'A luxurious hotel experience.',
                pricePerNight: Math.floor(Math.random() * 200) + 50,
                amenities: ['WiFi', 'Pool', 'Breakfast'],
                images: ['https://via.placeholder.com/300x200/282c34/61dafb?text=Hotel+View'],
                availableRooms: Math.floor(Math.random() * 20) + 10,
                rating: Math.floor(Math.random() * 3) + 3,
            };
            await axios.post(`${API_BASE_URL}/hotels`, dummyHotelData);
            setMessage('Dummy hotel created!');
            fetchHotels();
        } catch (err) {
            setError('Failed to create dummy hotel.');
        }
    };

    const openBookingModal = (hotel) => {
        setSelectedHotel(hotel);
        setBookingNumRooms(numberOfRooms);
        setBookingNumGuests(numberOfGuests);
        setShowBookingModal(true);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault(); setError(''); setMessage('');
        try {
            if (!selectedHotel) return;
            const checkIn = new Date(checkInDate);
            const checkOut = new Date(checkOutDate);
            if (checkOut <= checkIn) { setError('Check-out must be after check-in.'); return; }
            if (bookingNumRooms > selectedHotel.availableRooms) { setError('Not enough available rooms.'); return; }

            const bookingData = {
                hotelId: selectedHotel._id, guestName: bookingGuestName, guestEmail: bookingGuestEmail,
                checkInDate, checkOutDate, numberOfRooms: bookingNumRooms, numberOfGuests: bookingNumGuests,
            };
            await axios.post(`${API_BASE_URL}/hotel-bookings`, bookingData);
            setMessage('Hotel booking successful!');
            setShowBookingModal(false);
            fetchHotels();
            setRefreshHotelBookings(prev => prev + 1);
        } catch (err) {
            setError('Failed to book hotel. Try again.');
        }
    };

    return (
        <div className="premium-container">
                <Link to="/home" className="back-link">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Home
                </Link>

                <h2 className="premium-title float-anim"><span className="gradient-text">Premium</span> Hotels</h2>

                {message && <p style={{color: '#00d2d3', textAlign: 'center', marginBottom: '1rem'}} className="animate-fade-in-up">{message}</p>}
                {error && <p style={{color: '#ff7675', textAlign: 'center', marginBottom: '1rem'}} className="animate-fade-in-up">{error}</p>}

                <div className="category-pills animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                    {HotelCategories.map(cat => (
                        <div 
                            key={cat.id} 
                            className={`category-pill ${hotelCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setHotelCategory(cat.id)}
                        >
                            <span>{cat.icon}</span> {cat.name}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSearchSubmit} className="glass-panel" style={{padding: '35px', marginBottom: '30px'}}>
                    <div className="premium-form-grid">
                        <div className="premium-input-group">
                            <label className="premium-label">Location</label>
                            <input className="premium-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Paris" />
                        </div>
                        <div className="premium-input-group">
                            <label className="premium-label">Guests</label>
                            <input type="number" className="premium-input" value={numberOfGuests} onChange={e => setNumberOfGuests(parseInt(e.target.value)||1)} min="1" />
                        </div>
                        <div className="premium-input-group">
                            <label className="premium-label">Check-in</label>
                            <input type="date" className="premium-input" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} />
                        </div>
                        <div className="premium-input-group">
                            <label className="premium-label">Check-out</label>
                            <input type="date" className="premium-input" value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} />
                        </div>
                        <div className="premium-input-group">
                            <label className="premium-label">Rooms</label>
                            <input type="number" className="premium-input" value={numberOfRooms} onChange={e => setNumberOfRooms(parseInt(e.target.value)||1)} min="1" />
                        </div>
                    </div>
                    <button type="submit" className="premium-btn" style={{width: '100%'}}>{loading ? 'Searching...' : 'Search Hotels'}</button>
                </form>

                <button onClick={handleCreateDummyHotel} className="premium-btn" style={{background: 'rgba(255,255,255,0.05)', margin: '0 auto 40px'}}>Create Dummy Hotel</button>

                <h3 style={{fontSize: '2rem', textAlign: 'center', marginBottom:'20px'}}>Available <span className="gradient-text">{hotelCategory || 'Hotels'}</span></h3>
                
                <div className="premium-card-grid">
                    {loading ? (
                        <>
                            <div className="skeleton-card" style={{height: '400px'}} />
                            <div className="skeleton-card" style={{height: '400px', animationDelay: '0.2s'}} />
                            <div className="skeleton-card" style={{height: '400px', animationDelay: '0.4s'}} />
                        </>
                    ) : (
                        hotels.map((hotel, idx) => (
                            <div key={hotel._id} className="glass-panel premium-item-card animate-fade-in-up" style={{padding:0, overflow:'hidden', animationDelay: `${idx * 0.1}s`}}>
                                {hotel.images?.[0] && <img src={hotel.images[0]} alt={hotel.name} style={{width:'100%', height:'200px', objectFit:'cover'}} />}
                                <div style={{padding: '25px'}}>
                                    <h3 style={{fontSize: '1.4rem'}}>{hotel.name}</h3>
                                    <p style={{color: 'var(--text-muted)', marginBottom: '15px'}}>{hotel.location} &bull; {hotel.rating} Stars <span style={{opacity: 0.7}}>• {hotelCategory || 'Premium'}</span></p>
                                    <p style={{fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.5}}>{hotel.description.substring(0,80)}...</p>
                                    <div className="premium-detail-row" style={{marginBottom: '20px'}}>
                                        <span style={{color: '#00d2d3', fontSize: '1.5rem', fontWeight:'bold'}}>${hotel.pricePerNight}/night</span>
                                        <span style={{color: hotel.availableRooms > 0 ? 'var(--text-secondary)' : '#ff7675'}}>{hotel.availableRooms} rooms left</span>
                                    </div>
                                    {hotel.availableRooms > 0 ? (
                                        <button onClick={() => openBookingModal(hotel)} className="premium-btn" style={{width:'100%'}}>Book Now</button>
                                    ) : (
                                        <p style={{color:'#ff7675', fontWeight:'bold', textAlign:'center', marginTop: '15px'}}>Sold Out</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {showBookingModal && selectedHotel && (
                    <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
                        <div className="glass-panel" style={{padding:'40px', maxWidth:'550px', width:'90%'}}>
                            <h3 className="gradient-text" style={{fontSize:'2rem', marginBottom:'25px'}}>Book {selectedHotel.name}</h3>
                            <form onSubmit={handleBookingSubmit} className="premium-form-grid" style={{gridTemplateColumns:'1fr 1fr'}}>
                                <div className="premium-input-group" style={{gridColumn:'1/-1'}}>
                                    <label className="premium-label">Your Name</label>
                                    <input className="premium-input" required value={bookingGuestName} onChange={e => setBookingGuestName(e.target.value)} />
                                </div>
                                <div className="premium-input-group" style={{gridColumn:'1/-1'}}>
                                    <label className="premium-label">Email</label>
                                    <input className="premium-input" type="email" required value={bookingGuestEmail} onChange={e => setBookingGuestEmail(e.target.value)} />
                                </div>
                                <div className="premium-input-group">
                                    <label className="premium-label">Rooms</label>
                                    <input className="premium-input" type="number" required min="1" max={selectedHotel.availableRooms} value={bookingNumRooms} onChange={e => setBookingNumRooms(parseInt(e.target.value)||1)} />
                                </div>
                                <div className="premium-input-group">
                                    <label className="premium-label">Guests</label>
                                    <input className="premium-input" type="number" required min="1" value={bookingNumGuests} onChange={e => setBookingNumGuests(parseInt(e.target.value)||1)} />
                                </div>
                                <div style={{gridColumn:'1/-1', textAlign:'right', marginTop:'15px'}}>
                                    <p style={{color:'#00d2d3', fontSize:'1.3rem', fontWeight:'bold'}}>Est. Total: ${(selectedHotel.pricePerNight * bookingNumRooms * ((new Date(checkOutDate) - new Date(checkInDate))/(1000*3600*24)) || 0).toFixed(2)}</p>
                                </div>
                                <div style={{gridColumn:'1/-1', display:'flex', gap:'15px', marginTop:'10px'}}>
                                    <button className="premium-btn" type="submit" style={{flex:1}}>Confirm</button>
                                    <button className="premium-btn premium-btn-secondary" type="button" style={{flex:1}} onClick={() => setShowBookingModal(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div style={{marginTop: '50px'}}>
                    <HotelBookingsList refreshTrigger={refreshHotelBookings} />
                </div>
            </div>
    );
};
export default Hotel_booking;