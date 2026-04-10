import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaUserCircle, FaHotel, FaCar, FaSuitcaseRolling, FaCamera, FaTimes } from 'react-icons/fa';
import './ReviewsRatings.css';

// Initial Mock Reviews Data
const initialReviews = {
    hotels: [
        { id: 'h1', author: 'Emily Clark', avatar: 'https://ui-avatars.com/api/?name=Emily+C&background=random', rating: 5, date: '2026-03-25', title: 'Grand Hyatt Tokyo', text: 'Absolutely mesmerizing staying here! The views from the 40th floor over Tokyo were unmatched. Highly recommend to anyone.', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=600' },
        { id: 'h2', author: 'Mark Johnson', avatar: 'https://ui-avatars.com/api/?name=Mark+J&background=random', rating: 4, date: '2026-03-20', title: 'Hilton Paris Opera', text: 'Stunning architecture. Room was slightly small but the service was completely world-class.', image: '' },
    ],
    drivers: [
        { id: 'd1', author: 'Sarah Connor', avatar: 'https://ui-avatars.com/api/?name=Sarah+C&background=random', rating: 5, date: '2026-03-28', title: 'Driver: Michael T.', text: 'Michael was an absolute professional. He knew all the shortcuts in NYC and even gave us some fantastic dining recommendations!', image: '' },
        { id: 'd2', author: 'David Smith', avatar: 'https://ui-avatars.com/api/?name=David+S&background=random', rating: 3, date: '2026-03-15', title: 'Driver: John D.', text: 'Car was clean and he was punctual, but drove a bit too fast for my liking. Still decent overall.', image: '' },
    ],
    trips: [
        { id: 't1', author: 'Jessica Alba', avatar: 'https://ui-avatars.com/api/?name=Jessica+A&background=random', rating: 5, date: '2026-04-01', title: 'Swiss Alps Adventure', text: 'This bundled package was the best decision of my life. Everything from the flight to the bus and the snowy hotel was perfectly coordinated. Look at this view!', image: 'https://images.unsplash.com/photo-1549880181-56a44cf4a9a1?auto=format&fit=crop&q=80&w=600' },
        { id: 't2', author: 'Alex Chen', avatar: 'https://ui-avatars.com/api/?name=Alex+C&background=random', rating: 5, date: '2026-03-10', title: 'Tokyo Extravaganza', text: 'Incredible setup. Having my flights, luxury hotel, and bullet train arranged in one click was a lifesaver. Will definitely use VoyaGo again.', image: '' }
    ]
};

const StarRating = ({ rating, setRating, interactive = false }) => {
    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
                <span 
                    key={star} 
                    className={`star ${interactive ? 'interactive' : ''} ${star <= rating ? 'filled' : ''}`}
                    onClick={() => interactive && setRating(star)}
                >
                    {star <= rating ? <FaStar /> : <FaRegStar />}
                </span>
            ))}
        </div>
    );
};

