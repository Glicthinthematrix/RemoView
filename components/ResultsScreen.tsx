import React from 'react';
import { SessionResult, ValidationFeedback } from '../types';

interface ResultsScreenProps {
    result: SessionResult;
    onPlayAgain: () => void;
    onViewHistory: () => void;
    onGoHome: () => void;
}

const FeedbackCard: React.FC<{ title: string; feedback: ValidationFeedback }> = ({ title, feedback }) => {
    const { evaluation, guess, actual, explanation } = feedback;

    const evaluationIcon = {
        correct: '✅',
        close: '⚠️',
        wrong: '❌',
    };

    const borderColor = {
        correct: 'border-green-500',
        close: 'border-yellow-500',
        wrong: 'border-red-500',
    };

    return (
        <div className={`bg-gray-800/60 p-4 rounded-lg border-l-4 ${borderColor[evaluation]} shadow-md`}>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-lg font-semibold text-white">
                <span className="mr-2">{evaluationIcon[evaluation]}</span>
                Your guess: <span className="text-cyan-400">{guess}</span>
            </p>
            {evaluation !== 'correct' && <p className="text-md text-gray-300">Actual: <span className="text-purple-400">{actual}</span></p>}
            <p className="text-gray-400 mt-2 text-sm italic">"{explanation}"</p>
        </div>
    );
};

const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, onPlayAgain, onViewHistory, onGoHome }) => {
    const { coordinates, validation, realData, photoUrl, photoAttribution } = result;
    const scoreColor = validation.score >= 75 ? 'text-green-400' : validation.score >= 40 ? 'text-yellow-400' : 'text-red-400';
    
    // Use a reliable, key-less static map provider instead of Google Maps Static API.
    const mapUrl = `https://static-map.openstreetmap.de/staticmap.php?center=${coordinates.lat},${coordinates.lng}&zoom=10&size=600x400&maptype=mapnik&markers=${coordinates.lng},${coordinates.lat},red-pushpin`;

    const formatCoordinates = (coords: { lat: number; lng: number }) => {
        const latDir = coords.lat >= 0 ? 'N' : 'S';
        const lngDir = coords.lng >= 0 ? 'E' : 'W';
        const formattedLat = Math.abs(coords.lat).toFixed(4);
        const formattedLng = Math.abs(coords.lng).toFixed(4);
        return `${formattedLat}° ${latDir}, ${formattedLng}° ${lngDir}`;
    };

    const buttonClasses = "w-full sm:w-auto px-8 py-3 bg-purple-900/30 border-2 border-purple-500 text-purple-200 text-lg font-bold rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:border-purple-300 hover:text-purple-100 focus:outline-none focus:ring-4 focus:ring-purple-500/50 btn-glow-purple";

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center p-6 bg-gray-800/50 rounded-xl shadow-2xl backdrop-blur-sm">
                <h2 className="text-2xl font-semibold text-gray-200">Session Results</h2>
                <p className={`text-7xl font-bold my-2 ${scoreColor}`}>{validation.score}<span className="text-3xl text-gray-400">/100</span></p>
                <p className="text-gray-300">Location: {realData.country} ({realData.continent})</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 p-4 rounded-xl shadow-2xl backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-center mb-3 text-gray-300">Map View</h3>
                    <img src={mapUrl} alt="Map of the target location" className="rounded-lg shadow-lg w-full aspect-[16/10] object-cover" />
                    <p className="text-center text-gray-400 mt-2 text-xs">Coordinates: {formatCoordinates(coordinates)}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl shadow-2xl backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-center mb-3 text-gray-300">Reference Photo</h3>
                    <img src={photoUrl} alt="Representative photo of the location" className="rounded-lg shadow-lg w-full aspect-[16/10] object-cover" />
                    {photoAttribution && <p className="text-center text-gray-400 mt-2 text-xs italic">{photoAttribution}</p>}
                </div>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl backdrop-blur-sm">
                 <h3 className="text-xl font-semibold text-center mb-4">Feedback Analysis</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FeedbackCard title="Impression 1" feedback={validation.feedback.seenObject1} />
                    <FeedbackCard title="Impression 2" feedback={validation.feedback.seenObject2} />
                    <FeedbackCard title="Impression 3" feedback={validation.feedback.seenObject3} />
                    <FeedbackCard title="Continent" feedback={validation.feedback.continent} />
                    <FeedbackCard title="Area Type" feedback={validation.feedback.areaType} />
                    <FeedbackCard title="Language" feedback={validation.feedback.language} />
                 </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                 <button
                    onClick={onPlayAgain}
                    className={buttonClasses}
                >
                    Play Again
                </button>
                <button
                    onClick={onViewHistory}
                    className={buttonClasses}
                >
                    View History
                </button>
                 <button
                    onClick={onGoHome}
                    className={buttonClasses}
                >
                    Go Home
                </button>
            </div>
        </div>
    );
};

export default ResultsScreen;