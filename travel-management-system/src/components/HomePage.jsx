import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/* ============================================================
   VoyaGo™ — HomePage
   World-class premium travel management dashboard
   ============================================================ */

const HERO_SLIDES = [
  {
    title: 'Discover the World',
    subtitle: 'with Elegance.',
    desc: 'AI-powered travel management for the modern explorer. From sky to sea — all in one platform.',
    gradient: 'linear-gradient(135deg, #6c5ce7 0%, #00d2d3 100%)',
    emoji: '✈️',
    bg: 'radial-gradient(ellipse 80% 70% at 50% 30%, rgba(108,92,231,0.18), transparent)',
  },
  {
    title: 'Luxury Stays,',
    subtitle: 'Effortless Booking.',
    desc: "From boutique hideaways to 5-star palaces — VoyaGo's hotel network puts the world's finest at your fingertips.",
    gradient: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
    emoji: '🏰',
    bg: 'radial-gradient(ellipse 80% 70% at 50% 30%, rgba(253,121,168,0.15), transparent)',
  },
  {
    title: 'AI Trip Planner.',
    subtitle: 'Your Perfect Itinerary.',
    desc: 'Tell our AI where you want to go — it builds a complete, optimized travel plan in seconds.',
    gradient: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
    emoji: '🧠',
    bg: 'radial-gradient(ellipse 80% 70% at 50% 30%, rgba(0,184,148,0.15), transparent)',
  },
];

const QUICK_ACTIONS = [
  { title: 'Flights', desc: 'Global airline deals', icon: '✈️', link: '/flights', color: '#6c5ce7', badge: 'HOT' },
  { title: 'Hotels', desc: 'Luxury stays', icon: '🏨', link: '/hotels', color: '#fd79a8', badge: null },
  { title: 'Car Rentals', desc: 'Premium rides', icon: '🚗', link: '/cars', color: '#fdcb6e', badge: 'NEW' },
  { title: 'Trains', desc: 'Scenic journeys', icon: '🚆', link: '/trains', color: '#00b894', badge: null },
  { title: 'Buses', desc: 'Road adventures', icon: '🚌', link: '/buses', color: '#00d2d3', badge: null },
  { title: 'World Tour', desc: 'Explore the globe', icon: '🌍', link: '/world-tour', color: '#e17055', badge: 'EXPLORE' },
  { title: 'Tour Packages', desc: 'All-inclusive bundles', icon: '🎒', link: '/tour-booking', color: '#a29bfe', badge: null },
  { title: 'AI Trip Planner', desc: 'Smart itineraries', icon: '🧠', link: '/trip-planner', color: '#55efc4', badge: 'AI' },
  { title: 'Reviews', desc: 'Trusted community', icon: '⭐', link: '/reviews', color: '#fdcb6e', badge: null },
  { title: 'My Bookings', desc: 'Manage your trips', icon: '🎫', link: '/my-bookings', color: '#74b9ff', badge: null },
];