const ReviewsRatings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('hotels');
    const [reviewsData, setReviewsData] = useState(() => {
        const saved = localStorage.getItem('communityReviews');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return initialReviews;
            }
        }
        return initialReviews;
    });

    // Save reviews to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('communityReviews', JSON.stringify(reviewsData));
    }, [reviewsData]);
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [newReview, setNewReview] = useState({
        category: 'hotels', author: localStorage.getItem('userName') || '', title: '', text: '', rating: 5, image: ''
    });

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
    };

    const handleModalSubmit = (e) => {
        e.preventDefault();
        if (!newReview.author || !newReview.title || !newReview.text) return;

        const generatedReview = {
            id: Date.now().toString(),
            author: newReview.author,
            avatar: `https://ui-avatars.com/api/?name=${newReview.author.replace(' ', '+')}&background=random`,
            rating: newReview.rating,
            date: new Date().toISOString().split('T')[0],
            title: newReview.title,
            text: newReview.text,
            image: newReview.image
        };

        setReviewsData(prev => ({
            ...prev,
            [newReview.category]: [generatedReview, ...prev[newReview.category]]
        }));

        setShowModal(false);
        setNewReview({ category: 'hotels', author: localStorage.getItem('userName') || '', title: '', text: '', rating: 5, image: '' });
        // Switch to the category the user just posted to
        setActiveTab(newReview.category);
    };

    const getTabIcon = (tabId) => {
        if (tabId === 'hotels') return <FaHotel />;
        if (tabId === 'drivers') return <FaCar />;
        if (tabId === 'trips') return <FaSuitcaseRolling />;
    };

    return (
        <div className="reviews-page">
            <nav className="navbar-glass scrolled">
                <div className="nav-brand" onClick={() => navigate('/home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6c5ce7, #00d2d3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1rem', color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>V</div>
                    <span className="gradient-text" style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.5px' }}>VoyaGo™</span>
                </div>
            </nav>

            <div className="reviews-container">
                <div className="reviews-header text-center">
                    <h1 className="hero-title" style={{fontSize: '3rem', marginBottom: '10px'}}>
                        Community <span className="gradient-text">Reviews</span> & Ratings
                    </h1>
                    <p style={{fontSize: '1.1rem', color: '#ccc', maxWidth: '600px', margin: '0 auto 30px'}}>
                        Read authentic user experiences or share your own to help others decide better on their next journey.
                    </p>
                    <button className="btn-book" onClick={() => setShowModal(true)}>
                        <FaCamera style={{ marginRight: '8px' }}/> Write a Review
                    </button>
                </div>

                <div className="reviews-tabs glass-panel">
                    {['hotels', 'drivers', 'trips'].map(tab => (
                        <button 
                            key={tab} 
                            className={`review-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => handleTabSwitch(tab)}
                        >
                            {getTabIcon(tab)} {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="reviews-grid">
                    {reviewsData[activeTab].map(review => (
                        <div key={review.id} className="review-card glass-panel fade-in">
                            <div className="review-card-header">
                                <img src={review.avatar} alt={review.author} className="review-avatar" />
                                <div className="review-meta">
                                    <h4>{review.author}</h4>
                                    <span>{review.date}</span>
                                </div>
                                <div className="review-stars-badge">
                                    <StarRating rating={review.rating} />
                                </div>
                            </div>
                            <div className="review-card-body">
                                <h3 className="review-item-title">{review.title}</h3>
                                <p className="review-text">"{review.text}"</p>
                                {review.image && (
                                    <div className="review-image-container">
                                        <img src={review.image} alt="User upload" className="review-attached-image" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {reviewsData[activeTab].length === 0 && (
                        <div style={{gridColumn: '1 / -1', textAlign:'center', color: '#aaa', padding: '50px 0'}}>
                            No reviews here yet. Be the first to share your experience!
                        </div>
                    )}
                </div>
            </div>

            {/* Write Review Modal */}
            {showModal && (
                <div className="review-modal-overlay fade-in">
                    <div className="review-modal-content glass-panel">
                        <button className="btn-close-modal" onClick={() => setShowModal(false)}><FaTimes /></button>
                        <h2>Write Your Review</h2>
                        <form onSubmit={handleModalSubmit} className="review-form">
                            <div className="form-group row">
                                <div className="col">
                                    <label>Your Name</label>
                                    <input type="text" className="premium-input" placeholder="John Doe" required 
                                        value={newReview.author} onChange={e => setNewReview({...newReview, author: e.target.value})} />
                                </div>
                                <div className="col">
                                    <label>Category</label>
                                    <select className="premium-input" required 
                                        value={newReview.category} onChange={e => setNewReview({...newReview, category: e.target.value})}>
                                        <option value="hotels">Hotel</option>
                                        <option value="drivers">Driver / Car Rental</option>
                                        <option value="trips">Tour Package</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group row">
                                <div className="col">
                                    <label>Service Name (e.g. Hilton Hotel, Driver Mike)</label>
                                    <input type="text" className="premium-input" placeholder="Service / Item name..." required 
                                        value={newReview.title} onChange={e => setNewReview({...newReview, title: e.target.value})} />
                                </div>
                                <div className="col" style={{flex: '0.5'}}>
                                    <label>Rating</label>
                                    <div style={{paddingTop: '10px'}}>
                                        <StarRating rating={newReview.rating} setRating={(r) => setNewReview({...newReview, rating: r})} interactive={true} />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Your Experience & Comments</label>
                                <textarea className="premium-input" rows="4" placeholder="Share the details of your experience..." required 
                                    value={newReview.text} onChange={e => setNewReview({...newReview, text: e.target.value})}></textarea>
                            </div>

                            <div className="form-group">
                                <label>Attach Image URL (Optional)</label>
                                <input type="url" className="premium-input" placeholder="https://example.com/image.jpg" 
                                    value={newReview.image} onChange={e => setNewReview({...newReview, image: e.target.value})} />
                            </div>

                            <button type="submit" className="btn-book" style={{width: '100%', marginTop: '10px'}}>Publish Review</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewsRatings;
