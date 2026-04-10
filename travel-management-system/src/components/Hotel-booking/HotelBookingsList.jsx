// D:\travel-website\travel-management-system\src\components\Hotel-booking\HotelBookingsList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HotelBookingsList = ({ refreshTrigger }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'https://voyago-trvel-1.onrender.com'}/api`;

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/hotel-bookings`);
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching hotel bookings:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to fetch hotel bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Hotel Bookings</h2>
      {loading && <p>Loading bookings...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {bookings.length === 0 && !loading && !error && <p>No hotel bookings found yet.</p>}
      <div style={styles.bookingList}>
        {bookings.map(booking => (
          <div key={booking._id} style={styles.bookingCard}>
            <p><strong>Booking ID:</strong> {booking._id}</p>
            <p><strong>Hotel:</strong> {booking.hotel ? booking.hotel.name : 'N/A'}</p>
            <p><strong>Location:</strong> {booking.hotel ? booking.hotel.location : 'N/A'}</p>
            <p><strong>Guest:</strong> {booking.guestName} ({booking.guestEmail})</p>
            <p><strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
            <p><strong>Rooms:</strong> {booking.numberOfRooms}</p>
            <p><strong>Guests:</strong> {booking.numberOfGuests}</p>
            <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <p><strong>Booked On:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
    container: {
      maxWidth: '800px',
      margin: '50px auto',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
      backgroundColor: '#282c34',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      marginTop: '30px',
    },
    title: {
      color: '#61dafb',
      marginBottom: '20px',
    },
    error: {
      color: '#f44336',
      marginBottom: '15px',
      fontSize: '0.9em',
    },
    bookingList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        justifyContent: 'center',
        marginTop: '20px',
    },
    bookingCard: {
        backgroundColor: '#3a3f47',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
        textAlign: 'left',
        borderLeft: '5px solid #61dafb',
    }
};

export default HotelBookingsList;