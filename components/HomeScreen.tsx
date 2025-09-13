import React from 'react';

interface HomeScreenProps {
    onStart: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStart }) => {
    return (
        <>
            <div className="nebula-bg"></div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center p-6 animate-fade-in">
                <div className="max-w-2xl">
                    <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-purple-300 text-glow-purple">
                        RemoView
                    </h1>
                    <p className="text-xl text-gray-400 mt-4 mb-12">
                        Unlock the hidden power of perception.
                    </p>
                    
                    <button
                        onClick={onStart}
                        className="px-12 py-4 bg-purple-900/30 border-2 border-purple-500 text-purple-200 text-2xl font-bold rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:scale-110 hover:border-purple-300 hover:text-purple-100 focus:outline-none focus:ring-4 focus:ring-purple-500/50 btn-glow-purple"
                    >
                        Explore
                    </button>

                    <p className="text-gray-600 mt-20 text-md">
                        Your journey begins beyond the senses. What will you see?
                    </p>
                </div>
            </div>
        </>
    );
};

export default HomeScreen;