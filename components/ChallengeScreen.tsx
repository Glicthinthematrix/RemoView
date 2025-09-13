import React, { useState, useEffect, useCallback } from 'react';
import { SessionResult, UserGuesses } from '../types';
import { CONTINENTS, AREA_TYPES } from '../constants';
import { processRemoteViewingSession } from '../services/geminiService';
import LoadingScreen from './LoadingScreen';

interface ChallengeScreenProps {
    onSessionComplete: (result: SessionResult) => void;
}

const generateRandomCoordinates = () => {
    const lat = Math.random() * 180 - 90;
    const lng = Math.random() * 360 - 180;
    return { lat, lng };
};

const formatCoordinates = (coords: { lat: number; lng: number }) => {
    const latDir = coords.lat >= 0 ? 'N' : 'S';
    const lngDir = coords.lng >= 0 ? 'E' : 'W';
    const formattedLat = Math.abs(coords.lat).toFixed(4);
    const formattedLng = Math.abs(coords.lng).toFixed(4);
    return `${formattedLat}° ${latDir}, ${formattedLng}° ${lngDir}`;
};

const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ onSessionComplete }) => {
    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
    const [displayedCoords, setDisplayedCoords] = useState('');
    const [guesses, setGuesses] = useState<UserGuesses>({
        seenObject1: '',
        seenObject2: '',
        seenObject3: '',
        continent: '',
        language: '',
        areaType: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setCoordinates(generateRandomCoordinates());
    }, []);

    useEffect(() => {
        const coordsText = formatCoordinates(coordinates);
        let i = 0;
        setDisplayedCoords('');
        const intervalId = setInterval(() => {
            if (i < coordsText.length) {
                setDisplayedCoords(prev => prev + coordsText.charAt(i));
                i++;
            } else {
                clearInterval(intervalId);
            }
        }, 80);
        return () => clearInterval(intervalId);
    }, [coordinates]);


    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setGuesses(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const genericWords = ['air', 'sky', 'sunlight', 'ground', 'dirt', 'rock'];
        if (
            !guesses.seenObject1 || !guesses.seenObject2 || !guesses.seenObject3 ||
            !guesses.continent || !guesses.language || !guesses.areaType ||
            genericWords.includes(guesses.seenObject1.toLowerCase()) ||
            genericWords.includes(guesses.seenObject2.toLowerCase()) ||
            genericWords.includes(guesses.seenObject3.toLowerCase())
        ) {
            setError('Please fill all psychic fields and avoid generic terms like "air" or "sky".');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            // A single, optimized call to the backend service.
            const { realData, validation, photoUrl, attribution } = await processRemoteViewingSession(coordinates, guesses);

            const result: SessionResult = {
                id: new Date().toISOString(),
                timestamp: new Date().toISOString(),
                coordinates,
                userGuesses: guesses,
                realData,
                validation,
                photoUrl,
                photoAttribution: attribution,
            };
            
            onSessionComplete(result);
        } catch (err) {
            setError('An error occurred during validation. The connection may be unstable. Please try again.');
            setIsLoading(false);
        }
    };
    
    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
            <div className="w-full max-w-lg space-y-6">
                <div className="animate-fade-in pt-16">
                    <p className="text-2xl sm:text-3xl font-mono text-purple-300 tracking-widest text-glow-purple whitespace-nowrap">
                        {displayedCoords || '...'}
                    </p>
                </div>
                
                {error && <div className="border-2 border-red-500/80 bg-red-900/30 text-red-200 px-4 py-3 rounded-lg text-center shadow-[0_0_10px_rgba(239,68,68,0.5)]">{error}</div>}

                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    <div className="space-y-4 animate-slide-in-bottom" style={{animationDelay: '0.3s'}}>
                         <input type="text" name="seenObject1" value={guesses.seenObject1} onChange={handleChange} placeholder="First impression (e.g., river, temple)" className="input-glow w-full rounded-lg p-3 text-center text-lg" required />
                         <input type="text" name="seenObject2" value={guesses.seenObject2} onChange={handleChange} placeholder="A second impression..." className="input-glow w-full rounded-lg p-3 text-center text-lg" required />
                         <input type="text" name="seenObject3" value={guesses.seenObject3} onChange={handleChange} placeholder="And a third..." className="input-glow w-full rounded-lg p-3 text-center text-lg" required />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="animate-slide-in-bottom" style={{animationDelay: '0.5s'}}>
                             <select name="continent" value={guesses.continent} onChange={handleChange} className="input-glow w-full rounded-lg p-3 text-center text-lg" required>
                                <option value="">Which continent is this?</option>
                                {CONTINENTS.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                            </select>
                        </div>
                         <div className="animate-slide-in-bottom" style={{animationDelay: '0.6s'}}>
                            <select name="areaType" value={guesses.areaType} onChange={handleChange} className="input-glow w-full rounded-lg p-3 text-center text-lg" required>
                                <option value="">What type of area?</option>
                                {AREA_TYPES.map(a => <option key={a} value={a} className="bg-gray-900">{a}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="animate-slide-in-bottom" style={{animationDelay: '0.7s'}}>
                        <input type="text" name="language" value={guesses.language} onChange={handleChange} placeholder="What language do they speak?" className="input-glow w-full rounded-lg p-3 text-center text-lg" required />
                    </div>

                    <div className="pt-4 animate-slide-in-bottom" style={{animationDelay: '0.8s'}}>
                        <button type="submit" className="px-12 py-4 bg-purple-900/30 border-2 border-purple-500 text-purple-200 text-2xl font-bold rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:scale-110 hover:border-purple-300 hover:text-purple-100 focus:outline-none focus:ring-4 focus:ring-purple-500/50 btn-glow-purple">
                            Reveal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChallengeScreen;