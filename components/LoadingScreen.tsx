import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Calibrating psychic channels…",
    "Reaching across time and space…",
    "Focusing remote perception…",
    "Analyzing geospatial signatures…",
    "Decoding subconscious signals…",
];

const LoadingScreen: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 2500); // Change message every 2.5 seconds

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden">
            {/* Fog/Nebula background effect */}
            <div className="loading-fog-bg"></div>

            {/* Central Pulsing Orb and Rings */}
            <div className="relative flex items-center justify-center w-64 h-64">
                {/* Sonar Rings */}
                <div className="sonar-ring"></div>
                <div className="sonar-ring" style={{ animationDelay: '1s' }}></div>
                <div className="sonar-ring" style={{ animationDelay: '2s' }}></div>
                
                {/* Central Orb */}
                <div className="pulsing-orb"></div>
            </div>

            {/* Cycling Text */}
            <p className="relative z-10 mt-12 text-xl text-purple-200 text-center font-mono tracking-wider animate-fade-in-slow">
                {loadingMessages[messageIndex]}
            </p>
        </div>
    );
};

export default LoadingScreen;
