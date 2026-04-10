import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEnvelope, FaIdBadge, FaCog, FaSignOutAlt, FaHome } from 'react-icons/fa';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: '',
        email: '',
        role: ''
    });

    useEffect(() => {
        // Verify JWT Auth Token
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/');
            return;
        }

        // Load profile from local storage (provided by JWT login payload)
        setUser({
            username: localStorage.getItem('userName') || 'Traveler',
            email: localStorage.getItem('userEmail') || 'Not provided',
            role: localStorage.getItem('role') || 'user'
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <nav style={styles.navbar}>
                <div style={styles.brand}>Premium Travels</div>
                <div style={styles.navLinks}>
                    <Link to="/home" style={styles.navItem}><FaHome /> Home</Link>
                    <Link to="/my-bookings" style={styles.navItem}>My Bookings</Link>
                </div>
            </nav>

            <div style={styles.profileCard}>
                <div style={styles.header}>
                    <FaUserCircle style={styles.avatarIcon} />
                    <h1 style={styles.title}>Your Profile</h1>
                </div>

                <div style={styles.detailsGrid}>
                    <div style={styles.detailItem}>
                        <FaIdBadge style={styles.icon} />
                        <div>
                            <p style={styles.label}>Username</p>
                            <p style={styles.value}>{user.username}</p>
                        </div>
                    </div>
                    
                    <div style={styles.detailItem}>
                        <FaEnvelope style={styles.icon} />
                        <div>
                            <p style={styles.label}>Email Address</p>
                            <p style={styles.value}>{user.email}</p>
                        </div>
                    </div>
                    
                    <div style={styles.detailItem}>
                        <FaCog style={styles.icon} />
                        <div>
                            <p style={styles.label}>Account Role</p>
                            <p style={styles.value} className={user.role === 'admin' ? 'admin-badge' : 'user-badge'}>
                                {user.role.toUpperCase()}
                            </p>
                        </div>
                    </div>
                </div>

                <div style={styles.actions}>
                    <button style={styles.logoutBtn} onClick={handleLogout}>
                        <FaSignOutAlt /> Secure Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: '#121521',
        color: '#ffffff',
        fontFamily: 'Inter, sans-serif'
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px 40px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    brand: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #6c5ce7, #00d2d3)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    navLinks: { display: 'flex', gap: '20px' },
    navItem: { color: '#a0aec0', textDecoration: 'none', fontWeight: 'bold' },
    profileCard: {
        maxWidth: '700px',
        margin: '60px auto',
        padding: '40px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
    },
    header: { textAlign: 'center', marginBottom: '40px' },
    avatarIcon: { fontSize: '6rem', color: '#00d2d3', marginBottom: '20px' },
    title: { fontSize: '2.5rem', margin: 0 },
    detailsGrid: {
        display: 'grid', gridTemplateColumns: '1fr', gap: '25px', marginBottom: '40px'
    },
    detailItem: {
        display: 'flex', alignItems: 'center', gap: '20px', padding: '20px',
        background: 'rgba(0, 0, 0, 0.2)', borderRadius: '15px'
    },
    icon: { fontSize: '2rem', color: '#6c5ce7' },
    label: { margin: 0, fontSize: '0.9rem', color: '#a0aec0' },
    value: { margin: '5px 0 0', fontSize: '1.3rem', fontWeight: 'bold' },
    actions: { textAlign: 'center' },
    logoutBtn: {
        padding: '15px 40px', fontSize: '1.2rem', fontWeight: 'bold',
        background: 'transparent', color: '#ff7675', border: '2px solid #ff7675',
        borderRadius: '10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px',
        transition: 'all 0.3s'
    }
};

export default UserProfile;
