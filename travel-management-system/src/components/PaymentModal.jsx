import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './PaymentModal.css';

const PaymentModal = ({ amount, onConfirm, onCancel }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [paymentVerified, setPaymentVerified] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

    useEffect(() => {
        if (timeLeft <= 0) {
            onCancel(); // Automatically cancel checkout when timer naturally hits zero
            alert('Your booking session has expired.');
            return;
        }
        if (paymentVerified) return; // Stop timer if paid successfully
        
        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, paymentVerified, onCancel]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleSubmit = (e) => {
        if(e) e.preventDefault();
        setError('');

        if (paymentMethod === 'card') {
            if (cardNumber.length < 16) {
                setError('Please enter a valid 16-digit card number.');
                return;
            }
        }

        setProcessing(true);
        // Simulate a payment API call or wait for webhook for UPI
        setTimeout(() => {
            setProcessing(false);
            setPaymentVerified(true);
            setTimeout(() => onConfirm(), 1500); // Trigger success callback after showing success check
        }, 2000);
    };

    const upiLink = `upi://pay?pa=travelmerchant@upi&pn=TravelSystem&am=${amount}&cu=INR`;

    return (
        <div className="payment-modal-overlay">
            <div className="payment-modal-content">
                <div style={{background: 'rgba(255, 118, 117, 0.1)', color: '#ff7675', padding: '10px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Booking expires in {formatTime(timeLeft)}
                </div>

                <h3 className="payment-title">Secure Checkout</h3>
                <p className="payment-amount">Total to pay: <strong>${amount}</strong></p>

                <div className="payment-methods">
                    <button 
                        className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('card')}
                        type="button"
                    >
                        Credit/Debit Card
                    </button>
                    <button 
                        className={`method-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('upi')}
                        type="button"
                    >
                        UPI / QR Code
                    </button>
                </div>

                {error && <p className="payment-error">{error}</p>}

                {paymentVerified ? (
                    <div className="payment-success">
                        <div className="success-icon">✓</div>
                        <p>Payment Successful!</p>
                        <p style={{ fontSize: '0.9em', color: '#666' }}>Redirecting...</p>
                    </div>
                ) : paymentMethod === 'card' ? (
                    <form onSubmit={handleSubmit} className="payment-form">
                        <div className="payment-input-group">
                            <label>Name on Card</label>
                            <input
                                type="text"
                                value={nameOnCard}
                                onChange={(e) => setNameOnCard(e.target.value)}
                                required
                                placeholder="John Doe"
                                disabled={processing}
                            />
                        </div>
                        
                        <div className="payment-input-group">
                            <label>Card Number</label>
                            <input
                                type="text"
                                maxLength="16"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                                required
                                placeholder="1234 5678 1234 5678"
                                disabled={processing}
                            />
                        </div>

                        <div className="payment-row">
                            <div className="payment-input-group half">
                                <label>Expiry Date</label>
                                <input
                                    type="text"
                                    maxLength="5"
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    required
                                    placeholder="MM/YY"
                                    disabled={processing}
                                />
                            </div>
                            <div className="payment-input-group half">
                                <label>CVV</label>
                                <input
                                    type="password"
                                    maxLength="3"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                    required
                                    placeholder="123"
                                    disabled={processing}
                                />
                            </div>
                        </div>
                        <div className="payment-actions">
                            <button type="button" className="btn-cancel" onClick={onCancel} disabled={processing}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-pay" disabled={processing}>
                                {processing ? 'Processing...' : `Pay $${amount}`}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="payment-form upi-section">
                        <div className="qr-container" style={{ textAlign: 'center', padding: '15px' }}>
                            <p style={{ marginBottom: '15px', color: '#333' }}>Scan via <b>Google Pay</b> or <b>PhonePe</b></p>
                            <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '8px', border: '1px solid #eee' }}>
                                <QRCodeSVG value={upiLink} size={150} />
                            </div>
                            <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>Amount: <b>${amount} INR</b></p>
                        </div>
                        <div className="payment-actions">
                            <button type="button" className="btn-cancel" onClick={onCancel} disabled={processing}>
                                Cancel
                            </button>
                            <button type="button" onClick={() => handleSubmit()} className="btn-pay" disabled={processing}>
                                {processing ? 'Verifying payment...' : `I have paid $${amount}`}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;
