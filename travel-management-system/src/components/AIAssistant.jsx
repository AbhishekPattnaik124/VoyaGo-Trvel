import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaMagic } from 'react-icons/fa';
import PaymentModal from './PaymentModal';
import './AIAssistant.css';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: "Hello! I'm your VoyaGo AI Concierge 🤖✈️. I can help recommend destinations or even book your entire trip right here. Tell me, what kind of vacation are you dreaming of?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    
    // Booking states
    const [pendingBooking, setPendingBooking] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [awaitingDetails, setAwaitingDetails] = useState(false);

    const messagesEndRef = useRef(null);

    const tourPackages = [
        { id: 1, name: "Paris Romantic Getaway", keywords: ['paris', 'france', 'romantic', 'europe', 'eiffel'], destination: "Paris, France", price: 1500, days: 5 },
        { id: 2, name: "Tokyo Extravaganza", keywords: ['tokyo', 'japan', 'asia', 'sushi', 'anime', 'tech'], destination: "Tokyo, Japan", price: 2200, days: 7 },
        { id: 3, name: "Swiss Alps Adventure", keywords: ['swiss', 'switzerland', 'alps', 'snow', 'ski', 'mountain'], destination: "Zurich, Switzerland", price: 1800, days: 6 }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        // Simulated AI Logic
        setTimeout(() => {
            processAIResponse(userMsg.toLowerCase());
        }, 1500);
    };

    const processAIResponse = (text) => {
        setIsTyping(false);

        if (awaitingDetails) {
            // Very simple extraction: assume "Name, Email"
            const parts = text.split(',');
            if (parts.length >= 2) {
                setCustomerName(parts[0].trim());
                setCustomerEmail(parts[1].trim());
                setAwaitingDetails(false);
                setMessages(prev => [...prev, { 
                    sender: 'ai', 
                    text: `Thanks ${parts[0].trim()}! I have your details. I will now open the secure payment portal for the ${pendingBooking.name}.` 
                }]);
                setTimeout(() => setShowPayment(true), 1500);
            } else {
                setMessages(prev => [...prev, { sender: 'ai', text: "Please provide your Name and Email separated by a comma (e.g., John Doe, john@example.com)." }]);
            }
            return;
        }

        // Check for keywords
        let foundPackage = null;
        for (const pkg of tourPackages) {
            if (pkg.keywords.some(kw => text.includes(kw))) {
                foundPackage = pkg;
                break;
            }
        }

        if (foundPackage) {
            setMessages(prev => [...prev, { 
                sender: 'ai', 
                text: `I highly recommend our **${foundPackage.name}**! It's a gorgeous ${foundPackage.days}-day trip to ${foundPackage.destination} bundled with flight, hotel, and transport for only $${foundPackage.price}.`,
                action: { type: 'book', pkg: foundPackage }
            }]);
        } else if (text.includes('book') || text.includes('reserve')) {
            setMessages(prev => [...prev, { sender: 'ai', text: "I can book trips to Paris, Tokyo, or the Swiss Alps. Which destination catches your eye?" }]);
        } else {
            setMessages(prev => [...prev, { sender: 'ai', text: "That sounds amazing! Whether you want to ski in the Swiss Alps, explore Tokyo, or relax in Paris, I can arrange everything. Which of those sounds best to you?" }]);
        }
    };

    const initiateBooking = (pkg) => {
        setPendingBooking(pkg);
        setAwaitingDetails(true);
        setMessages(prev => [...prev, { 
            sender: 'ai', 
            text: `Excellent choice! Let's book the ${pkg.name}. To finalize the reservation, please reply with your Full Name and Email Address, separated by a comma (e.g., John Doe, john@example.com).` 
        }]);
    };

    const handleConfirmPayment = async () => {
        setShowPayment(false);
        setMessages(prev => [...prev, { sender: 'ai', text: "Processing your all-inclusive booking securely..." }]);
        setIsTyping(true);

        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 14);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + pendingBooking.days);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://voyago-trvel-2.onrender.com'}/api/tours/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName,
                    customerEmail,
                    tourName: pendingBooking.name,
                    destination: pendingBooking.destination,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    price: pendingBooking.price
                })
            });

            if (!response.ok) throw new Error("Booking failed");

            setIsTyping(false);
            setMessages(prev => [...prev, { 
                sender: 'ai', 
                text: `🎉 **Success!** Your ${pendingBooking.name} is fully booked! I've reserved your flight, hotel, and transport. A detailed itinerary has been sent to ${customerEmail}. Have a fantastic trip!` 
            }]);
            setPendingBooking(null);
            
        } catch (error) {
            setIsTyping(false);
            setMessages(prev => [...prev, { sender: 'ai', text: "Oops, something went wrong with the booking server. Please try again later." }]);
            setPendingBooking(null);
        }
    };

    return (
        <>
            <div className={`ai-fab ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
                <div className="fab-icon-wrapper">
                    <FaMagic className="magic-sparkle" />
                    <FaRobot className="robot-icon" />
                </div>
                <span className="fab-tooltip">AI Assistant</span>
            </div>

            <div className={`ai-chat-window glass-panel ${isOpen ? 'open' : ''}`}>
                <div className="ai-chat-header">
                    <div className="ai-header-info">
                        <div className="ai-avatar"><FaRobot /></div>
                        <div>
                            <h3>VoyaGo AI Concierge</h3>
                            <span className="online-status">● Online</span>
                        </div>
                    </div>
                    <button className="btn-close" onClick={() => setIsOpen(false)}><FaTimes /></button>
                </div>

                <div className="ai-chat-body">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`ai-message-wrapper ${msg.sender}`}>
                            <div className="ai-message">
                                <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                {msg.action && msg.action.type === 'book' && (
                                    <button 
                                        className="ai-action-btn"
                                        onClick={() => initiateBooking(msg.action.pkg)}
                                    >
                                        Book {msg.action.pkg.name} Now
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="ai-message-wrapper ai">
                            <div className="ai-message typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="ai-chat-footer">
                    <input 
                        type="text" 
                        placeholder={awaitingDetails ? "John Doe, john@example.com" : "Ask for travel recommendations..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={handleSend} className="btn-send"><FaPaperPlane /></button>
                </div>
            </div>

            {showPayment && pendingBooking && (
                <div style={{zIndex: 10000, position: 'relative'}}>
                    <PaymentModal 
                        amount={pendingBooking.price}
                        onConfirm={handleConfirmPayment}
                        onCancel={() => {
                            setShowPayment(false);
                            setMessages(prev => [...prev, { sender: 'ai', text: "Payment cancelled. Let me know if you want to book something else!" }]);
                            setPendingBooking(null);
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default AIAssistant;
