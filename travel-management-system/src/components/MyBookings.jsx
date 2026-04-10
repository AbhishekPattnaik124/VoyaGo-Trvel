import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTrash, FaDownload, FaCar, FaHotel, FaPlane, FaTrain } from 'react-icons/fa';
import './MyBookings.css'; // Let's use custom CSS

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

const MyBookings = () => {
    const [hotelBookings, setHotelBookings] = useState([]);
    const [carRentals, setCarRentals] = useState([]);
    const [flightBookings, setFlightBookings] = useState([]);
    const [trainBookings, setTrainBookings] = useState([]);
    const [busBookings, setBusBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userEmail = localStorage.getItem('userEmail');

    const navigate = useNavigate();

    const fetchAllBookings = async () => {
        setLoading(true);
        setError('');
        try {
            // Fetch Hotels
            const hotelRes = await axios.get(`${API_BASE_URL}/hotel-bookings`);
            // Filter by current user email if present
            const myHotels = userEmail 
                ? hotelRes.data.filter(b => b.guestEmail === userEmail) 
                : hotelRes.data;
            setHotelBookings(myHotels);

            // Fetch Cars
            const carRes = await axios.get(`${API_BASE_URL}/rentals`);
            const myCars = userEmail 
                ? carRes.data.filter(r => r.customerEmail === userEmail) 
                : carRes.data;
            setCarRentals(myCars);

            // Fetch Flights
            const flightRes = await axios.get(`${API_BASE_URL}/flights/bookings`);
            const myFlights = userEmail 
                ? flightRes.data.filter(f => f.email === userEmail) 
                : flightRes.data;
            setFlightBookings(myFlights);

            // Fetch Trains
            const trainRes = await axios.get(`${API_BASE_URL}/trains/reservations`);
            const myTrains = userEmail 
                ? trainRes.data.filter(t => t.email === userEmail) 
                : trainRes.data;
            setTrainBookings(myTrains);

            // Fetch Buses
            const busRes = await axios.get(`${API_BASE_URL}/bus-reservations`);
            const myBuses = userEmail
                ? busRes.data.filter(b => b.email === userEmail || b.user === userEmail)
                : busRes.data;
            setBusBookings(myBuses);

        } catch (err) {
            console.error("Error fetching bookings:", err);
            setError("Failed to load your bookings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userEmail) {
            navigate('/login');
        } else {
            fetchAllBookings();
        }
    }, [userEmail, navigate]);

    const handleCancelHotel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this hotel booking?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/hotel-bookings/${id}`);
            fetchAllBookings(); // Refresh
        } catch (err) {
            alert('Failed to cancel hotel booking.');
        }
    };

    const handleCancelCar = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this car rental?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/rentals/${id}`);
            fetchAllBookings(); // Refresh
        } catch (err) {
            alert('Failed to cancel car rental.');
        }
    };

    const handleCancelFlight = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this flight booking?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/flights/bookings/${id}`);
            fetchAllBookings(); // Refresh
        } catch (err) {
            alert('Failed to cancel flight.');
        }
    };

    const handleCancelTrain = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this train reservation?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/trains/reservations/${id}`);
            fetchAllBookings(); // Refresh
        } catch (err) {
            alert('Failed to cancel train.');
        }
    };

    const handleCancelBus = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this bus booking?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/bus-reservations/${id}`);
            fetchAllBookings(); // Refresh
        } catch (err) {
            alert('Failed to cancel bus booking.');
        }
    };

    // Print logic
    const handleDownloadTicket = (type, item) => {
        // Temporarily hide other elements using a special print class
        const originalTitle = document.title;
        document.title = `${type}_Ticket_${item._id}`;
        
        // Let CSS handle the visibility of the "print-ticket-zone"
        // We will append a hidden ticket block that becomes visible on print
        const ticketDiv = document.createElement('div');
        ticketDiv.className = 'print-only-ticket';
        
        let content = '';
        if (type === 'Hotel') {
            content = `
                <div class="ticket-wrapper">
                    <h1 class="ticket-header">Premium Travels - Hotel Booking</h1>
                    <div class="ticket-body">
                        <p><strong>Booking ID:</strong> ${item._id}</p>
                        <p><strong>Guest Name:</strong> ${item.guestName}</p>
                        <p><strong>Hotel:</strong> ${item.hotel?.name || 'N/A'}</p>
                        <p><strong>Location:</strong> ${item.hotel?.location || 'N/A'}</p>
                        <p><strong>Check-in:</strong> ${new Date(item.checkInDate).toLocaleDateString()}</p>
                        <p><strong>Check-out:</strong> ${new Date(item.checkOutDate).toLocaleDateString()}</p>
                        <p><strong>Rooms:</strong> ${item.numberOfRooms}</p>
                        <p><strong>Total Price:</strong> $${item.totalPrice}</p>
                        <p><strong>Status:</strong> ${item.status || 'Confirmed'}</p>
                    </div>
                    <div class="ticket-qr">Valid E-Ticket</div>
                </div>
            `;
        } else if (type === 'Flight') {
            content = `
                <div class="ticket-wrapper">
                    <h1 class="ticket-header">Premium Travels - Flight Ticket</h1>
                    <div class="ticket-body">
                        <p><strong>Booking ID:</strong> ${item._id}</p>
                        <p><strong>Passenger Name:</strong> ${item.passengerName}</p>
                        <p><strong>Flight Number:</strong> ${item.flightNumber}</p>
                        <p><strong>Routing:</strong> ${item.origin} &rarr; ${item.destination}</p>
                        <p><strong>Departure:</strong> ${new Date(item.departureTime || item.bookingDate).toLocaleString()}</p>
                        <p><strong>Total Price:</strong> $${item.price}</p>
                        <p><strong>Status:</strong> Confirmed</p>
                    </div>
                    <div class="ticket-qr">Valid Boarding Pass</div>
                </div>
            `;
        } else if (type === 'Train') {
            content = `
                <div class="ticket-wrapper">
                    <h1 class="ticket-header">Premium Travels - Train Ticket</h1>
                    <div class="ticket-body">
                        <p><strong>PNR Number:</strong> ${item.pnrNumber}</p>
                        <p><strong>Passenger Name:</strong> ${item.passengerName}</p>
                        <p><strong>Train:</strong> ${item.trainName} (${item.trainNumber})</p>
                        <p><strong>Routing:</strong> ${item.fromStation} &rarr; ${item.toStation}</p>
                        <p><strong>Departure:</strong> ${item.departureTime}</p>
                        <p><strong>Total Price:</strong> $${item.totalPrice}</p>
                        <p><strong>Status:</strong> Confirmed</p>
                    </div>
                    <div class="ticket-qr">Valid E-Ticket</div>
                </div>
            `;
        } else if (type === 'Bus') {
            content = `
                <div class="ticket-wrapper">
                    <h1 class="ticket-header">Premium Travels - Bus Ticket</h1>
                    <div class="ticket-body">
                        <p><strong>Booking ID:</strong> ${item.bookingId || item._id}</p>
                        <p><strong>User:</strong> ${item.user}</p>
                        <p><strong>Operator:</strong> ${item.operator || 'Premium Bus'}</p>
                        <p><strong>Bus Number:</strong> ${item.busNumber || item.bus?.busNumber || 'N/A'}</p>
                        <p><strong>Seat Number:</strong> ${item.seatNumber}</p>
                        <p><strong>Date Reserved:</strong> ${new Date(item.reservationDate).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> ${item.status || 'Confirmed'}</p>
                    </div>
                    <div class="ticket-qr">Valid E-Ticket</div>
                </div>
            `;
        } else {
            content = `
                <div class="ticket-wrapper">
                    <h1 class="ticket-header">Premium Travels - Car Rental</h1>
                    <div class="ticket-body">
                        <p><strong>Booking ID:</strong> ${item._id}</p>
                        <p><strong>Customer Name:</strong> ${item.customerName}</p>
                        <p><strong>Car:</strong> ${item.carId?.make} ${item.carId?.model}</p>
                        <p><strong>License Plate:</strong> ${item.carId?.licensePlate}</p>
                        <p><strong>Pickup Location:</strong> ${item.pickupLocation}</p>
                        <p><strong>Pickup Date:</strong> ${new Date(item.pickupDate).toLocaleDateString()}</p>
                        <p><strong>Return Date:</strong> ${new Date(item.returnDate).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> ${item.status || 'Confirmed'}</p>
                    </div>
                    <div class="ticket-qr">Valid E-Ticket</div>
                </div>
            `;
        }

        ticketDiv.innerHTML = content;
        document.body.appendChild(ticketDiv);
        
        window.print();
        
        // Cleanup
        document.body.removeChild(ticketDiv);
        document.title = originalTitle;
    };

    if (loading) return <div className="loading-screen">Loading your bookings...</div>;

    const totalBookings = hotelBookings.length + carRentals.length + flightBookings.length + trainBookings.length + busBookings.length;

    return (
        <div className="my-bookings-page no-print">
            <nav className="navbar-glass">
                <Link to="/home" className="nav-brand">
                    <span className="gradient-text">My</span> Bookings
                </Link>
                <Link to="/home" className="back-btn"><FaHome /> Home</Link>
            </nav>

            <div className="bookings-container">
                <div className="bookings-header">
                    <h1 className="hero-title">Manage Your Trips</h1>
                    <p>You have {totalBookings} active bookings.</p>
                </div>

                {error && <p className="error-banner">{error}</p>}

                {/* Hotels Section */}
                <div className="booking-section">
                    <h2 className="section-title"><FaHotel /> Hotel Bookings</h2>
                    {hotelBookings.length === 0 ? (
                        <p className="empty-state">No hotel bookings found.</p>
                    ) : (
                        <div className="booking-grid">
                            {hotelBookings.map(b => (
                                <div className="booking-card glass-panel" key={b._id}>
                                    <div className="card-top">
                                        <h3>{b.hotel?.name || 'Hotel Booking'}</h3>
                                        <span className="status-badge">Confirmed</span>
                                    </div>
                                    <p><strong>Dates:</strong> {new Date(b.checkInDate).toLocaleDateString()} - {new Date(b.checkOutDate).toLocaleDateString()}</p>
                                    <p><strong>Location:</strong> {b.hotel?.location || 'N/A'}</p>
                                    <p><strong>Rooms:</strong> {b.numberOfRooms} | <strong>Guests:</strong> {b.numberOfGuests}</p>
                                    <h4 className="price-tag">${b.totalPrice}</h4>
                                    
                                    <div className="card-actions">
                                        <button className="action-btn download" onClick={() => handleDownloadTicket('Hotel', b)}>
                                            <FaDownload /> Ticket (PDF)
                                        </button>
                                        <button className="action-btn cancel" onClick={() => handleCancelHotel(b._id)}>
                                            <FaTrash /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cars Section */}
                <div className="booking-section">
                    <h2 className="section-title"><FaCar /> Car Rentals</h2>
                    {carRentals.length === 0 ? (
                        <p className="empty-state">No car rentals found.</p>
                    ) : (
                        <div className="booking-grid">
                            {carRentals.map(r => (
                                <div className="booking-card glass-panel" key={r._id}>
                                    <div className="card-top">
                                        <h3>{r.carId?.make} {r.carId?.model}</h3>
                                        <span className="status-badge">Confirmed</span>
                                    </div>
                                    <p><strong>Dates:</strong> {new Date(r.pickupDate).toLocaleDateString()} - {new Date(r.returnDate).toLocaleDateString()}</p>
                                    <p><strong>Pickup:</strong> {r.pickupLocation}</p>
                                    <p><strong>Plate:</strong> {r.carId?.licensePlate}</p>
                                    
                                    <div className="card-actions">
                                        <button className="action-btn download" onClick={() => handleDownloadTicket('Car', r)}>
                                            <FaDownload /> Ticket (PDF)
                                        </button>
                                        <button className="action-btn cancel" onClick={() => handleCancelCar(r._id)}>
                                            <FaTrash /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Flights Section */}
                <div className="booking-section">
                    <h2 className="section-title"><FaPlane /> Flight Tickets</h2>
                    {flightBookings.length === 0 ? (
                        <p className="empty-state">No flight bookings found.</p>
                    ) : (
                        <div className="booking-grid">
                            {flightBookings.map(f => (
                                <div className="booking-card glass-panel" key={f._id}>
                                    <div className="card-top">
                                        <h3>Flight {f.flightNumber}</h3>
                                        <span className="status-badge">Confirmed</span>
                                    </div>
                                    <p><strong>Routing:</strong> {f.origin} to {f.destination}</p>
                                    <p><strong>Departure:</strong> {new Date(f.departureTime || f.bookingDate).toLocaleString()}</p>
                                    <p><strong>Passenger:</strong> {f.passengerName}</p>
                                    <h4 className="price-tag">${f.price}</h4>
                                    
                                    <div className="card-actions">
                                        <button className="action-btn download" onClick={() => handleDownloadTicket('Flight', f)}>
                                            <FaDownload /> Ticket (PDF)
                                        </button>
                                        <button className="action-btn cancel" onClick={() => handleCancelFlight(f._id)}>
                                            <FaTrash /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Trains Section */}
                <div className="booking-section">
                    <h2 className="section-title"><FaTrain /> Train Tickets</h2>
                    {trainBookings.length === 0 ? (
                        <p className="empty-state">No train reservations found.</p>
                    ) : (
                        <div className="booking-grid">
                            {trainBookings.map(t => (
                                <div className="booking-card glass-panel" key={t._id}>
                                    <div className="card-top">
                                        <h3>{t.trainName} ({t.trainNumber})</h3>
                                        <span className="status-badge">Confirmed</span>
                                    </div>
                                    <p><strong>Routing:</strong> {t.fromStation} to {t.toStation}</p>
                                    <p><strong>Departure:</strong> {t.departureTime}</p>
                                    <p><strong>PNR:</strong> {t.pnrNumber}</p>
                                    <h4 className="price-tag">${t.totalPrice}</h4>
                                    
                                    <div className="card-actions">
                                        <button className="action-btn download" onClick={() => handleDownloadTicket('Train', t)}>
                                            <FaDownload /> Ticket (PDF)
                                        </button>
                                        <button className="action-btn cancel" onClick={() => handleCancelTrain(t._id)}>
                                            <FaTrash /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Buses Section */}
                <div className="booking-section">
                    <h2 className="section-title"><FaCar /> Bus Tickets</h2>
                    {busBookings.length === 0 ? (
                        <p className="empty-state">No bus bookings found.</p>
                    ) : (
                        <div className="booking-grid">
                            {busBookings.map(b => (
                                <div className="booking-card glass-panel" key={b._id}>
                                    <div className="card-top">
                                        <h3>{b.operator || 'Bus Booking'}</h3>
                                        <span className="status-badge">Confirmed</span>
                                    </div>
                                    <p><strong>Bus No:</strong> {b.busNumber || b.bus?.busNumber || 'N/A'}</p>
                                    <p><strong>Seat:</strong> {b.seatNumber}</p>
                                    <p><strong>Date:</strong> {new Date(b.reservationDate).toLocaleDateString()}</p>
                                    <p><strong>Booking ID:</strong> {b.bookingId || 'N/A'}</p>
                                    
                                    <div className="card-actions">
                                        <button className="action-btn download" onClick={() => handleDownloadTicket('Bus', b)}>
                                            <FaDownload /> Ticket (PDF)
                                        </button>
                                        <button className="action-btn cancel" onClick={() => handleCancelBus(b._id)}>
                                            <FaTrash /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MyBookings;
