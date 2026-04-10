import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import {
    FaChartLine, FaUsers, FaSuitcaseRolling, FaCog,
    FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaSync,
    FaPlane, FaHotel, FaCar, FaTrain, FaBus, FaSearch,
    FaFilter, FaDownload
} from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL || 'https://voyago-trvel-1.onrender.com';

/* ── Badge color per type ── */
const TYPE_COLORS = {
    'Flight':     { bg: 'rgba(108,92,231,0.18)', color: '#a29bfe' },
    'Hotel':      { bg: 'rgba(253,121,168,0.18)', color: '#fd79a8' },
    'Car Rental': { bg: 'rgba(253,203,110,0.18)', color: '#fdcb6e' },
    'Train':      { bg: 'rgba(0,184,148,0.18)',   color: '#55efc4' },
    'Bus':        { bg: 'rgba(116,185,255,0.18)', color: '#74b9ff' },
};

const TYPE_ICONS = {
    'Flight':     <FaPlane />,
    'Hotel':      <FaHotel />,
    'Car Rental': <FaCar />,
    'Train':      <FaTrain />,
    'Bus':        <FaBus />,
};

const STATUS_STYLES = {
    'Confirmed': { bg: 'rgba(0,184,148,0.15)', color: '#55efc4', border: 'rgba(0,184,148,0.3)' },
    'Pending':   { bg: 'rgba(253,203,110,0.15)', color: '#fdcb6e', border: 'rgba(253,203,110,0.3)' },
    'Cancelled': { bg: 'rgba(255,71,87,0.15)', color: '#ff6b81', border: 'rgba(255,71,87,0.3)' },
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab]     = useState('overview');
    const [bookings, setBookings]       = useState([]);
    const [stats, setStats]             = useState(null);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState('');
    const [searchTerm, setSearchTerm]   = useState('');
    const [filterType, setFilterType]   = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [updatingId, setUpdatingId]   = useState(null);

    const authToken = localStorage.getItem('authToken');
    const adminName = localStorage.getItem('userName') || 'Admin';

    /* ── Fetch all real bookings ── */
    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/api/admin/bookings`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                }
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'Failed to load bookings');
            setBookings(data.bookings || []);
            setStats(data.stats || null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    /* ── Update booking status ── */
    const updateStatus = async (booking, newStatus) => {
        setUpdatingId(booking._id);
        try {
            const res = await fetch(`${API_BASE}/api/admin/bookings/${encodeURIComponent(booking.type)}/${booking._id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                // Optimistically update in UI
                setBookings(prev =>
                    prev.map(b => b._id === booking._id ? { ...b, status: newStatus } : b)
                );
            }
        } catch (err) {
            console.error('Status update failed:', err);
        } finally {
            setUpdatingId(null);
        }
    };

    /* ── Filtered bookings ── */
    const filtered = bookings.filter(b => {
        const matchType   = filterType   === 'All' || b.type === filterType;
        const matchStatus = filterStatus === 'All' || b.status === filterStatus;
        const matchSearch = !searchTerm  ||
            b.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchType && matchStatus && matchSearch;
    });

    /* ── Export CSV ── */
    const exportCSV = () => {
        const headers = ['ID', 'Type', 'User', 'Email', 'Service', 'Amount', 'Status', 'Date'];
        const rows = filtered.map(b =>
            [b.id, b.type, b.user, b.email, `"${b.service}"`, b.amount, b.status, b.date].join(',')
        );
        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `voyago-bookings-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    /* ── Computed stats ── */
    const totalRevenue   = bookings.filter(b => b.status === 'Confirmed').reduce((s, b) => s + b.amount, 0);
    const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
    const pendingCount   = bookings.filter(b => b.status === 'Pending').length;
    const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length;

    /* ══════════════════════════════════
       RENDER: Overview Tab
    ══════════════════════════════════ */
    const renderOverview = () => (
        <div className="tab-content fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="section-title" style={{ margin: 0 }}>Live Overview & Revenue</h2>
                <button
                    onClick={fetchBookings}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(108,92,231,0.15)', color: '#a29bfe', border: '1px solid rgba(108,92,231,0.3)', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                >
                    <FaSync style={{ fontSize: '0.8rem' }} /> Refresh
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card glass-panel">
                    <div className="stat-icon" style={{ background: 'rgba(0,184,148,0.2)', color: '#00b894' }}><FaMoneyBillWave /></div>
                    <div className="stat-info">
                        <h3>₹{totalRevenue.toLocaleString()}</h3>
                        <p>Confirmed Revenue</p>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon" style={{ background: 'rgba(108,92,231,0.2)', color: '#6c5ce7' }}><FaSuitcaseRolling /></div>
                    <div className="stat-info">
                        <h3>{bookings.length}</h3>
                        <p>Total Bookings</p>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon" style={{ background: 'rgba(253,203,110,0.2)', color: '#fdcb6e' }}><FaChartLine /></div>
                    <div className="stat-info">
                        <h3>{pendingCount}</h3>
                        <p>Pending Approvals</p>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon" style={{ background: 'rgba(255,71,87,0.2)', color: '#ff6b81' }}><FaTimesCircle /></div>
                    <div className="stat-info">
                        <h3>{cancelledCount}</h3>
                        <p>Cancellations</p>
                    </div>
                </div>
            </div>

            {/* Breakdown by service type */}
            <div className="charts-container">
                <div className="chart-box glass-panel">
                    <h3 style={{ marginBottom: '1.5rem' }}>Bookings by Service Type</h3>
                    {Object.entries(TYPE_COLORS).map(([type, colors]) => {
                        const count = bookings.filter(b => b.type === type).length;
                        const pct   = bookings.length > 0 ? Math.round((count / bookings.length) * 100) : 0;
                        return (
                            <div key={type} style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.87rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.color }}>
                                        {TYPE_ICONS[type]} {type}
                                    </span>
                                    <span style={{ color: '#8892b0' }}>{count} bookings ({pct}%)</span>
                                </div>
                                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '100px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${pct}%`,
                                        background: colors.color,
                                        borderRadius: '100px',
                                        transition: 'width 1s ease',
                                        opacity: 0.85,
                                    }} />
                                </div>
                            </div>
                        );
                    })}

                    {bookings.length === 0 && !loading && (
                        <p style={{ color: '#495670', textAlign: 'center', padding: '2rem 0' }}>
                            No bookings yet. Bookings will appear here once users start booking.
                        </p>
                    )}
                </div>

                {/* Status breakdown */}
                <div className="chart-box glass-panel" style={{ maxWidth: '340px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Status Summary</h3>
                    {[
                        { label: 'Confirmed', count: confirmedCount, ...STATUS_STYLES['Confirmed'] },
                        { label: 'Pending',   count: pendingCount,   ...STATUS_STYLES['Pending']   },
                        { label: 'Cancelled', count: cancelledCount, ...STATUS_STYLES['Cancelled'] },
                    ].map(s => (
                        <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', marginBottom: '0.6rem', background: s.bg, border: `1px solid ${s.border}`, borderRadius: '10px' }}>
                            <span style={{ color: s.color, fontWeight: 700, fontSize: '0.87rem' }}>● {s.label}</span>
                            <span style={{ fontWeight: 800, color: s.color, fontSize: '1.1rem' }}>{s.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    /* ══════════════════════════════════
       RENDER: Bookings Tab
    ══════════════════════════════════ */
    const renderBookings = () => (
        <div className="tab-content fade-in">
            {/* Toolbar */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem', justifyContent: 'space-between' }}>
                <h2 className="section-title" style={{ margin: 0 }}>
                    All Bookings
                    <span style={{ marginLeft: '10px', fontSize: '0.85rem', color: '#8892b0', fontWeight: 500 }}>
                        ({filtered.length} of {bookings.length})
                    </span>
                </h2>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Search */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <FaSearch style={{ position: 'absolute', left: '10px', color: '#495670', fontSize: '0.8rem' }} />
                        <input
                            type="text"
                            placeholder="Search user, service, ID…"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '7px 12px 7px 30px', color: '#f0f4ff', fontSize: '0.85rem', width: '200px', outline: 'none' }}
                        />
                    </div>
                    {/* Type filter */}
                    <select value={filterType} onChange={e => setFilterType(e.target.value)}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '7px 12px', color: '#f0f4ff', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
                        <option value="All">All Types</option>
                        <option value="Flight">Flights</option>
                        <option value="Hotel">Hotels</option>
                        <option value="Car Rental">Car Rentals</option>
                        <option value="Train">Trains</option>
                        <option value="Bus">Buses</option>
                    </select>
                    {/* Status filter */}
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '7px 12px', color: '#f0f4ff', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
                        <option value="All">All Status</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    {/* Export */}
                    <button onClick={exportCSV}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,184,148,0.15)', color: '#55efc4', border: '1px solid rgba(0,184,148,0.3)', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                        <FaDownload /> CSV
                    </button>
                    <button onClick={fetchBookings}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(108,92,231,0.15)', color: '#a29bfe', border: '1px solid rgba(108,92,231,0.3)', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                        <FaSync /> Refresh
                    </button>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#8892b0' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                    <p>Fetching real booking data from database…</p>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div style={{ background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', color: '#ff6b81' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚠️</div>
                    <p style={{ marginBottom: '0.75rem' }}>{error}</p>
                    <p style={{ fontSize: '0.82rem', color: '#8892b0' }}>
                        Make sure the backend server is running at <code style={{ color: '#a29bfe' }}>{API_BASE}</code>
                    </p>
                    <button onClick={fetchBookings} style={{ marginTop: '1rem', background: 'rgba(255,71,87,0.15)', color: '#ff6b81', border: '1px solid rgba(255,71,87,0.3)', borderRadius: '8px', padding: '8px 18px', cursor: 'pointer', fontWeight: 600 }}>
                        Retry
                    </button>
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#8892b0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No bookings found</p>
                    <p style={{ fontSize: '0.87rem', marginTop: '0.5rem' }}>
                        {bookings.length === 0
                            ? 'The database has no bookings yet. Make some bookings to see them here.'
                            : 'Try adjusting the search or filter criteria.'
                        }
                    </p>
                </div>
            )}

            {/* Bookings table */}
            {!loading && !error && filtered.length > 0 && (
                <div className="glass-panel table-container" style={{ overflowX: 'auto' }}>
                    <table className="admin-table" style={{ width: '100%', minWidth: '900px' }}>
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Type</th>
                                <th>User / Guest</th>
                                <th>Service Details</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(b => {
                                const typeColors  = TYPE_COLORS[b.type]  || { bg: 'rgba(255,255,255,0.1)', color: '#ccc' };
                                const statusStyle = STATUS_STYLES[b.status] || STATUS_STYLES['Confirmed'];
                                const isUpdating  = updatingId === b._id;
                                return (
                                    <tr key={b._id || b.id} style={{ opacity: isUpdating ? 0.6 : 1, transition: 'opacity 0.3s' }}>
                                        <td>
                                            <code style={{ fontSize: '0.78rem', color: '#a29bfe', letterSpacing: '0.5px' }}>
                                                {b.id}
                                            </code>
                                        </td>
                                        <td>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                background: typeColors.bg, color: typeColors.color,
                                                padding: '3px 10px', borderRadius: '100px',
                                                fontSize: '0.75rem', fontWeight: 700,
                                            }}>
                                                {TYPE_ICONS[b.type]} {b.type}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.user || '—'}</div>
                                            {b.email && <div style={{ fontSize: '0.75rem', color: '#8892b0' }}>{b.email}</div>}
                                        </td>
                                        <td style={{ maxWidth: '260px' }}>
                                            <div style={{ fontSize: '0.85rem', color: '#a0aec0', lineHeight: 1.4 }}>
                                                {b.service}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 700, color: '#f0f4ff', whiteSpace: 'nowrap' }}>
                                            {b.amount > 0 ? `₹${b.amount.toLocaleString()}` : '—'}
                                        </td>
                                        <td style={{ color: '#8892b0', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{b.date}</td>
                                        <td>
                                            <span style={{
                                                display: 'inline-block',
                                                background: statusStyle.bg,
                                                color: statusStyle.color,
                                                border: `1px solid ${statusStyle.border}`,
                                                padding: '3px 10px', borderRadius: '100px',
                                                fontSize: '0.75rem', fontWeight: 700,
                                            }}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button
                                                    className="action-btn approve"
                                                    title="Confirm"
                                                    disabled={isUpdating || b.status === 'Confirmed'}
                                                    onClick={() => updateStatus(b, 'Confirmed')}
                                                    style={{ opacity: b.status === 'Confirmed' ? 0.4 : 1 }}
                                                >
                                                    <FaCheckCircle />
                                                </button>
                                                <button
                                                    className="action-btn reject"
                                                    title="Cancel"
                                                    disabled={isUpdating || b.status === 'Cancelled'}
                                                    onClick={() => updateStatus(b, 'Cancelled')}
                                                    style={{ opacity: b.status === 'Cancelled' ? 0.4 : 1 }}
                                                >
                                                    <FaTimesCircle />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    /* ══════════════════════════════════
       RENDER: Services Tab
    ══════════════════════════════════ */
    const [services] = useState([
        { id: 1, name: 'Flights',      icon: <FaPlane />,  status: 'Active',   color: '#a29bfe' },
        { id: 2, name: 'Hotels',       icon: <FaHotel />,  status: 'Active',   color: '#fd79a8' },
        { id: 3, name: 'Car Rentals',  icon: <FaCar />,    status: 'Active',   color: '#fdcb6e' },
        { id: 4, name: 'Trains',       icon: <FaTrain />,  status: 'Active',   color: '#55efc4' },
        { id: 5, name: 'Buses',        icon: <FaBus />,    status: 'Active',   color: '#74b9ff' },
        { id: 6, name: 'Tour Packages',icon: '🎒',         status: 'Active',   color: '#e17055' },
        { id: 7, name: 'AI Planner',   icon: '🧠',         status: 'Active',   color: '#00d2d3' },
    ]);

    const renderServices = () => (
        <div className="tab-content fade-in">
            <h2 className="section-title">Platform Services</h2>
            <div className="services-grid">
                {services.map(s => {
                    const count = bookings.filter(b => b.type === s.name || (s.name === 'Car Rentals' && b.type === 'Car Rental')).length;
                    return (
                        <div className="service-card glass-panel" key={s.id}>
                            <div className="service-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.4rem', color: s.color }}>{s.icon}</span>
                                    <h3>{s.name}</h3>
                                </div>
                                <span style={{
                                    fontSize: '0.7rem', fontWeight: 800, padding: '3px 10px',
                                    borderRadius: '100px', textTransform: 'uppercase',
                                    background: 'rgba(0,184,148,0.15)', color: '#55efc4',
                                    border: '1px solid rgba(0,184,148,0.3)',
                                }}>
                                    {s.status}
                                </span>
                            </div>
                            <p style={{ color: '#8892b0', margin: '12px 0 4px', fontSize: '0.87rem' }}>
                                Real bookings: <strong style={{ color: '#f0f4ff' }}>{count}</strong>
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    /* ══════════════════════════════════
       MAIN RENDER
    ══════════════════════════════════ */
    return (
        <div className="admin-dashboard-container">
            {/* Sidebar */}
            <aside className="admin-sidebar glass-panel">
                <div className="brand" onClick={() => navigate('/home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                    <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #6c5ce7, #00d2d3)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.2rem', color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', flexShrink: 0 }}>V</div>
                    <div>
                        <span className="gradient-text" style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Plus Jakarta Sans, sans-serif', display: 'block', letterSpacing: '-0.5px' }}>VoyaGo™</span>
                        <span style={{ display: 'block', fontSize: '0.72rem', color: '#495670', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Admin Panel</span>
                    </div>
                </div>

                <nav className="admin-nav">
                    <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                        <FaChartLine /> Overview
                    </button>
                    <button className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
                        <FaSuitcaseRolling /> Bookings
                        {pendingCount > 0 && (
                            <span style={{ marginLeft: 'auto', background: '#fdcb6e', color: '#111', borderRadius: '100px', padding: '1px 7px', fontSize: '0.7rem', fontWeight: 800 }}>
                                {pendingCount}
                            </span>
                        )}
                    </button>
                    <button className={`nav-item ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
                        <FaCog /> Services
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div style={{ fontSize: '0.8rem', color: '#495670', marginBottom: '12px', padding: '0 4px' }}>
                        Logged in as <strong style={{ color: '#a29bfe' }}>{adminName}</strong>
                    </div>
                    <button className="btn-logout" onClick={() => { localStorage.clear(); navigate('/'); }}>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header glass-panel">
                    <div className="header-info">
                        <h1>Welcome back, {adminName} 👋</h1>
                        <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="admin-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#8892b0' }}>
                            <div style={{ color: '#f0f4ff', fontWeight: 600 }}>{bookings.length} total bookings</div>
                            <div>Last updated: just now</div>
                        </div>
                        <img
                            src={`https://ui-avatars.com/api/?name=${adminName}&background=6c5ce7&color=fff`}
                            alt="Admin"
                            className="avatar"
                        />
                    </div>
                </header>

                <div className="admin-content">
                    {activeTab === 'overview'  && renderOverview()}
                    {activeTab === 'bookings'  && renderBookings()}
                    {activeTab === 'services'  && renderServices()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
