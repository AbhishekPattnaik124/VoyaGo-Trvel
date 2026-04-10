import React, { useState } from 'react';
import './TourBooking.css';
import PaymentModal from './PaymentModal';
import { useNavigate } from 'react-router-dom';

const tourPackages = [
    {
        id: 1,
        name: "Paris Romantic Getaway",
        destination: "Paris, France",
        price: 1500,
        days: 5,
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
        description: "Experience the magic of Paris. Fully bundled: Round-trip Flight, 5-star Hotel, Airport Bus transfer, and a personal Rental Car for exploring."
    },
    {
        id: 2,
        name: "Tokyo Extravaganza",
        destination: "Tokyo, Japan",
        price: 2200,
        days: 7,
        image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800",
        description: "Dive into the vibrant culture of Tokyo. Includes: Direct Flights, Luxury Hotel stay, Bullet Train pass, and premium Car Rental."
    },
    {
        id: 3,
        name: "Swiss Alps Adventure",
        destination: "Zurich, Switzerland",
        price: 1800,
        days: 6,
        image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800",
        description: "The ultimate mountain escape. Bundled: Flight, Ski Resort Hotel, Panoramic Bus tour, and an SUV Rental for snowy terrain."
    }
];

const TourBooking = () => {
    const navigate = useNavigate();
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [customerName, setCustomerName] = useState(localStorage.getItem('userName') || '');
    const customerEmail = localStorage.getItem('userEmail') || 'user@example.com';

    const handleBookClick = (pkg) => {
        setSelectedPackage(pkg);
    };

    const handleConfirmPayment = async () => {
        setLoading(true);
        setMessage('');

        // Calculate dates
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 14); // default 2 weeks from now
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + selectedPackage.days);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://voyago-trvel-2.onrender.com'}/api/tours/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    customerName: customerName || 'Valued Traveller',
                    customerEmail: customerEmail,
                    tourName: selectedPackage.name,
                    destination: selectedPackage.destination,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    price: selectedPackage.price
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to book tour package');
            }

            setMessage('Tour booked successfully! Check your email for your fully bundled itinerary (Flight, Hotel, Bus, Car).');
            setShowPayment(false);
        } catch (error) {
            setMessage(error.message || 'Error occurred while booking. Please try again.');
            setShowPayment(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tour-booking-page">
            <nav className="navbar-glass scrolled">
                <div className="nav-brand" onClick={() => navigate('/home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6c5ce7, #00d2d3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1rem', color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>V</div>
                    <span className="gradient-text" style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.5px' }}>VoyaGo™</span>
                </div>
            </nav>

            <div className="tour-booking-container">
                <h1 className="tour-title">Exclusive Tour <span className="gradient-text">Packages</span></h1>
                <p className="tour-subtitle">Select a package and book your entire trip in one click. We automatically reserve your Flight, Hotel, Bus, and Car!</p>
                
                {message && <div className={`message-banner ${message.includes('success') ? 'success' : 'error'}`}>{message}</div>}

                <div className="packages-grid">
                    {tourPackages.map((pkg) => (
                        <div className="package-card" key={pkg.id}>
                            <div className="package-image" style={{ backgroundImage: `url(${pkg.image})` }}>
                                <div className="package-price">${pkg.price}</div>
                            </div>
                            <div className="package-info">
                                <h3>{pkg.name}</h3>
                                <p className="package-dest">📍 {pkg.destination} • ⏱ {pkg.days} Days</p>
                                <p className="package-desc">{pkg.description}</p>
                                <button className="btn-book" onClick={() => handleBookClick(pkg)}>Select Package</button>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedPackage && !showPayment && !message.includes('success') && (
                    <div className="booking-details-modal">
                        <div className="booking-details-content glass-panel">
                            <h2>Complete Your Booking details</h2>
                            <p>You have selected: <strong>{selectedPackage.name}</strong></p>
                            
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="John Doe" required />
                            </div>

                            <div className="booking-actions">
                                <button className="btn-cancel" onClick={() => setSelectedPackage(null)}>Cancel</button>
                                <button className="btn-book" onClick={() => {
                                    if(customerName) setShowPayment(true);
                                    else alert('Please enter your name');
                                }}>Proceed to Payment</button>
                            </div>
                        </div>
                    </div>
                )}

                {showPayment && selectedPackage && (
                    <PaymentModal 
                        amount={selectedPackage.price}
                        onConfirm={handleConfirmPayment}
                        onCancel={() => setShowPayment(false)}
                    />
                )}
                
                {loading && <div className="loading-overlay">Processing your complete tour package booking...</div>}
            </div>
        </div>
    );
};

export default TourBooking;
