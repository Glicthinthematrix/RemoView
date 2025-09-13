
import React from 'react';
import { SessionResult } from '../types';

interface HistoryScreenProps {
    history: SessionResult[];
    onBack: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onBack }) => {
    if (history.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-800/50 rounded-xl shadow-2xl backdrop-blur-sm">
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">No History Yet</h2>
                <p className="text-gray-400 mb-6">Complete a session to see your progress here.</p>
                <button
                    onClick={onBack}
                    className="px-8 py-3 bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:bg-gray-600 transform transition-colors duration-300"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-2xl backdrop-blur-sm animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-100">Session History</h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {history.map((session) => {
                     const scoreColor = session.validation.score >= 75 ? 'bg-green-500/80' : session.validation.score >= 40 ? 'bg-yellow-500/80' : 'bg-red-500/80';
                    return (
                        <div key={session.id} className="bg-gray-900/70 p-4 rounded-lg flex items-center justify-between shadow-md">
                            <div>
                                <p className="font-mono text-cyan-300 text-sm">
                                    {session.coordinates.lat.toFixed(2)}, {session.coordinates.lng.toFixed(2)}
                                </p>
                                <p className="text-gray-400 text-xs">
                                    {new Date(session.timestamp).toLocaleString()}
                                </p>
                            </div>
                            <div className={`flex items-center justify-center w-20 h-12 rounded-lg font-bold text-xl text-white ${scoreColor}`}>
                                {session.validation.score}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-8 text-center">
                 <button
                    onClick={onBack}
                    className="px-8 py-3 bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:bg-gray-600 transform transition-colors duration-300"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default HistoryScreen;
