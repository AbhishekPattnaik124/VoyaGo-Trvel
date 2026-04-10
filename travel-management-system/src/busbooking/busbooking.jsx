import React, { useState } from 'react';
import PaymentModal from '../components/PaymentModal';
import LiveTrackingMap from '../components/LiveTrackingMap';
import axios from 'axios';
import '../components/SharedPremium.css';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'https://voyago-trvel-2.onrender.com'}/api`;

const mockSearchResults = [
  { id: 'bus-1', operator: 'Volvo Multi-Axle', type: 'AC Sleeper', departureTime: '20:00', arrivalTime: '06:00', durationMinutes: 600, duration: '10h', price: 1500, availableSeats: 25, amenities: ['Wi-Fi', 'Blanket'], seatingPlan: { lowerDeck: [['S1', 'S2', 'S3', 'S4'], ['S5', 'S6', 'S7', 'S8'], ['S9', 'S10', 'S11', 'S12']] } },
  { id: 'bus-2', operator: 'BharatBenz Glider', type: 'Non-AC Seater', departureTime: '21:30', arrivalTime: '07:30', durationMinutes: 600, duration: '10h', price: 1000, availableSeats: 15, amenities: ['Charging port'], seatingPlan: { lowerDeck: [['S1', 'S2', 'S3', 'S4'], ['S5', 'S6', 'S7', 'S8'], ['S9', 'S10', 'S11', 'S12']] } },
  { id: 'bus-3', operator: 'Scania Metrolink', type: 'AC Semi-Sleeper', departureTime: '22:15', arrivalTime: '08:00', durationMinutes: 585, duration: '9h 45m', price: 1800, availableSeats: 12, amenities: ['Wi-Fi', 'Snacks'], seatingPlan: { lowerDeck: [['S1', 'S2', 'S3', 'S4'], ['S5', 'S6', 'S7', 'S8'], ['S9', 'S10', 'S11', 'S12']] } },
  { id: 'bus-4', operator: 'Morning Star Express', type: 'AC Seater', departureTime: '08:30', arrivalTime: '17:00', durationMinutes: 510, duration: '8h 30m', price: 1200, availableSeats: 30, amenities: ['Water Bottle'], seatingPlan: { lowerDeck: [['S1', 'S2', 'S3', 'S4'], ['S5', 'S6', 'S7', 'S8'], ['S9', 'S10', 'S11', 'S12']] } },
  { id: 'bus-5', operator: 'Budget Travels', type: 'Non-AC Sleeper', departureTime: '10:00', arrivalTime: '20:00', durationMinutes: 600, duration: '10h', price: 800, availableSeats: 8, amenities: [], seatingPlan: { lowerDeck: [['S1', 'S2', 'S3', 'S4'], ['S5', 'S6', 'S7', 'S8'], ['S9', 'S10', 'S11', 'S12']] } }
];

const BusCategories = [
    { id: '', icon: '🚌', name: 'All Buses' },
    { id: 'ACSleeper', icon: '❄️', name: 'AC Sleeper' },
    { id: 'Volvo', icon: '✨', name: 'Volvo AC' },
    { id: 'NonAC', icon: '💨', name: 'Non-AC' }
];

const BusBooking = () => {
    const [busType, setBusType] = useState('');
  const [step, setStep] = useState('search_results');
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const [sortBy, setSortBy] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [filterAC, setFilterAC] = useState('');

  // Process filters and sorting
  let processedBuses = [...mockSearchResults];

  if (filterTime === 'morning') {
      processedBuses = processedBuses.filter(b => parseInt(b.departureTime.split(':')[0]) < 12);
  } else if (filterTime === 'evening') {
      processedBuses = processedBuses.filter(b => parseInt(b.departureTime.split(':')[0]) >= 16);
  }

  if (filterAC === 'ac') {
      processedBuses = processedBuses.filter(b => !b.type.toLowerCase().includes('non-ac') && b.type.toLowerCase().includes('ac'));
  } else if (filterAC === 'non_ac') {
      processedBuses = processedBuses.filter(b => b.type.toLowerCase().includes('non-ac'));
  }

  if (sortBy === 'price_asc') {
      processedBuses.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'duration_asc') {
      processedBuses.sort((a, b) => a.durationMinutes - b.durationMinutes);
  }

  const handleSelectSeat = (seat) => {
    if (selectedSeats.includes(seat)) setSelectedSeats(selectedSeats.filter(s => s !== seat));
    else setSelectedSeats([...selectedSeats, seat]);
  };

  const handlePassengerDetailsSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const details = selectedSeats.map((seat, index) => ({
      seat, name: formData.get(`name-${index}`), age: formData.get(`age-${index}`), gender: formData.get(`gender-${index}`),
    }));
    setPassengerDetails(details);
    setShowPayment(true);
  };

  const handlePaymentConfirm = async () => {
    setShowPayment(false);
    
    try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) { alert('Please log in first.'); return; }

        for (const seat of selectedSeats) {
            await axios.post(`${API_BASE_URL}/bus-reservations/book`, {
                busId: selectedBus.id,
                seatNumber: parseInt(seat.replace(/\D/g, '')) || 0,
                userEmail: userEmail,
                operator: selectedBus.operator,
                busNumber: selectedBus.id
            });
        }
    } catch (err) {
        console.error("Failed to save bus booking to database:", err);
        // We continue regardless to show the confirmation UI for mock experience
    }

    setBookingDetails({
      pnr: Math.random().toString(36).substr(2, 9).toUpperCase(),
      bus: selectedBus, passengers: passengerDetails,
      totalFare: selectedBus.price * selectedSeats.length,
      bookingDate: new Date().toLocaleDateString(),
    });
    setStep('confirmation');
  };

  return (
    <div className="premium-container">
        <h2 className="premium-title float-anim"><span className="gradient-text">Bus</span> Services</h2>

        {step === 'search_results' && (
            <>
                <div className="category-pills animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                    {BusCategories.map(cat => (
                        <div 
                            key={cat.id} 
                            className={`category-pill ${busType === cat.id ? 'active' : ''}`}
                            onClick={() => setBusType(cat.id)}
                        >
                            <span>{cat.icon}</span> {cat.name}
                        </div>
                    ))}
                </div>

                <div className="glass-panel animate-fade-in-up" style={{padding: '20px', marginBottom: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center'}}>
                    <strong style={{color: 'var(--secondary-accent)'}}>Enhance Search:</strong>
                    
                    <select className="premium-select" style={{padding: '8px 15px'}} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="">Sort By...</option>
                        <option value="price_asc">Price (Low → High)</option>
                        <option value="duration_asc">Duration (Fastest first)</option>
                    </select>

                    <select className="premium-select" style={{padding: '8px 15px'}} value={filterTime} onChange={e => setFilterTime(e.target.value)}>
                        <option value="">Filter Time...</option>
                        <option value="morning">Morning (Before 12 PM)</option>
                        <option value="evening">Evening (After 4 PM)</option>
                    </select>

                    <select className="premium-select" style={{padding: '8px 15px'}} value={filterAC} onChange={e => setFilterAC(e.target.value)}>
                        <option value="">Filter AC / Non-AC...</option>
                        <option value="ac">AC Only</option>
                        <option value="non_ac">Non-AC Only</option>
                    </select>
                </div>

                <div className="premium-card-grid">
                    {processedBuses.length === 0 ? (
                        <p style={{textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-secondary)'}}>No buses match your filters.</p>
                    ) : (
                        processedBuses.map((bus, idx) => (
                        <div key={bus.id} className="glass-panel premium-item-card animate-fade-in-up" style={{animationDelay: `${idx * 0.15}s`}}>
                            <div className="premium-item-header">
                                <div><h3 style={{margin:0}}>{bus.operator}</h3><span style={{color:'var(--text-muted)'}}>{bus.type}</span></div>
                                <span className="premium-price">₹{bus.price}</span>
                            </div>
                            <div className="premium-detail-row"><span>{bus.departureTime} - {bus.arrivalTime} ({bus.duration})</span></div>
                            <div className="premium-detail-row" style={{marginBottom:'20px'}}>
                                <span style={{color: bus.availableSeats > 0 ? '#00d2d3' : '#ff7675'}}>{bus.availableSeats} seats left</span>
                                <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{bus.amenities.join(' • ')}</span>
                            </div>
                            <button className="premium-btn" onClick={() => { setSelectedBus(bus); setStep('seat_selection'); }}>Select Seats</button>
                        </div>
                    )))}
                </div>
            </>
        )}

        {step === 'seat_selection' && (
            <div className="glass-panel" style={{padding:'30px'}}>
                <h3 className="gradient-text" style={{fontSize: '1.5rem', marginBottom: '20px'}}>Seats for {selectedBus.operator}</h3>
                <div style={{display:'flex', gap:'40px', flexWrap:'wrap', justifyContent:'center'}}>
                    <div style={{display:'grid', gap:'10px', gridTemplateColumns:'repeat(4, 1fr)'}}>
                        {selectedBus.seatingPlan.lowerDeck.flat().map((seat) => (
                            <div key={seat} onClick={() => handleSelectSeat(seat)} 
                                style={{
                                    padding:'15px', borderRadius:'8px', cursor:'pointer', textAlign:'center', fontWeight:'bold',
                                    background: selectedSeats.includes(seat) ? 'var(--secondary-accent)' : 'rgba(255,255,255,0.05)',
                                    color: selectedSeats.includes(seat) ? '#000' : '#fff',
                                    border: '1px solid var(--border-glass)'
                                }}>
                                {seat}
                            </div>
                        ))}
                    </div>
                    <div style={{display:'flex', flexDirection:'column', gap:'20px', minWidth:'250px'}}>
                        <div className="glass-panel" style={{padding:'20px'}}>
                            <h4>Selected: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</h4>
                            <p className="premium-price" style={{marginTop:'10px'}}>₹{selectedBus.price * selectedSeats.length}</p>
                        </div>
                        <button className="premium-btn" onClick={() => selectedSeats.length ? setStep('passenger_details') : alert('Pick a seat')}>Continue</button>
                        <button className="premium-btn premium-btn-secondary" onClick={() => setStep('search_results')}>Back</button>
                    </div>
                </div>
            </div>
        )}

        {step === 'passenger_details' && !showPayment && (
            <form onSubmit={handlePassengerDetailsSubmit} className="glass-panel" style={{padding:'30px'}}>
                <h3 style={{marginBottom:'20px'}}>Passenger Details</h3>
                {selectedSeats.map((seat, idx) => (
                    <div key={idx} className="premium-form-grid" style={{background:'rgba(255,255,255,0.02)', padding:'15px', borderRadius:'10px'}}>
                        <p style={{gridColumn:'1/-1', fontWeight:'bold'}}>Seat {seat}</p>
                        <input className="premium-input" placeholder="Full Name" name={`name-${idx}`} required />
                        <input className="premium-input" type="number" placeholder="Age" name={`age-${idx}`} required />
                        <select className="premium-select" name={`gender-${idx}`} required>
                            <option value="">Gender</option>
                            <option value="male">Male</option><option value="female">Female</option>
                        </select>
                    </div>
                ))}
                <div style={{display:'flex', gap:'15px', marginTop:'20px'}}>
                    <button className="premium-btn" type="submit">Proceed to Payment</button>
                    <button type="button" className="premium-btn premium-btn-secondary" onClick={() => setStep('seat_selection')}>Back</button>
                </div>
            </form>
        )}

        {showPayment && <PaymentModal amount={selectedBus.price * selectedSeats.length} onConfirm={handlePaymentConfirm} onCancel={() => setShowPayment(false)} />}

        {step === 'confirmation' && (
            <div className="glass-panel" style={{padding:'40px', textAlign:'center'}}>
                <h2 className="gradient-text" style={{fontSize: '2.5rem', marginBottom:'20px'}}>Booking Confirmed! 🎉</h2>
                <div style={{fontSize:'1.2rem', lineHeight:'1.8'}}>
                    <p><strong>PNR:</strong> {bookingDetails.pnr}</p>
                    <p><strong>Total Fare:</strong> <span className="premium-price">₹{bookingDetails.totalFare}</span></p>
                </div>
                
                <h3 className="gradient-text" style={{marginTop: '40px', marginBottom: '20px', fontSize: '1.8rem'}}>Live Bus Tracking</h3>
                <LiveTrackingMap type="bus" startCoords={[18.5204, 73.8567]} endCoords={[19.0760, 72.8777]} height="400px" />

                <button className="premium-btn" style={{margin:'40px auto 0'}} onClick={() => window.location.href='/home'}>Back to Home</button>
            </div>
        )}
    </div>
  );
};
export default BusBooking;