const STATS = [
  { value: '2M+', label: 'Happy Travelers', icon: '😊' },
  { value: '180+', label: 'Countries Covered', icon: '🌐' },
  { value: '99.8%', label: 'Uptime SLA', icon: '⚡' },
  { value: '4.9★', label: 'App Store Rating', icon: '⭐' },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Travel Blogger',
    avatar: '👩‍💼',
    text: "VoyaGo is genuinely the only travel platform I trust. The AI planner built my entire 14-day Europe trip in 30 seconds. Absolutely mind-blowing.",
    rating: 5,
    destination: 'Europe Tour',
  },
  {
    name: 'Rahul Mehta',
    role: 'Business Executive',
    avatar: '👨‍💻',
    text: "I book dozens of flights a month. VoyaGo's UI is the smoothest I've ever used. Real-time tracking, instant confirmations — it just works.",
    rating: 5,
    destination: 'Mumbai → Singapore',
  },
  {
    name: 'Aria Kapoor',
    role: 'Adventure Photographer',
    avatar: '📸',
    text: "I discovered hidden destinations through VoyaGo's World Tour feature I never knew existed. Now I'm a full-time travel creator, and VoyaGo is my co-pilot.",
    rating: 5,
    destination: 'Himalayan Circuit',
  },
];

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI-Powered Planning',
    desc: 'Our proprietary AI engine analyzes millions of routes, prices, and preferences to craft your perfect itinerary in seconds.',
    color: 'var(--brand-primary)',
  },
  {
    icon: '📡',
    title: 'Real-Time Tracking',
    desc: 'Track your flights, trains, and buses live on an interactive map. Never miss a connection again.',
    color: 'var(--brand-secondary)',
  },
  {
    icon: '🛡️',
    title: 'Bank-Grade Security',
    desc: 'Your data and payments are encrypted end-to-end with 256-bit AES encryption and PCI DSS compliance.',
    color: 'var(--brand-emerald)',
  },
  {
    icon: '💎',
    title: 'Premium Concierge',
    desc: 'VoyaGo Premium members get 24/7 human travel concierge support for any booking change or emergency.',
    color: 'var(--brand-gold)',
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userRole = localStorage.getItem('role') || 'user';
  const userName = localStorage.getItem('userName') || 'Traveler';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlide(s => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate('/');
  }, [navigate]);

  const slide = HERO_SLIDES[heroSlide];

  return (
    <>
      <style>{`
        /* ── Navbar ── */
        .vg-navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 900;
          padding: 1.2rem 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .vg-navbar.scrolled {
          background: rgba(6,8,16,0.82);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 0.85rem 2.5rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }
        .vg-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .vg-brand-logo {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #6c5ce7, #00d2d3);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.3rem;
          color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          box-shadow: 0 4px 14px rgba(108,92,231,0.5);
          flex-shrink: 0;
        }
        .vg-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }
        .vg-brand-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 1.25rem;
          background: linear-gradient(135deg, #6c5ce7, #00d2d3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
        }
        .vg-brand-tagline {
          font-size: 0.6rem;
          color: #495670;
          font-weight: 500;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          -webkit-text-fill-color: #495670;
        }
        .vg-nav-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .vg-nav-link {
          padding: 0.5rem 0.9rem;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 500;
          color: #8892b0;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        .vg-nav-link:hover {
          background: rgba(255,255,255,0.07);
          color: #f0f4ff;
        }
        .vg-nav-link.active {
          color: #a29bfe;
          background: rgba(108,92,231,0.12);
        }
        .vg-nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .vg-user-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 6px 14px 6px 8px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #f0f4ff;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .vg-user-chip:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(108,92,231,0.4);
        }
        .vg-user-avatar {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #6c5ce7, #00d2d3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
          color: white;
        }
        .vg-logout-btn {
          padding: 0.5rem 1.1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #8892b0;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .vg-logout-btn:hover {
          color: #ff6b81;
          border-color: rgba(255,107,129,0.3);
          background: rgba(255,107,129,0.08);
        }
        .vg-mobile-menu-btn {
          display: none;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 8px 10px;
          cursor: pointer;
          color: #f0f4ff;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }
        .vg-mobile-menu {
          display: none;
          position: fixed;
          top: 70px; left: 0; right: 0;
          background: rgba(6,8,16,0.96);
          backdrop-filter: blur(30px);
          z-index: 850;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transform: translateY(-110%);
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .vg-mobile-menu.open {
          transform: translateY(0);
        }
        .vg-mobile-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .vg-mobile-link {
          padding: 0.85rem 1rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          color: #8892b0;
          border: 1px solid transparent;
          transition: all 0.25s ease;
        }
        .vg-mobile-link:hover {
          background: rgba(108,92,231,0.1);
          color: #a29bfe;
          border-color: rgba(108,92,231,0.2);
        }

        /* ── Hero ── */
        .vg-hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 7rem 2rem 4rem;
          position: relative;
          overflow: hidden;
          transition: all 0.6s ease;
        }
        .vg-hero-bg {
          position: absolute;
          inset: 0;
          transition: opacity 0.8s ease;
          pointer-events: none;
        }
        .vg-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(108,92,231,0.15);
          border: 1px solid rgba(108,92,231,0.3);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #a29bfe;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1.75rem;
          animation: fadeUp 0.7s ease both;
        }
        .vg-hero-title {
          font-family: 'Plus Jakarta Sans', 'Outfit', sans-serif;
          font-size: clamp(3rem, 8vw, 6.5rem);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.04em;
          margin-bottom: 0.5rem;
          animation: fadeUp 0.7s 0.1s ease both;
        }
        .vg-hero-subtitle {
          font-family: 'Plus Jakarta Sans', 'Outfit', sans-serif;
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.04em;
          margin-bottom: 1.75rem;
          animation: fadeUp 0.7s 0.15s ease both;
        }
        .vg-hero-desc {
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: #8892b0;
          max-width: 560px;
          line-height: 1.7;
          margin-bottom: 2.75rem;
          animation: fadeUp 0.7s 0.25s ease both;
        }
        .vg-hero-cta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          animation: fadeUp 0.7s 0.35s ease both;
        }
        .vg-hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 1rem 2.2rem;
          border-radius: 100px;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.3px;
          transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
          cursor: pointer;
          text-decoration: none;
        }
        .vg-hero-btn-primary {
          background: linear-gradient(135deg, #6c5ce7, #00d2d3);
          color: white;
          box-shadow: 0 8px 32px rgba(108,92,231,0.45);
          border: none;
        }
        .vg-hero-btn-primary:hover {
          transform: translateY(-4px) scale(1.04);
          box-shadow: 0 16px 48px rgba(108,92,231,0.55);
        }
        .vg-hero-btn-secondary {
          background: rgba(255,255,255,0.06);
          color: #f0f4ff;
          border: 1px solid rgba(255,255,255,0.12);
        }
        .vg-hero-btn-secondary:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-3px);
        }
        .vg-slide-dots {
          display: flex;
          gap: 8px;
          margin-top: 3rem;
          animation: fadeUp 0.7s 0.45s ease both;
        }
        .vg-slide-dot {
          height: 6px;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.4s ease;
          background: rgba(255,255,255,0.2);
          width: 6px;
        }
        .vg-slide-dot.active {
          background: linear-gradient(135deg, #6c5ce7, #00d2d3);
          width: 28px;
          box-shadow: 0 0 12px rgba(108,92,231,0.6);
        }

        /* ── Stats Bar ── */
        .vg-stats-bar {
          background: rgba(13,17,27,0.7);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 2rem;
        }
        .vg-stats-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          text-align: center;
        }
        .vg-stat-item {}
        .vg-stat-icon {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
          display: block;
        }
        .vg-stat-value {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 2.2rem;
          font-weight: 900;
          background: linear-gradient(135deg, #6c5ce7, #00d2d3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -1px;
          line-height: 1;
          margin-bottom: 0.35rem;
        }
        .vg-stat-label {
          font-size: 0.85rem;
          color: #8892b0;
          font-weight: 500;
        }

        /* ── Services Grid ── */
        .vg-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 5rem 2rem;
          width: 100%;
        }
        .vg-section-header {
          text-align: center;
          margin-bottom: 3.5rem;
        }
        .vg-section-eyebrow {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #a29bfe;
          margin-bottom: 0.75rem;
        }
        .vg-section-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1.8rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 0.75rem;
        }
        .vg-section-desc {
          color: #8892b0;
          font-size: 1rem;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .vg-services-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.25rem;
        }
        .vg-service-card {
          background: rgba(13,17,27,0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 1.75rem 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.85rem;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          position: relative;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
        }
        .vg-service-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 0%, var(--card-color, rgba(108,92,231,0.2)), transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .vg-service-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .vg-service-card:hover::before {
          opacity: 1;
        }
        .vg-service-icon {
          font-size: 2.4rem;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4));
          position: relative;
          z-index: 1;
          transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        .vg-service-card:hover .vg-service-icon {
          transform: scale(1.2) translateY(-4px);
        }
        .vg-service-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #f0f4ff;
          position: relative;
          z-index: 1;
        }
        .vg-service-desc {
          font-size: 0.78rem;
          color: #8892b0;
          position: relative;
          z-index: 1;
        }
        .vg-service-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, #6c5ce7, #00d2d3);
          color: white;
          font-size: 0.6rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          z-index: 1;
        }
        .vg-service-badge.ai-badge {
          background: linear-gradient(135deg, #00b894, #00d2d3);
        }
        .vg-service-badge.new-badge {
          background: linear-gradient(135deg, #fd79a8, #e17055);
        }

        /* ── Features ── */
        .vg-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        .vg-feature-card {
          background: rgba(13,17,27,0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          transition: all 0.4s ease;
        }
        .vg-feature-card:hover {
          border-color: rgba(255,255,255,0.14);
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.35);
        }
        .vg-feature-icon-box {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .vg-feature-content {}
        .vg-feature-title {
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .vg-feature-desc {
          font-size: 0.88rem;
          color: #8892b0;
          line-height: 1.6;
        }

        /* ── Testimonials ── */
        .vg-testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .vg-testimonial-card {
          background: rgba(13,17,27,0.72);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.4s ease;
          position: relative;
        }
        .vg-testimonial-card:hover {
          border-color: rgba(108,92,231,0.25);
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        .vg-quote-icon {
          font-size: 3rem;
          color: rgba(108,92,231,0.3);
          line-height: 1;
          margin-bottom: 0.5rem;
          font-family: Georgia, serif;
        }
        .vg-testimonial-text {
          font-size: 0.92rem;
          color: #a0aec0;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          font-style: italic;
        }
        .vg-testimonial-footer {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .vg-testimonial-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6c5ce7, #00d2d3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }
        .vg-testimonial-name {
          font-weight: 700;
          font-size: 0.95rem;
        }
        .vg-testimonial-role {
          font-size: 0.78rem;
          color: #8892b0;
        }
        .vg-testimonial-dest {
          margin-left: auto;
          font-size: 0.72rem;
          color: #a29bfe;
          font-weight: 600;
          background: rgba(108,92,231,0.12);
          padding: 3px 10px;
          border-radius: 100px;
        }
        .vg-stars {
          color: #fdcb6e;
          font-size: 0.8rem;
          letter-spacing: 1px;
        }

        /* ── App Promo ── */
        .vg-app-promo {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem 5rem;
        }
        .vg-app-promo-card {
          background: linear-gradient(135deg, rgba(13,17,27,0.9) 0%, rgba(108,92,231,0.12) 60%, rgba(0,210,211,0.08) 100%);
          border: 1px solid rgba(108,92,231,0.2);
          border-radius: 28px;
          padding: 4rem;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 3rem;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .vg-app-promo-card::before {
          content: '';
          position: absolute;
          top: -100px; right: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(108,92,231,0.15), transparent 70%);
          pointer-events: none;
        }
        .vg-app-promo-headline {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
          line-height: 1.1;
        }
        .vg-app-promo-desc {
          color: #8892b0;
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 480px;
        }
        .vg-app-promo-btns {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .vg-store-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 14px;
          padding: 0.85rem 1.75rem;
          color: white;
          text-decoration: none;
          transition: all 0.35s ease;
        }
        .vg-store-btn:hover {
          background: rgba(108,92,231,0.2);
          border-color: rgba(108,92,231,0.4);
          transform: translateY(-3px);
        }
        .vg-store-icon { font-size: 1.75rem; }
        .vg-store-label { font-size: 0.65rem; color: #8892b0; text-transform: uppercase; letter-spacing: 0.5px; }
        .vg-store-name { font-size: 1rem; font-weight: 700; }
        .vg-phone-mockup {
          position: relative;
          z-index: 1;
        }
        .vg-mockup-device {
          width: 220px;
          height: 440px;
          background: #111;
          border: 10px solid #222;
          border-radius: 36px;
          position: relative;
          box-shadow: -20px 20px 60px rgba(0,0,0,0.6), 20px 0 40px rgba(108,92,231,0.2);
          transform: rotate(-8deg);
          transition: transform 0.5s ease;
          overflow: hidden;
        }
        .vg-app-promo-card:hover .vg-mockup-device {
          transform: rotate(-4deg) translateY(-6px);
        }
        .vg-mockup-notch {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 100px; height: 22px;
          background: #222;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          z-index: 2;
        }
        .vg-mockup-screen {
          width: 100%;
          height: 100%;
          background: var(--bg-dark);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .vg-mockup-header {
          background: linear-gradient(135deg, rgba(108,92,231,0.25), rgba(0,210,211,0.15));
          padding: 2.5rem 1rem 1rem;
          text-align: center;
          font-size: 0.9rem;
          font-weight: 800;
          font-family: 'Plus Jakarta Sans',sans-serif;
          color: #a29bfe;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .vg-mockup-body { padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .vg-mockup-item {
          height: 52px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.07);
          position: relative;
          overflow: hidden;
        }
        .vg-mockup-item::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
          animation: shimmer 2s ease infinite;
          background-size: 200% 100%;
        }

        /* ── Footer ── */
        .vg-footer {
          background: rgba(6,8,16,0.95);
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 4rem 2rem 2rem;
        }
        .vg-footer-inner {
          max-width: 1280px;
          margin: 0 auto;
        }
        .vg-footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .vg-footer-brand {}
        .vg-footer-brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1rem;
        }
        .vg-footer-brand-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #6c5ce7, #00d2d3);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.15rem;
          color: white;
          font-family: 'Plus Jakarta Sans',sans-serif;
        }
        .vg-footer-brand-name {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-weight: 800;
          font-size: 1.15rem;
          background: linear-gradient(135deg, #6c5ce7, #00d2d3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .vg-footer-desc {
          color: #495670;
          font-size: 0.87rem;
          line-height: 1.7;
          max-width: 280px;
          margin-bottom: 1.25rem;
        }
        .vg-footer-social {
          display: flex;
          gap: 0.6rem;
        }
        .vg-social-btn {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: #8892b0;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .vg-social-btn:hover {
          background: rgba(108,92,231,0.2);
          border-color: rgba(108,92,231,0.4);
          color: #a29bfe;
        }
        .vg-footer-col {}
        .vg-footer-col-title {
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #495670;
          margin-bottom: 1.25rem;
        }
        .vg-footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .vg-footer-link {
          color: #8892b0;
          font-size: 0.88rem;
          text-decoration: none;
          transition: color 0.25s ease;
        }
        .vg-footer-link:hover { color: #f0f4ff; }
        .vg-footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .vg-footer-copy {
          color: #495670;
          font-size: 0.82rem;
        }
        .vg-footer-copy span {
          color: #a29bfe;
        }
        .vg-footer-legal {
          display: flex;
          gap: 1.5rem;
        }
        .vg-footer-legal a {
          color: #495670;
          font-size: 0.82rem;
          text-decoration: none;
          transition: color 0.25s ease;
        }
        .vg-footer-legal a:hover { color: #8892b0; }

        /* ── Responsive ── */
        @media (max-width: 1200px) {
          .vg-services-grid { grid-template-columns: repeat(4, 1fr); }
          .vg-footer-top { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 960px) {
          .vg-services-grid { grid-template-columns: repeat(3, 1fr); }
          .vg-features-grid { grid-template-columns: 1fr; }
          .vg-testimonials-grid { grid-template-columns: 1fr; }
          .vg-stats-inner { grid-template-columns: repeat(2, 1fr); }
          .vg-app-promo-card { grid-template-columns: 1fr; padding: 2.5rem; }
          .vg-phone-mockup { display: none; }
        }
        @media (max-width: 768px) {
          .vg-navbar { padding: 1rem 1.25rem; }
          .vg-navbar.scrolled { padding: 0.75rem 1.25rem; }
          .vg-nav-links, .vg-nav-actions { display: none; }
          .vg-mobile-menu-btn { display: flex; }
          .vg-mobile-menu { display: flex; flex-direction: column; }
          .vg-hero { padding: 6rem 1.25rem 3rem; }
          .vg-services-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
          .vg-section { padding: 3rem 1.25rem; }
          .vg-stats-inner { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
          .vg-testimonials-grid, .vg-features-grid { grid-template-columns: 1fr; }
          .vg-app-promo { padding: 0 1.25rem 3rem; }
          .vg-app-promo-card { padding: 2rem; gap: 2rem; }
          .vg-footer-top { grid-template-columns: 1fr; gap: 2rem; }
          .vg-footer-bottom { flex-direction: column; text-align: center; }
        }
        @media (max-width: 480px) {
          .vg-services-grid { grid-template-columns: 1fr 1fr; }
          .vg-hero-title { font-size: 2.4rem; }
          .vg-stats-inner { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* ─── NAVBAR ─── */}
      <nav className={`vg-navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/home" className="vg-brand">
          <div className="vg-brand-logo">V</div>
          <div className="vg-brand-text">
            <span className="vg-brand-name">VoyaGo™</span>
            <span className="vg-brand-tagline">Travel Reimagined</span>
          </div>
        </Link>

        <div className="vg-nav-links">
          <Link to="/home" className="vg-nav-link active">Home</Link>
          <Link to="/flights" className="vg-nav-link">✈️ Flights</Link>
          <Link to="/hotels" className="vg-nav-link">🏨 Hotels</Link>
          <Link to="/tour-booking" className="vg-nav-link">🎒 Packages</Link>
          <Link to="/trip-planner" className="vg-nav-link">🧠 AI Planner</Link>
          <Link to="/world-tour" className="vg-nav-link">🌍 World Tour</Link>
          <Link to="/reviews" className="vg-nav-link">⭐ Reviews</Link>
          <Link to="/my-bookings" className="vg-nav-link">🎫 Bookings</Link>
          {userRole === 'admin' && (
            <Link to="/admin" className="vg-nav-link" style={{ color: '#fdcb6e' }}>🛡️ Admin</Link>
          )}
        </div>

        <div className="vg-nav-actions">
          <Link to="/profile" className="vg-user-chip">
            <div className="vg-user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            {userName}
          </Link>
          <button className="vg-logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>

        <button className="vg-mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`vg-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="vg-mobile-links">
          {[
            { to: '/home', label: '🏠 Home' },
            { to: '/flights', label: '✈️ Flights' },
            { to: '/hotels', label: '🏨 Hotels' },
            { to: '/cars', label: '🚗 Car Rentals' },
            { to: '/trains', label: '🚆 Trains' },
            { to: '/buses', label: '🚌 Buses' },
            { to: '/world-tour', label: '🌍 World Tour' },
            { to: '/tour-booking', label: '🎒 Tour Packages' },
            { to: '/trip-planner', label: '🧠 AI Trip Planner' },
            { to: '/reviews', label: '⭐ Reviews' },
            { to: '/my-bookings', label: '🎫 My Bookings' },
            { to: '/profile', label: '👤 Profile' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className="vg-mobile-link" onClick={() => setMobileMenuOpen(false)}>
              {label}
            </Link>
          ))}
          {userRole === 'admin' && (
            <Link to="/admin" className="vg-mobile-link" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fdcb6e' }}>
              🛡️ Admin Dashboard
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="vg-mobile-link"
            style={{ background: 'rgba(255,107,129,0.1)', color: '#ff6b81', border: '1px solid rgba(255,107,129,0.2)', width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '10px', padding: '0.85rem 1rem', fontFamily: 'inherit', fontSize: '1rem', fontWeight: 600 }}
          >
            🚪 Sign Out
          </button>
        </div>
      </div>

      {/* ─── HERO SECTION ─── */}
      <section className="vg-hero">
        <div className="vg-hero-bg" style={{ background: slide.bg }} />

        <div className="vg-hero-eyebrow">
          <span>{slide.emoji}</span>
          <span>VoyaGo™ — AI-Powered Travel Platform</span>
        </div>

        <h1 className="vg-hero-title">{slide.title}</h1>
        <h2 className="vg-hero-subtitle">
          <span style={{ background: slide.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {slide.subtitle}
          </span>
        </h2>

        <p className="vg-hero-desc">{slide.desc}</p>

        <div className="vg-hero-cta">
          <Link to="/trip-planner" className="vg-hero-btn vg-hero-btn-primary">
            🧠 Plan My Trip with AI
          </Link>
          <Link to="/flights" className="vg-hero-btn vg-hero-btn-secondary">
            ✈️ Explore Flights
          </Link>
        </div>

        <div className="vg-slide-dots">
          {HERO_SLIDES.map((_, i) => (
            <div
              key={i}
              className={`vg-slide-dot ${i === heroSlide ? 'active' : ''}`}
              onClick={() => setHeroSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <div className="vg-stats-bar">
        <div className="vg-stats-inner">
          {STATS.map((stat, i) => (
            <div key={i} className="vg-stat-item">
              <span className="vg-stat-icon">{stat.icon}</span>
              <div className="vg-stat-value">{stat.value}</div>
              <div className="vg-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── SERVICES GRID ─── */}
      <div className="vg-section" style={{ paddingBottom: '2rem' }}>
        <div className="vg-section-header">
          <span className="vg-section-eyebrow">Our Services</span>
          <h2 className="vg-section-title">Everything You Need to <span className="gradient-text">Travel Better</span></h2>
          <p className="vg-section-desc">From booking to boarding — VoyaGo handles every step of your journey in one seamless experience.</p>
        </div>

        <div className="vg-services-grid">
          {QUICK_ACTIONS.map((action, idx) => (
            <Link
              to={action.link}
              key={idx}
              className="vg-service-card"
              style={{ '--card-color': `${action.color}30` }}
            >
              {action.badge && (
                <span className={`vg-service-badge ${action.badge === 'AI' ? 'ai-badge' : action.badge === 'NEW' ? 'new-badge' : ''}`}>
                  {action.badge}
                </span>
              )}
              <div className="vg-service-icon">{action.icon}</div>
              <div className="vg-service-title">{action.title}</div>
              <div className="vg-service-desc">{action.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── WHY VOYAGO FEATURES ─── */}
      <div className="vg-section" style={{ paddingTop: '2rem' }}>
        <div className="vg-section-header">
          <span className="vg-section-eyebrow">Why VoyaGo</span>
          <h2 className="vg-section-title">Built for the <span className="gradient-text">Modern Traveler</span></h2>
          <p className="vg-section-desc">Enterprise-grade technology, consumer-grade simplicity. That's the VoyaGo difference.</p>
        </div>

        <div className="vg-features-grid">
          {FEATURES.map((feat, i) => (
            <div key={i} className="vg-feature-card">
              <div
                className="vg-feature-icon-box"
                style={{ background: `${feat.color}18`, borderColor: `${feat.color}30` }}
              >
                {feat.icon}
              </div>
              <div className="vg-feature-content">
                <div className="vg-feature-title">{feat.title}</div>
                <div className="vg-feature-desc">{feat.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── TESTIMONIALS ─── */}
      <div className="vg-section" style={{ paddingTop: '2rem' }}>
        <div className="vg-section-header">
          <span className="vg-section-eyebrow">Traveler Stories</span>
          <h2 className="vg-section-title">Loved by <span className="gradient-text">Millions</span></h2>
          <p className="vg-section-desc">Real reviews from real travelers who made VoyaGo their go-to travel companion.</p>
        </div>

        <div className="vg-testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="vg-testimonial-card">
              <div className="vg-quote-icon">"</div>
              <p className="vg-testimonial-text">{t.text}</p>
              <div className="vg-stars">{'★'.repeat(t.rating)}</div>
              <div style={{ height: '1rem' }} />
              <div className="vg-testimonial-footer">
                <div className="vg-testimonial-avatar">{t.avatar}</div>
                <div>
                  <div className="vg-testimonial-name">{t.name}</div>
                  <div className="vg-testimonial-role">{t.role}</div>
                </div>
                <span className="vg-testimonial-dest">📍 {t.destination}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── APP PROMO ─── */}
      <div className="vg-app-promo">
        <div className="vg-app-promo-card">
          <div>
            <h2 className="vg-app-promo-headline">
              Take VoyaGo™ <span className="gradient-text">Anywhere</span>
            </h2>
            <p className="vg-app-promo-desc">
              Download our award-winning mobile app for exclusive deals, real-time tracking, offline boarding passes, and 24/7 AI travel support — all in your pocket.
            </p>
            <div className="vg-app-promo-btns">
              <a href="/travel-app.apk" download="VoyaGo.apk" className="vg-store-btn">
                <span className="vg-store-icon">🤖</span>
                <div>
                  <div className="vg-store-label">Get it on</div>
                  <div className="vg-store-name" style={{ fontWeight: 700 }}>Android APK</div>
                </div>
              </a>
              <a href="#" className="vg-store-btn">
                <span className="vg-store-icon">🍎</span>
                <div>
                  <div className="vg-store-label">Coming Soon</div>
                  <div className="vg-store-name" style={{ fontWeight: 700 }}>App Store</div>
                </div>
              </a>
            </div>
          </div>
          <div className="vg-phone-mockup">
            <div className="vg-mockup-device">
              <div className="vg-mockup-notch" />
              <div className="vg-mockup-screen">
                <div className="vg-mockup-header">VoyaGo™</div>
                <div className="vg-mockup-body">
                  <div className="vg-mockup-item" />
                  <div className="vg-mockup-item" />
                  <div className="vg-mockup-item" />
                  <div className="vg-mockup-item" />
                  <div className="vg-mockup-item" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <footer className="vg-footer">
        <div className="vg-footer-inner">
          <div className="vg-footer-top">
            <div className="vg-footer-brand">
              <div className="vg-footer-brand-logo">
                <div className="vg-footer-brand-icon">V</div>
                <span className="vg-footer-brand-name">VoyaGo™</span>
              </div>
              <p className="vg-footer-desc">
                VoyaGo Technologies Pvt. Ltd. — The world's most intelligent AI-powered travel management platform. Turning journeys into unforgettable experiences since 2025.
              </p>
              <div className="vg-footer-social">
                {['𝕏', '📘', '💼', '📸'].map((icon, i) => (
                  <a key={i} href="#" className="vg-social-btn">{icon}</a>
                ))}
              </div>
            </div>

            <div className="vg-footer-col">
              <div className="vg-footer-col-title">Services</div>
              <div className="vg-footer-links">
                {[['Flights', '/flights'], ['Hotels', '/hotels'], ['Car Rentals', '/cars'], ['Train Booking', '/trains'], ['Bus Booking', '/buses'], ['Tour Packages', '/tour-booking']].map(([label, to]) => (
                  <Link key={to} to={to} className="vg-footer-link">{label}</Link>
                ))}
              </div>
            </div>

            <div className="vg-footer-col">
              <div className="vg-footer-col-title">Platform</div>
              <div className="vg-footer-links">
                {[['AI Trip Planner', '/trip-planner'], ['World Tour', '/world-tour'], ['My Bookings', '/my-bookings'], ['Reviews', '/reviews'], ['User Profile', '/profile']].map(([label, to]) => (
                  <Link key={to} to={to} className="vg-footer-link">{label}</Link>
                ))}
              </div>
            </div>

            <div className="vg-footer-col">
              <div className="vg-footer-col-title">Company</div>
              <div className="vg-footer-links">
                {[['About VoyaGo', '#'], ['Press & Media', '#'], ['Investor Relations', '#'], ['Careers', '#'], ['Partner with Us', '#'], ['Contact Support', '#']].map(([label, to]) => (
                  <a key={label} href={to} className="vg-footer-link">{label}</a>
                ))}
              </div>
            </div>
          </div>

          <div className="vg-footer-bottom">
            <div className="vg-footer-copy">
              © 2025 <span>VoyaGo Technologies Pvt. Ltd.</span> All rights reserved. VoyaGo™ is a registered trademark. Patent pending.
            </div>
            <div className="vg-footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
              <a href="#">Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
