import React, { useState } from 'react';
import { MapPin, X, Calendar, Star, Camera } from 'lucide-react';

const Destination = () => {
    // Enhanced destinations with more details
    const [destinations] = useState([
        { 
            id: '1', 
            name: "Paris, France", 
            description: "The City of Light awaits with its iconic landmarks, world-class museums, and romantic atmosphere.", 
            lat: 48.8566, 
            lng: 2.3522,
            rating: 4.8,
            bestTime: "April - June, September - October",
            highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame", "Seine River Cruise"]
        },
        { 
            id: '2', 
            name: "Kyoto, Japan", 
            description: "Ancient capital filled with temples, traditional architecture, and serene gardens.", 
            lat: 35.0116, 
            lng: 135.7681,
            rating: 4.9,
            bestTime: "March - May, September - November",
            highlights: ["Fushimi Inari Shrine", "Bamboo Grove", "Golden Pavilion", "Geisha Districts"]
        },
        { 
            id: '3', 
            name: "Bora Bora, French Polynesia", 
            description: "A volcanic island surrounded by crystal-clear lagoons and coral reefs.", 
            lat: -16.5004, 
            lng: -151.7415,
            rating: 4.7,
            bestTime: "May - October",
            highlights: ["Mount Otemanu", "Lagoon Tours", "Coral Gardens", "Overwater Bungalows"]
        },
        { 
            id: '4', 
            name: "Santorini, Greece", 
            description: "Stunning whitewashed buildings perched on volcanic cliffs overlooking the Aegean Sea.", 
            lat: 36.3932, 
            lng: 25.4615,
            rating: 4.6,
            bestTime: "April - June, September - October",
            highlights: ["Oia Sunset", "Blue Domes", "Wine Tasting", "Volcanic Beaches"]
        },
        { 
            id: '5', 
            name: "Machu Picchu, Peru", 
            description: "Ancient Incan citadel high in the Andes Mountains, shrouded in mystery and clouds.", 
            lat: -13.1631, 
            lng: -72.5450,
            rating: 4.9,
            bestTime: "May - September",
            highlights: ["Huayna Picchu", "Inca Trail", "Temple of the Sun", "Sacred Valley"]
        },
        { 
            id: '6', 
            name: "Dubai, UAE", 
            description: "A modern metropolis where futuristic architecture meets traditional Arabian culture.", 
            lat: 25.2048, 
            lng: 55.2708,
            rating: 4.5,
            bestTime: "November - March",
            highlights: ["Burj Khalifa", "Desert Safari", "Gold Souk", "Palm Jumeirah"]
        }
    ]);

    const [photos] = useState([
        { id: 'p1', destinationId: '1', photoUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop", caption: "Eiffel Tower at sunset" },
        { id: 'p2', destinationId: '1', photoUrl: "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&h=300&fit=crop", caption: "Louvre Museum" },
        { id: 'p3', destinationId: '2', photoUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop", caption: "Kyoto Temple" },
        { id: 'p4', destinationId: '2', photoUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop", caption: "Bamboo Forest" },
        { id: 'p5', destinationId: '3', photoUrl: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400&h=300&fit=crop", caption: "Bora Bora Lagoon" },
        { id: 'p6', destinationId: '3', photoUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", caption: "Overwater Bungalows" },
        { id: 'p7', destinationId: '4', photoUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop", caption: "Santorini Sunset" },
        { id: 'p8', destinationId: '4', photoUrl: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=300&fit=crop", caption: "Blue Domes" },
        { id: 'p9', destinationId: '5', photoUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop", caption: "Machu Picchu Ruins" },
        { id: 'p10', destinationId: '5', photoUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&h=300&fit=crop", caption: "Andes Mountains" },
        { id: 'p11', destinationId: '6', photoUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop", caption: "Dubai Skyline" },
        { id: 'p12', destinationId: '6', photoUrl: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&h=300&fit=crop", caption: "Burj Khalifa" }
    ]);

    const [selectedDestination, setSelectedDestination] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const openModal = (destination) => {
        setSelectedDestination(destination);
        setIsModalOpen(true);
        setSelectedImageIndex(0);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDestination(null);
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
        }
        if (hasHalfStar) {
            stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />);
        }
        return stars;
    };

    const getDestinationPhotos = (destinationId) => {
        return photos.filter(p => p.destinationId === destinationId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header Section */}
                <header className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
                        <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Destination Explorer
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover breathtaking destinations around the world and create memories that last a lifetime
                    </p>
                </header>

                {/* Destinations Grid */}
                <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {destinations.map((destination, index) => {
                        const destinationPhotos = getDestinationPhotos(destination.id);
                        const mainPhoto = destinationPhotos[0];
                        
                        return (
                            <div
                                key={destination.id}
                                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                                onClick={() => openModal(destination)}
                            >
                                {/* Card Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img 
                                        src={mainPhoto?.photoUrl || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop`} 
                                        alt={destination.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                                        {renderStars(destination.rating)}
                                        <span className="text-sm font-semibold ml-1">{destination.rating}</span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center text-white text-sm">
                                        <Camera className="w-4 h-4 mr-1" />
                                        {destinationPhotos.length} photos
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                        {destination.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {destination.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            Best: {destination.bestTime.split(',')[0]}
                                        </div>
                                    </div>

                                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                                        Explore Destination
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </main>
            </div>

            {/* Enhanced Modal */}
            {isModalOpen && selectedDestination && (
                <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedDestination.name}</h2>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1">
                                        {renderStars(selectedDestination.rating)}
                                        <span className="font-semibold ml-1">{selectedDestination.rating}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        Best time: {selectedDestination.bestTime}
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Description */}
                            <div className="mb-8">
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    {selectedDestination.description}
                                </p>
                            </div>

                            {/* Highlights */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Attractions</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {selectedDestination.highlights.map((highlight, index) => (
                                        <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 text-center">
                                            <span className="text-sm font-medium text-gray-700">{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Photo Gallery */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Photo Gallery</h3>
                                {(() => {
                                    const destinationPhotos = getDestinationPhotos(selectedDestination.id);
                                    if (destinationPhotos.length === 0) {
                                        return (
                                            <div className="text-center py-8 text-gray-500">
                                                <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                <p>No photos available for this destination.</p>
                                            </div>
                                        );
                                    }
                                    
                                    return (
                                        <div className="space-y-4">
                                            {/* Main Image */}
                                            <div className="relative">
                                                <img 
                                                    src={destinationPhotos[selectedImageIndex]?.photoUrl} 
                                                    alt={destinationPhotos[selectedImageIndex]?.caption}
                                                    className="w-full h-96 object-cover rounded-xl shadow-lg"
                                                />
                                                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                                                    {destinationPhotos[selectedImageIndex]?.caption}
                                                </div>
                                            </div>
                                            
                                            {/* Thumbnail Navigation */}
                                            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                                {destinationPhotos.map((photo, index) => (
                                                    <button
                                                        key={photo.id}
                                                        onClick={() => setSelectedImageIndex(index)}
                                                        className={`relative rounded-lg overflow-hidden transition-all duration-200 ${
                                                            selectedImageIndex === index 
                                                                ? 'ring-4 ring-blue-500 scale-105' 
                                                                : 'hover:scale-105'
                                                        }`}
                                                    >
                                                        <img 
                                                            src={photo.photoUrl} 
                                                            alt={photo.caption}
                                                            className="w-full h-16 object-cover"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Interactive Map Placeholder */}
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Location</h3>
                                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-8 text-center">
                                    <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{selectedDestination.name}</h4>
                                    <p className="text-gray-600">
                                        Coordinates: {selectedDestination.lat.toFixed(4)}, {selectedDestination.lng.toFixed(4)}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Interactive map integration available with Google Maps API
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Destination;