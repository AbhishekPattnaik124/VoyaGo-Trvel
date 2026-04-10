import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CarRentalsList = ({ refreshTrigger }) => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

    const fetchRentals = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${API_BASE_URL}/rentals`);
            setRentals(response.data);
        } catch (err) {
            console.error('Error fetching rentals:', err);
            setError('Failed to fetch car rentals.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentals();
    }, [refreshTrigger]);

    return (
        <div className="car-rental-card" style={{gridColumn: '1 / -1', marginTop: '30px', width: '100%', maxWidth: '900px', margin: '30px auto'}}>
            <h3 className="car-rental-results-title">Your Car Rentals</h3>
            {loading && <p>Loading rentals...</p>}
            {error && <p className="car-rental-error">{error}</p>}
            {rentals.length === 0 && !loading && !error && <p>No car rentals found yet.</p>}
            <div className="car-rental-list" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px'}}>
                {rentals.map(rental => (
                    <div key={rental._id} className="car-rental-card" style={{border: '1px solid rgba(97, 218, 251, 0.3)'}}>
                        <p><strong>Booking ID:</strong> {rental._id}</p>
                        <p><strong>Car:</strong> {rental.car ? `${rental.car.make} ${rental.car.model}` : 'N/A'}</p>
                        <p><strong>Guest:</strong> {rental.customerName} ({rental.customerEmail})</p>
                        <p><strong>Pickup:</strong> {new Date(rental.pickupDate).toLocaleDateString()}</p>
                        <p><strong>Return:</strong> {new Date(rental.returnDate).toLocaleDateString()}</p>
                        <p><strong>Total Cost:</strong> ${rental.totalCost || 'N/A'}</p>
                        <p><strong>Status:</strong> {rental.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarRentalsList;
