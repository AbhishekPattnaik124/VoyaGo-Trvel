// D:\travel-website\travel-management-system\src\components\Car-rental\CarRentalPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CarRentalsList from './CarRentalsList';
import PaymentModal from '../PaymentModal';
import LiveTrackingMap from '../LiveTrackingMap';
import './CarRentalPage.css';
import '../SharedPremium.css';

const CarCategories = [
    { id: '', icon: '🚗', name: 'All Cars' },
    { id: 'Sedan', icon: '🚙', name: 'Sedan' },
    { id: 'SUV', icon: '🏕️', name: 'SUV' },
    { id: 'Luxury', icon: '💎', name: 'Luxury' },
    { id: 'Electric', icon: '⚡', name: 'Electric' }
];

// Define your backend API base URL here. This should match where your Node.js server is listening.
const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'https://voyago-trvel-1.onrender.com'}/api`;

const CarRentalPage = () => {
    // State for search form inputs
    const [pickupLocation, setPickupLocation] = useState('Chicago'); // Default for quick testing
    // Set default dates to today and 2 days from now, formatted for input type="date"
    const today = new Date();
    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(today.getDate() + 2);

    const [pickupDate, setPickupDate] = useState(today.toISOString().split('T')[0]);
    const [returnDate, setReturnDate] = useState(twoDaysLater.toISOString().split('T')[0]);
    const [carType, setCarType] = useState(''); // Empty string for "Any Type"
    const [seats, setSeats] = useState(1);

    // State for car data display
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [refreshCarRentals, setRefreshCarRentals] = useState(0); // For refreshing the rental list component

    // State for rental modal/form
    const [showRentalModal, setShowRentalModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [rentalCustomerName, setRentalCustomerName] = useState(localStorage.getItem('userName') || '');
    const rentalCustomerEmail = localStorage.getItem('userEmail') || 'user@example.com';
    const [showPayment, setShowPayment] = useState(false);
    const [bookedCar, setBookedCar] = useState(null);

    // Function to fetch cars from the backend based on search parameters
    const fetchCarsData = async (searchParams = {}) => {
        setLoading(true);
        setError('');
        setMessage(''); // Clear message when new search begins
        try {
            // Use current state values as fallback for searchParams not explicitly passed
            const params = new URLSearchParams({
                pickupLocation: searchParams.pickupLocation || pickupLocation,
                pickupDate: searchParams.pickupDate || pickupDate,
                returnDate: searchParams.returnDate || returnDate,
                type: searchParams.type || carType,
                seats: searchParams.seats || seats,
            });
            const queryString = params.toString();
            const url = `${API_BASE_URL}/cars/search${queryString ? `?${queryString}` : ''}`;

            console.log("Frontend: Searching cars with URL:", url); // Debugging
            const response = await axios.get(url);
            setCars(response.data);
            if (response.data.length === 0) {
                setMessage('No cars found matching your criteria.');
            } else {
                setMessage(''); // Clear message if cars are found
            }
        } catch (err) {
            console.error('Error fetching cars:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Failed to fetch cars. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch initial cars on component mount
    useEffect(() => {
        fetchCarsData({
            pickupLocation,
            pickupDate,
            returnDate,
            type: carType,
            seats
        });
    }, []);

    // Handler for the car search form submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchCarsData({
            pickupLocation,
            pickupDate,
            returnDate,
            type: carType,
            seats
        });
    };

    // Handler for creating dummy cars (for testing purposes, POST request)
    const handleCreateDummyCar = async () => {
        setError('');
        setMessage('');
        try {
            const uniqueLicensePlate = `LP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

            const dummyCarData = {
                make: ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes'][Math.floor(Math.random() * 5)],
                model: ['Corolla', 'Civic', 'Mustang', 'X5', 'C-Class'][Math.floor(Math.random() * 5)],
                // year is now optional in backend, but frontend can still send it
                year: Math.floor(Math.random() * 5) + 2020, // Random year from 2020-2024
                type: ['Sedan', 'SUV', 'Compact', 'Luxury', 'Hatchback'][Math.floor(Math.random() * 5)],
                seats: Math.floor(Math.random() * 3) + 2, // Random seats from 2-4
                pricePerDay: Math.floor(Math.random() * 50) + 30, // Random price from $30-$79
                location: ['New York', 'Los Angeles', 'Miami', 'Chicago', 'Houston', 'Bhubaneswar Airport'][Math.floor(Math.random() * 6)],
                // images is now optional in backend, but frontend can still send it
                images: [
                    'https://via.placeholder.com/300x200?text=Car+Front',
                    'https://via.placeholder.com/300x200?text=Car+Side',
                ],
                availableCount: Math.floor(Math.random() * 3) + 1, // Random availability from 1-3
                licensePlate: uniqueLicensePlate,
                // description is now optional
                description: 'A randomly generated car for testing purposes.'
            };

            console.log("Frontend: Creating dummy car with data:", dummyCarData); // Debugging
            const response = await axios.post(`${API_BASE_URL}/cars`, dummyCarData);
            setMessage(response.data.message || 'Dummy car created successfully!');
            console.log('Dummy car created:', response.data.car);
            fetchCarsData(); // Refresh the car list after creating a new car
        } catch (err) {
            console.error('Error creating dummy car:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Failed to create dummy car. Please try again.');
        }
    };

    // Function to open the rental booking modal when a car is selected
    const openRentalModal = (car) => {
        setSelectedCar(car);
        setShowRentalModal(true);
    };

    // Function to close the rental booking modal and reset form-specific state
    const closeRentalModal = () => {
        setShowRentalModal(false);
        setSelectedCar(null);
        setRentalCustomerName(localStorage.getItem('userName') || '');
    };

    // Handler for submitting the rental booking form
    const handleRentalSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            if (!selectedCar) {
                setError('No car selected for rental.');
                return;
            }

            const pDate = new Date(pickupDate);
            const rDate = new Date(returnDate);

            const todayNormalized = new Date();
            todayNormalized.setHours(0, 0, 0, 0);

            if (isNaN(pDate.getTime()) || pDate < todayNormalized) {
                setError('Pickup date cannot be in the past or invalid.');
                return;
            }
            if (isNaN(rDate.getTime()) || rDate <= pDate) {
                setError('Return date must be strictly after pickup date.');
                return;
            }

            if (selectedCar.availableCount <= 0) {
                setError('This car is currently unavailable for booking.');
                return;
            }

            // Show payment modal instead of directly booking
            setShowPayment(true);
        } catch (err) {
            console.error('Error in rental validation:', err);
            setError('Failed to validate rental parameters.');
        }
    };

    const handlePaymentConfirm = async () => {
        setShowPayment(false);
        try {
            const rentalData = {
                carId: selectedCar._id,
                customerName: rentalCustomerName,
                customerEmail: rentalCustomerEmail,
                pickupLocation: selectedCar.location,
                returnLocation: selectedCar.location, 
                pickupDate,
                returnDate,
            };

            const response = await axios.post(`${API_BASE_URL}/rentals`, rentalData);
            setMessage(response.data.message || 'Car rented successfully! A confirmation email has been sent.');
            setBookedCar(selectedCar);
            closeRentalModal();
            fetchCarsData(); 
            setRefreshCarRentals(prev => prev + 1);
        } catch (err) {
            console.error('Error renting car:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Failed to rent car. Please try again.');
        }
    };

    // Helper to calculate total price for display in the modal
    const calculateTotalPrice = () => {
        if (!selectedCar || !pickupDate || !returnDate) return '0.00';
        const pDate = new Date(pickupDate);
        const rDate = new Date(returnDate);

        if (isNaN(pDate.getTime()) || isNaN(rDate.getTime()) || rDate <= pDate) {
            return '0.00'; // Invalid dates or return date before/same as pickup
        }

        const timeDifference = rDate.getTime() - pDate.getTime();
        const days = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Calculate days
        return (days * selectedCar.pricePerDay).toFixed(2);
    };

    // Get today's date in YYYY-MM-DD format for min attribute on date inputs
    const todayMinDate = new Date().toISOString().split('T')[0];

    return (
        <div className="premium-container">
            <Link to="/home" className="back-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Home
            </Link>

            <h2 className="premium-title float-anim"><span className="gradient-text">Car</span> Rentals</h2>

            {/* Message and Error Displays */}
            {message && <p style={{color: '#00d2d3', textAlign: 'center', marginBottom: '1rem'}} className="animate-fade-in-up">{message}</p>}
            {error && <p style={{color: '#ff7675', textAlign: 'center', marginBottom: '1rem'}} className="animate-fade-in-up">{error}</p>}

            {/* Car Search Form */}
            <form onSubmit={handleSearchSubmit} className="glass-panel" style={{padding: '30px', marginBottom: '40px'}}>
                <div className="premium-form-grid">
                    <div className="premium-input-group">
                        <label htmlFor="pickupLocation" className="premium-label">Pickup Location</label>
                        <input
                            type="text"
                            id="pickupLocation"
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            className="premium-input"
                            placeholder="e.g., New York"
                        />
                    </div>
                </div>

                <div className="premium-input-group" style={{marginTop: '20px'}}>
                    <label className="premium-label">Car Category</label>
                    <div className="category-pills">
                        {CarCategories.map(cat => (
                            <div 
                                key={cat.id} 
                                className={`category-pill ${carType === cat.id ? 'active' : ''}`}
                                onClick={() => setCarType(cat.id)}
                            >
                                <span>{cat.icon}</span> {cat.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="premium-form-grid" style={{marginTop: '20px'}}>
                    <div className="premium-input-group">
                        <label htmlFor="pickupDate" className="premium-label">Pickup Date</label>
                        <input
                            type="date"
                            id="pickupDate"
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                            className="premium-input"
                            min={todayMinDate}
                        />
                    </div>
                    <div className="premium-input-group">
                        <label htmlFor="returnDate" className="premium-label">Return Date</label>
                        <input
                            type="date"
                            id="returnDate"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            className="premium-input"
                            min={pickupDate || todayMinDate}
                        />
                    </div>

                    <div className="premium-input-group">
                        <label htmlFor="seats" className="premium-label">Min Seats</label>
                        <input
                            type="number"
                            id="seats"
                            value={seats}
                            onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
                            min="1"
                            className="premium-input"
                        />
                    </div>
                </div>

                <button type="submit" className="premium-btn" style={{width: '100%', marginTop: '20px'}}>
                    {loading ? 'Searching...' : 'Search Cars'}
                </button>
            </form>

            {/* Button to create dummy cars */}
            <button onClick={handleCreateDummyCar} className="car-rental-button create-dummy">
                Create Dummy Car (for testing)
            </button>

            {/* Display Available Cars */}
            <h3 className="gradient-text" style={{fontSize: '2rem', margin: '40px 0 20px'}}>Available Cars</h3>
            {loading ? (
                <div className="premium-card-grid">
                    <div className="skeleton-card" style={{height: '350px'}} />
                    <div className="skeleton-card" style={{height: '350px', animationDelay: '0.2s'}} />
                    <div className="skeleton-card" style={{height: '350px', animationDelay: '0.4s'}} />
                </div>
            ) : (
                <div className="premium-card-grid">
                    {cars.map((car, idx) => (
                        <div key={car._id} className="glass-panel premium-item-card animate-fade-in-up" style={{animationDelay: `${idx * 0.1}s`}}>
                            {car.images && car.images.length > 0 && (
                                <img src={car.images[0]} alt={`${car.make} ${car.model}`} style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px'}} />
                            )}
                            {/* Display car make, model, and year */}
                            <h4 style={{margin: '0 0 10px 0', fontSize: '1.2rem'}}>{car.make || 'N/A Make'} {car.model || 'N/A Model'} <span style={{fontSize: '0.8rem', opacity: 0.7}}>• {car.year || 'N/A Year'}</span></h4>
                            {/* Display license plate */}
                            <p>License Plate: {car.licensePlate || 'N/A'}</p>
                            {/* Display car type and seats */}
                            <p>Type: {car.type || 'N/A'}, Seats: {car.seats || 'N/A'}</p>
                            {/* Display location */}
                            <p>Location: {car.location || 'N/A'}</p>
                            {/* Display price per day */}
                            <p className="car-rental-price">Price/Day: ${car.pricePerDay ? car.pricePerDay.toFixed(2) : 'N/A'}</p>
                            {/* Display available count */}
                            <p style={{color: car.availableCount > 0 ? '#00d2d3' : '#ff7675'}}>Available: {car.availableCount > 0 ? `${car.availableCount} in stock` : 'Out of Stock'}</p>

                            <button
                                onClick={() => openRentalModal(car)}
                                className="premium-btn"
                                style={{marginTop: '15px', width: '100%'}}
                                disabled={car.availableCount <= 0}
                            >
                                {car.availableCount > 0 ? 'Rent Now' : 'Unavailable'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for renting the selected car */}
            {showRentalModal && selectedCar && !showPayment && (
                <div className="payment-modal-overlay">
                    <div className="payment-modal-content" style={{textAlign: 'left'}}>
                        <h3 className="gradient-text" style={{fontSize: '1.5rem', marginBottom: '20px'}}>Rent {selectedCar.make} {selectedCar.model}</h3>
                        <p style={{marginBottom: '5px'}}><strong>Pickup:</strong> {pickupLocation}</p>
                        <p style={{marginBottom: '5px'}}><strong>Dates:</strong> {pickupDate} to {returnDate}</p>
                        <p style={{fontSize: '1.2rem', fontWeight: 'bold', margin: '15px 0'}}>Total Cost: ${calculateTotalPrice()}</p>
                        
                        <form onSubmit={handleRentalSubmit} className="premium-form-grid" style={{marginTop: '20px'}}>
                            <div className="premium-input-group" style={{gridColumn: '1 / -1'}}>
                                <label className="premium-label">Full Name</label>
                                <input
                                    type="text"
                                    value={rentalCustomerName}
                                    onChange={(e) => setRentalCustomerName(e.target.value)}
                                    required
                                    className="premium-input"
                                />
                            </div>
                            <div style={{gridColumn: '1 / -1', display: 'flex', gap: '15px', marginTop: '10px'}}>
                                <button type="submit" className="premium-btn" style={{flex: 1}}>Proceed to Payment</button>
                                <button type="button" onClick={closeRentalModal} className="premium-btn premium-btn-secondary" style={{flex: 1}}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showPayment && selectedCar && (
                <PaymentModal 
                    amount={calculateTotalPrice()} 
                    onConfirm={handlePaymentConfirm} 
                    onCancel={() => setShowPayment(false)} 
                />
            )}

            {bookedCar && (
                <div className="glass-panel" style={{padding: '30px', marginTop: '40px'}}>
                    <h3 className="gradient-text" style={{fontSize: '1.5rem', marginBottom: '20px'}}>Live Car Tracking: {bookedCar.licensePlate}</h3>
                    <LiveTrackingMap type="car" startCoords={[40.7128, -74.0060]} endCoords={null} height="400px" />
                </div>
            )}

            {/* Car Rentals List - Rendered below the car search/rental section */}
            <CarRentalsList refreshTrigger={refreshCarRentals} />
        </div>
    );
};

export default CarRentalPage;